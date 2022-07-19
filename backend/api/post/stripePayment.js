const app = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const _ = require("lodash");
const assign = require("assign-deep");
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const stripeWebhookSignature = process.env.STRIPE_WEBHOOK_SIGNATURE;
const bodyParser = require('body-parser');



app.post("/stripe-getAccount", (req, res, next) => {
    const stripeAccountId = "acct_1IQhxbR4dWSSS3BQ";
    if (!stripeAccountId) {
        return res.send({
            success: true,
            message: 'Missing Stripe account.',
            setupBegan: false,
            account: null
        });
    } else {
        stripe.accounts.retrieve(stripeAccountId, (err, account) => {
            if (err) {
                res.send({
                    success: false,
                    message: "Error:",
                    setupBegan: false,
                    account: null
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Stripe account.',
                    setupBegan: true,
                    account: account
                });
            }
        });
    }
});
app.post("/stripe-createAccount", (req, res, next) => {
    let country = req.body.country;
    console.log(country);
    if (!(country == "CA" || country == "US")) {
        return res.send({
            success: false,
            message: "Invalid country"
        });
    }
    stripe.accounts.create({
        type: 'custom',
        country: country,
        email: "meza.marc@hotmail.com",
        requested_capabilities: ["transfers", "card_payments"],
        business_type: "individual"
    }, (err, account) => {
        if (err) {
            res.send({
                success: false,
                message: "Error: " + err.message
            });
        } else {
            console.log(account.id);
            stripe.accounts.update(account.id, {
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.connection.remoteAddress
                }
            }).then(() => {
                res.send({
                    success: true,
                    message: "Account setup has begun",
                    accountId: account.id
                });
            });
        }
    });
});
app.post("/stripe-saveFieldsNeeded", (req, res, next) => {
    const stripeAccountId = "acct_1IQhxbR4dWSSS3BQ";
    if (!stripeAccountId) {
        return res.send({
            success: true,
            message: 'Missing Stripe account.',
            setupBegan: false,
            account: null
        });
    } else {
        console.log(req.body);
        // let i = 0;
        // let stripeObj = {};
        // _.forEach(req.body, (value, key) => {
        //     const obj = nestObj(key, value);
        //     stripeObj = assign(stripeObj, obj);
        //     i++;


        //     if (i === Object.keys(obj).length) {

        //         stripe.accounts.update(
        //             stripeAccountId,
        //             obj
        //         ).then(() => {
        //             return res.send({
        //                 success: true,
        //                 message: "saved"
        //             });
        //         }, (err) => {
        //             console.log(err);
        //             return res.send({
        //                 success: false,
        //                 message: "Error"
        //             });
        //         });
        //     }

        // });
    }
});












//FOR BUYING

//WHEN CLICKS ON PURCHASE SUBMIT BUTTON, RESERVES THE PRODUCT FOR 30 SECONDS IF AVAILABLE AND CREATES STRIPE INTENT
app.post("/paymentIntent", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.listingId == "undefined" || typeof req.body.shippingAddress == "undefined" || req.body.listingId == null || typeof req.body.offerId == "undefined") {
        return res.status(400).send({ message: "Missing fields." });
    }
    try {
        let listingId = req.body.listingId;
        let shippingAddress = req.body.shippingAddress;
        let thirtySecondsAgo = new Date();
        let listingAvailability = await pool.query("SELECT status FROM listings WHERE id=$1 LIMIT 1", [listingId]);
        if (listingAvailability.rows.length == 0 || listingAvailability.rows[0].status != 0) {
            return res.status(400).send({ message: "This item has already been sold." })
        }
        if (req.body.offerId != null) {
            let offerValidity = await pool.query("SELECT status FROM offers WHERE id=$1 and listingid = $2 LIMIT 1", [req.body.offerId, listingId]);
            if (offerValidity.rows.length == 0 || offerValidity.rows[0].status != 1) {
                return res.status(400).send({ message: "This offer is not valid." })
            }
        }
        thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
        let findExistingIntent = await pool.query("SELECT buyerid, id, stripeclientsecret, numberTries, offerId FROM transactionIntent WHERE listingId = $1 AND timestamp > $2", [listingId, thirtySecondsAgo]);
        if (findExistingIntent.rows.length > 0) {
            if (findExistingIntent.rows[0].buyerid == res.locals.userId) {
                if (findExistingIntent.rows[0].numberTries >= 10) {
                    return res.status(400).send({ message: "You have tried too many times to purchase this item. Please try again later." })
                }
                let getStripeCustomerId = await pool.query("SELECT stripecustomerid FROM users WHERE id = $1 LIMIT 1", [res.locals.userId]);
                if (findExistingIntent.rows[0].offerId == null) {
                    if (req.body.offerId == null) {
                        //same intent
                        let updateNumberTries = await pool.query("UPDATE transactionIntent SET numbertries = numbertries+1 WHERE id = $1", [findExistingIntent.rows[0].id]);
                        return res.send({ clientSecret: findExistingIntent.rows[0].stripeclientsecret });
                    } else {
                        //buy from offer
                        let oneMinuteAgo = new Date();
                        oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
                        let invalidateLastTransactionIntent = await pool.query("UPDATE transactionIntent SET timestamp = $1", [oneMinuteAgo]);
                        let findOffer = await pool.query("SELECT amount FROM offers WHERE status=1 AND (senderid = $1 OR receiverid = $1) AND id=$2 LIMIT 1", [res.locals.userId, req.body.offerId]);
                        if (findOffer.rows.length > 0) {
                            let insertReservation = "INSERT INTO transactionIntent (listingId, buyerId, offerId, stripeclientsecret, shippingaddress) VALUES ($1, $2, $3, $4, $5) RETURNING id";
                            let stripeCustomerId = getStripeCustomerId.rows[0].stripecustomerid;
                            const intent = await stripe.paymentIntents.create({
                                amount: findOffer.rows[0].amount,
                                currency: 'usd',
                                customer: stripeCustomerId,
                            });
                            reservation = await pool.query(insertReservation, [listingId, res.locals.userId, req.body.offerId, intent.client_secret, shippingAddress]);
                            return res.send({ clientSecret: intent.client_secret });
                        } else {
                            return res.status(400).send({ message: "Offer not found." });
                        }
                    }
                } else {
                    if (req.body.offerId == null) {
                        //buy now price
                        let oneMinuteAgo = new Date();
                        oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
                        let invalidateLastTransactionIntent = await pool.query("UPDATE transactionIntent SET timestamp = $1", [oneMinuteAgo]);
                        let findBuyNowPrice = await pool.query("SELECT price FROM listings WHERE id=$1 LIMIT 1", [listingId]);
                        let insertReservation = "INSERT INTO transactionIntent (listingId, buyerId, stripeclientsecret, shippingaddress) VALUES ($1, $2, $3, $4) RETURNING id";
                        let stripeCustomerId = getStripeCustomerId.rows[0].stripecustomerid;
                        const intent = await stripe.paymentIntents.create({
                            amount: findBuyNowPrice.rows[0].price,
                            currency: 'usd',
                            customer: stripeCustomerId,
                        });
                        reservation = await pool.query(insertReservation, [listingId, res.locals.userId, intent.client_secret, shippingAddress]);
                        return res.send({ clientSecret: intent.client_secret });
                    } else if (req.body.offerId == findExistingIntent.rows[0].offerId) {
                        //same intent
                        let updateNumberTries = await pool.query("UPDATE transactionIntent SET numbertries = numbertries+1 WHERE id = $1", [findExistingIntent.rows[0].id]);
                        return res.send({ clientSecret: findExistingIntent.rows[0].stripeclientsecret });
                    } else {
                        //buy from different offer
                        let oneMinuteAgo = new Date();
                        oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
                        let invalidateLastTransactionIntent = await pool.query("UPDATE transactionIntent SET timestamp = $1", [oneMinuteAgo]);
                        let findOffer = await pool.query("SELECT amount FROM offers WHERE status=1 AND (senderid = $1 OR receiverid = $1) AND id=$2 LIMIT 1", [res.locals.userId, req.body.offerId]);
                        if (findOffer.rows.length > 0) {
                            let insertReservation = "INSERT INTO transactionIntent (listingId, buyerId, offerId, stripeclientsecret, shippingaddress) VALUES ($1, $2, $3, $4, $5) RETURNING id";
                            let stripeCustomerId = getStripeCustomerId.rows[0].stripecustomerid;
                            const intent = await stripe.paymentIntents.create({
                                amount: findOffer.rows[0].amount,
                                currency: 'usd',
                                customer: stripeCustomerId,
                            });
                            reservation = await pool.query(insertReservation, [listingId, res.locals.userId, req.body.offerId, intent.client_secret, shippingAddress]);
                            return res.send({ clientSecret: intent.client_secret });
                        } else {
                            return res.status(400).send({ message: "Offer not found." });
                        }
                    }
                }
            } else {
                return res.status(400).send({ message: "Sorry someone is already purchasing this item." })
            }
        } else {
            let getStripeCustomerId = await pool.query("SELECT stripecustomerid FROM users WHERE id=$1 LIMIT 1", [res.locals.userId]);
            if (getStripeCustomerId.rows.length > 0) {

                let reservation;
                if (req.body.offerId == null) {
                    //buy now price
                    let findBuyNowPrice = await pool.query("SELECT price FROM listings WHERE id=$1 LIMIT 1", [listingId]);
                    let insertReservation = "INSERT INTO transactionIntent (listingId, buyerId, stripeclientsecret, shippingaddress) VALUES ($1, $2, $3, $4) RETURNING id";
                    let stripeCustomerId = getStripeCustomerId.rows[0].stripecustomerid;
                    console.log(stripeCustomerId);
                    const intent = await stripe.paymentIntents.create({
                        amount: findBuyNowPrice.rows[0].price,
                        currency: 'usd',
                        customer: stripeCustomerId,
                    });
                    reservation = await pool.query(insertReservation, [listingId, res.locals.userId, intent.client_secret, shippingAddress]);
                    return res.send({ clientSecret: intent.client_secret });
                } else {
                    //buy from offer
                    let findOffer = await pool.query("SELECT amount FROM offers WHERE status=1 AND (senderid = $1 OR receiverid = $1) AND id=$2 LIMIT 1", [res.locals.userId, req.body.offerId]);
                    if (findOffer.rows.length > 0) {
                        let insertReservation = "INSERT INTO transactionIntent (listingId, buyerId, offerId, stripeclientsecret, shippingaddress) VALUES ($1, $2, $3, $4, $5) RETURNING id";
                        let stripeCustomerId = getStripeCustomerId.rows[0].stripecustomerid;
                        const intent = await stripe.paymentIntents.create({
                            amount: findOffer.rows[0].amount,
                            currency: 'usd',
                            customer: stripeCustomerId,
                        });
                        reservation = await pool.query(insertReservation, [listingId, res.locals.userId, req.body.offerId, intent.client_secret, shippingAddress]);
                        return res.send({ clientSecret: intent.client_secret });
                    } else {
                        return res.status(400).send({ message: "Offer not found." });
                    }
                }

            } else {
                //error
                res.status(500).send({ message: "There has been a server error, please try again." });
            }
        }
    } catch (err) {
        //error
        console.log(err);
        res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


//STRIPE WEBHOOK FOR PAYMENT NOTIFICATION
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    let event;
    const sig = request.headers['stripe-signature'];
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, stripeWebhookSignature);
    }
    catch (err) {
        console.log(err);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
            let paymentIntentId = paymentIntent.client_secret;
            // let customerId = paymentIntent.customer;
            let details = await pool.query("SELECT listingid, buyerid, offerid, id, shippingaddress FROM transactionintent WHERE stripeclientsecret = $1", [paymentIntentId]);
            console.log(details);
            if (details.rows.length == 0) {
                return response.status(400).send(`Webhook Error INVALID TRX INTENT`);
            }
            let updateListing = await pool.query("UPDATE listings SET status = 1 WHERE id = $1 RETURNING id", [details.rows[0].listingid]);
            let newTransaction = await pool.query("INSERT INTO transactions (listingid, buyerid, transactionintentid, offerid, ordernb, shippingaddress) VALUES ($1, $2, $3, $4, $5, $6)", [details.rows[0].listingid, details.rows[0].buyerid, details.rows[0].id, details.rows[0].offerid, details.rows[0].id.toString(16), details.rows[0].shippingaddress]);
            console.log('PaymentIntent was successful!');
            console.log(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
});


module.exports = app;