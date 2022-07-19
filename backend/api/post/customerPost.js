const app = require("express").Router();
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const crypto = require("crypto");
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const webpush = require('web-push');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const slackUtil = require("../utils/slackUtils");




webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_SECRET_KEY)

const oauth2Client = new OAuth2(
    "480633103358-ha764imqtfkiebj0jqolieuupqdepdqq.apps.googleusercontent.com",
    "AkeNhhbcGSYSJB_7vXHNtjw-", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
    refresh_token: "1//04GRQ1ON9A1PgCgYIARAAGAQSNwF-L9IrLEllR9TppAzLyPo7Nyw4ZplOrbShKbhbgYqg22AaXcPqIqA4eaQxv4Evf1zixHXVUnc"
});
const accessToken = oauth2Client.getAccessToken()


const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "contact@joincambio.com",
        clientId: "480633103358-ha764imqtfkiebj0jqolieuupqdepdqq.apps.googleusercontent.com",
        clientSecret: "AkeNhhbcGSYSJB_7vXHNtjw-",
        refreshToken: "1//04GRQ1ON9A1PgCgYIARAAGAQSNwF-L9IrLEllR9TppAzLyPo7Nyw4ZplOrbShKbhbgYqg22AaXcPqIqA4eaQxv4Evf1zixHXVUnc",
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    }
});


app.post("/addUserToWaitlist", async function (req, res) {
    if (typeof req.body.email !== 'undefined' && req.body.email.length < 255 && emailRegex.test(req.body.email) == true) {
        try {
            let responseObj = {};
            const findUsersSameEmail = await pool.query("SELECT email FROM waitlist WHERE email = $1 LIMIT 1", [req.body.email]);
            if (findUsersSameEmail.rows.length > 0) {
                //email already used
                return res.sendStatus(403);
            } else {
                const id = crypto.randomBytes(16).toString("hex");
                responseObj.shareToken = id;
                const newUser = await pool.query("INSERT INTO waitlist (email, referralToken) VALUES($1, $2) RETURNING ID", [req.body.email, id]);
                if (req.body.refToken) {
                    const findReferralUser = await pool.query("SELECT id, email FROM waitlist WHERE referralToken = $1 LIMIT 1", [req.body.refToken]);
                    if (findReferralUser.rows.length > 0) {
                        responseObj.referralEmail = findReferralUser.rows[0].email;
                        const registerReferral = await pool.query("INSERT INTO referrals (originalUserId, newUserId) VALUES($1, $2)", [findReferralUser.rows[0].id, newUser.rows[0].id]);
                    }
                }


                let htmlContent = "<p><span style='font-family: Calibri, sans-serif;'><img src='https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png' style='text-align: center; width: 207px;'></span></p><br><p><span style='font-family: Calibri, sans-serif;'>Hi there,</span></p><pre><span style='font-family: Calibri, sans-serif;'>Thank you! You&apos;ve been added to Cambio&apos;s waitlist.</span></pre><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><span style='font-family: Calibri, sans-serif;'><strong>Interested in priority access?</strong></span></p><p><span style='font-family: Calibri, sans-serif;'>Get early access by referring your friends. <strong>Refer 5 friends:</strong> you&apos;ll skip the waitlist &amp; be in the first batch of users. Just share this link: www.joincambio.com?ref=" + id + "</span></p><p><span style='font-family: Calibri, sans-serif;'>Questions? Email us at: <a href='mailto:contact@joincambio.com'>contact@joincambio.com</a></span></p><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><span style='font-family: Calibri, sans-serif;'>Thanks,</span></p><p><span style='font-family: Calibri, sans-serif;'>The team at Cambio</span></p><p><span style='font-family: Calibri, sans-serif;'><a href='//​www.joincambio.com'>www.joincambio.com</a> <br></span></p><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><br></p>"


                var mailOptions = {
                    from: "Cambio contact@joincambio.com",
                    to: req.body.email,
                    subject: 'Welcome to Cambio!',
                    html: htmlContent
                }
                smtpTransport.sendMail(mailOptions, (error, response) => {
                    error ? console.log(error) : console.log(response);
                    smtpTransport.close();
                });



                slackUtil.cheerWaitlist(req.body.email);
                return res.status(200).send(responseObj);
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.sendStatus(500);
        }
    } else {
        return res.sendStatus(500);
    }
});

app.post('/signupUser', async function (req, res) {
    req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : "";
    req.body.username = !isEmpty(req.body.username) ? req.body.username : "";



    if (!Validator.isEmpty(req.body.email) && !Validator.isEmpty(req.body.password) && !Validator.isEmpty(req.body.username) && (typeof req.body.token != "undefined" || (typeof req.body.guestUserId != "undefined" && typeof req.body.guestUserPassword != "undefined"))) {
        let saltRoundsBcrypt = 10;
        let email = req.body.email;
        let uname = req.body.username;
        try {
            if(typeof req.body.guestUserId != "undefined" && typeof req.body.guestUserPassword != "undefined"){
                const findUsersSameEmail = await pool.query("SELECT email FROM users WHERE email = $1 LIMIT 1", [email]);
                if (findUsersSameEmail.rows.length > 0) {
                    //email already used
                    return res.status(400).send({ message: "This email already exists." });
                } else {
                    let findUname = await pool.query("SELECT COUNT(id) FROM users WHERE lower(name) = $1", [uname]);
                    if (findUname.rows[0].count > 0) {
                        return res.status(400).send({ message: "This username is already taken." });
                    }

                    bcrypt.hash(req.body.password, saltRoundsBcrypt, async function (err, hash) {
                        if (err) {
                            slackUtil.sendErrorLog(err)
                            return res.status(500).send({ message: "There has been a server error, please try again." });
                        } else {
                            console.log("yp");
                            const customer = await stripe.customers.create({ email: email });
                            const newUser = await pool.query("UPDATE users SET email = $1, password = $2, name = $3, stripecustomerid = $4 WHERE id = $5 AND password = $6 AND isguest=true", [email, hash, uname, customer.id, req.body.guestUserId, req.body.guestUserPassword]);
                            if(newUser.rowCount == 0){
                                return res.status(400).send({message:"We're sorry, your guest user token doesn't seem valid."});
                            }else{
                                return res.sendStatus(200);
                            }
                        }
                    });
                }
            }else{
                let findToken = await pool.query("SELECT email FROM waitlist WHERE id=$1", [req.body.token]);
                if (findToken.rows.length == 0) {
                    return res.status(400).send({ message: "Your waitlist token does not seem valid." });
                }
                const findUsersSameEmail = await pool.query("SELECT email FROM users WHERE email = $1 LIMIT 1", [email]);
                if (findUsersSameEmail.rows.length > 0) {
                    //email already used
                    return res.status(400).send({ message: "This email already exists." });
                } else {
                    let findUname = await pool.query("SELECT COUNT(id) FROM users WHERE lower(name) = $1", [uname]);
                    if (findUname.rows[0].count > 0) {
                        return res.status(400).send({ message: "This username is already taken." });
                    }
                    bcrypt.hash(req.body.password, saltRoundsBcrypt, async function (err, hash) {
                        if (err) {
                            slackUtil.sendErrorLog(err)
                            return res.status(500).send({ message: "There has been a server error, please try again." });
                        } else {
                            const customer = await stripe.customers.create({ email: email });
                            console.log(customer);
                            const newUser = await pool.query("INSERT INTO users (email, password, name, stripecustomerid) VALUES($1, $2, $3, $4) RETURNING id", [email, hash, uname, customer.id]);
                            return res.sendStatus(200);
                        }
                    });
                }
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });

        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});



app.post('/loginUser', async function (req, res) {
    req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : "";
    if (!Validator.isEmpty(req.body.email) && !Validator.isEmpty(req.body.password)) {
        let email = req.body.email;
        try {
            const findUsersSameEmail = await pool.query("SELECT password, id, isAccountSetup, name FROM users WHERE email = $1 LIMIT 1", [email]);
            if (findUsersSameEmail.rows.length > 0) {

                //email exists
                let userPass = findUsersSameEmail.rows[0].password;
                let userId = findUsersSameEmail.rows[0].id;
                let isAccountSetup = findUsersSameEmail.rows[0].isaccountsetup;
                let userName = findUsersSameEmail.rows[0].name;
                bcrypt.compare(req.body.password, userPass, function (err, resBcrypt) {
                    // res == true
                    if (err) {
                        slackUtil.sendErrorLog(err)
                        return res.status(500).send({ message: "There has been a server error, please try again." });
                    } else {
                        //pass match
                        if (resBcrypt == true) {
                            const payload = {
                                id: userId
                            };
                            jwt.sign(
                                payload,
                                process.env.JWT_SECRET_KEY,
                                {
                                    expiresIn: 31556926 // 1 year in seconds
                                },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: token,
                                        isAccountSetup: isAccountSetup,
                                        name: userName
                                    });
                                }
                            );
                        } else {
                            return res.status(400).send({ message: "This password is incorrect." });
                        }
                    }
                });
            } else {
                return res.status(400).send({ message: "This email is not registered." });
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/saveListing", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof req.body.id !== 'undefined' && typeof res.locals.userId !== 'undefined') {
        try {
            let saveListing = await pool.query("INSERT INTO saved (userId, listingId) VALUES ($1, $2)", [res.locals.userId, req.body.id]);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing fields." });
    }
});


app.post("/submitContactUsForm", function (req, res) {
    if (req.body.email && req.body.message && req.body.name && emailRegex.test(req.body.email) == true) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(500);
    }
});


app.post("/makeOffer", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof req.body.listingId !== 'undefined' && typeof req.body.amount !== 'undefined' && typeof res.locals.userId !== 'undefined') {
        try {
            let price = Math.round(parseFloat(req.body.amount) * 100);
            let getSeller = await pool.query("SELECT sellerid FROM listings WHERE id=$1", [req.body.listingId]);
            if (getSeller.rows.length > 0) {
                let makeOffer = await pool.query("INSERT INTO offers (listingId, amount, senderId, receiverId, status) VALUES ($1, $2, $3, $4, 0)", [req.body.listingId, price, res.locals.userId, getSeller.rows[0].sellerid]);
                return res.sendStatus(200);
            }
            res.status(500).send({ message: "That's odd, we couldn't find the seller of this listing." });
        } catch (err) {
            console.log(err);
            slackUtil.sendErrorLog(err)
            res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Please fill in all the fields." });
    }
});



app.post("/followUser", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (req.body.id && req.body.id != res.locals.userId) {
        try {
            let findFollow = await pool.query("SELECT id FROM followUsers WHERE followerid=$1 AND followeduserId=$2", [res.locals.userId, req.body.id]);
            if (findFollow.rows.length > 0) {
                let deleteFollow = await pool.query("DELETE FROM followUsers WHERE followerid=$1 AND followeduserId=$2", [res.locals.userId, req.body.id]);
                return res.status(200).send({ isFollowing: false });
            } else {
                let followUser = await pool.query("INSERT INTO followusers (followerid, followeduserId) VALUES ($1, $2)", [res.locals.userId, req.body.id]);
                return res.status(200).send({ isFollowing: true });
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/script", async function (req, res) {
    let sql1 = "SELECT id from filtertypes where type=0";
    let sql2 = "INSERT INTO filtervalues (textvalue, filtertypeid, value) VALUES ($1, $3, $4), ($2, $3, $5)";
    let q1 = await pool.query(sql1);
    for (let i = 0; i < q1.rows.length; i++) {
        await pool.query(sql2, ['yes', 'no', q1.rows[i].id, 1, 0]);
    }
});

app.post("/updateProfile", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (req.body.bio || req.body.shippingAddress) {
        let propertiesArray = [];
        let sql = "UPDATE users SET";

        let counter = 1;
        if(req.body.bio){
            sql += " bio = $"+counter;
            propertiesArray.push(req.body.bio);
            counter++;
        }
        if(req.body.shippingAddress){
            sql += " shippingAddress = $"+counter;
            propertiesArray.push(req.body.shippingAddress);
            counter++;
        }

        sql+= " WHERE id = $"+counter;
        propertiesArray.push(res.locals.userId);

        try {
            let query = await pool.query(sql, propertiesArray);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please provide your bio." });
    }
});


app.post("/acceptOffer", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (req.body.offerId) {
        try {
            let acceptOffer = await pool.query("UPDATE offers SET status = 1 WHERE id = $1 AND receiverid=$2", [req.body.offerId, res.locals.userId]);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Looks like we're missing an offer id." });
    }
});

app.post("/declineOffer", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (req.body.offerId) {
        try {
            let declineOffer = await pool.query("UPDATE offers SET status = 2 WHERE id = $1 AND receiverid=$2", [req.body.offerId, res.locals.userId]);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Looks like we're missing an offer id." });
    }
});

app.post("/submitCounterOffer", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (req.body.offerId && req.body.offerValue) {
        try {
            let declineOffer = await pool.query("UPDATE offers SET status = 2 WHERE id = $1 AND receiverid=$2 RETURNING senderid, listingid", [req.body.offerId, res.locals.userId]);
            let offerValue =  Math.round(parseFloat(req.body.offerValue) * 100);
            let counterOffer = await pool.query("INSERT into offers (listingid, amount, senderid, receiverid, status) VALUES ($1, $2, $3, $4, $5)", [declineOffer.rows[0].listingid, offerValue, res.locals.userId, declineOffer.rows[0].senderid, 0]);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/deleteListing", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (req.body.listingId) {
        try {
            let sql = await pool.query("UPDATE listings SET deleted=true WHERE id=$1 AND sellerid=$2", [req.body.listingId, res.locals.userId]);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    }
});

app.post("/postReview", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.listingId == "undefined" || typeof req.body.rating == "undefined" || typeof req.body.comment == "undefined") {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
    try {
        let revieweeId = 0;
        let validateListing = await pool.query("SELECT buyerid, sellerid FROM transactions WHERE listingid=$1", [req.body.listingId]);
        if (validateListing.rows.length > 0) {
            if (validateListing.rows[0].buyerid == res.locals.userId) {
                //reviewer is buyer
                revieweeId = validateListing.rows[0].sellerid;
                await Promise.all([pool.query("UPDATE transactions SET issellerreviewed=true WHERE listingid=$1 AND (buyerid=$2 OR sellerid=$2)", [req.body.listingId, res.locals.userId]), pool.query("INSERT INTO reviews (reviewerid, revieweeid, rating, comment, listingid) VALUES ($1, $2, $3, $4, $5)", [res.locals.userId, revieweeId, req.body.rating, req.body.comment, req.body.listingId])]);
            } else {
                //reviewer is seller
                revieweeId = validateListing.rows[0].buyererid;
                await Promise.all([pool.query("UPDATE transactions SET isbuyerreviewed=true WHERE listingid=$1 AND (buyerid=$2 OR sellerid=$2)", [req.body.listingId, res.locals.userId]), pool.query("INSERT INTO reviews (reviewerid, revieweeid, rating, comment, listingid) VALUES ($1, $2, $3, $4, $5)", [res.locals.userId, revieweeId, req.body.rating, req.body.comment, req.body.listingId])]);
            }
            res.sendStatus(200);
        } else {
            return res.status(404).send({ message: "Couldn't find listing." });
        }
    } catch (err) {
        slackUtil.sendErrorLog(err)
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


app.post("/postListing", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    let price = Math.round(parseFloat(req.body.price) * 100);
    let description = req.body.description;
    let condition = req.body.condition;
    let pictures = req.body.pictures;
    let predefType = req.body.predefType;
    let predefTypeName = req.body.predefTypeName;
    let category = req.body.category;

    console.log(req.body);
    let nowDate = new Date();
    let nowMillis = nowDate.getTime().toString();
    let verificationTimestamp = nowMillis.substring(nowMillis.length - 7);

    if(typeof predefType != "undefined" && predefTypeName && predefType >= 0 && predefTypeName.length > 0) {
        if (price.toString().length > 0 && price.toString().length < 255) {
            if (typeof description != "undefined" && description.length < 255) {
                if (pictures.length > 0) {
                    if (pictures.length < 6) {
                        try {
                            let sql1 = "INSERT INTO listings (title, description, sellerid, condition, price, status, pictures, verificationTimestamp, predefType, categoryId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
                            let insertQuery = await pool.query(sql1, [predefTypeName, description, res.locals.userId, condition, price, 0, pictures, verificationTimestamp, predefType, category]);
                            return res.send({listingId: insertQuery.rows[0].id});
                        } catch (err) {
                            slackUtil.sendErrorLog(err);
                            res.status(500).send({message: "There has been a server error, please try again."});
                        }
                    } else {
                        res.status(400).send({message: "You have exceeded the 5 authorized listing pictures."});
                    }
                } else {
                    res.status(400).send({message: "Please upload at least 1 picture."})
                }
            } else {
                res.status(400).send({message: "Your listing description should be between 1 and 255 characters."})
            }
        } else {
            res.status(400).send({message: "Your listing price should be greater than 0."})
        }
    }else{
        res.status(400).send({message: "Your item is still not supported by our platform."})
    }
});




app.post("/editListing", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {

    let price = parseFloat(req.body.price) * 100;
    let description = req.body.description;
    let condition = req.body.condition;
    let pictures = req.body.pictures;

    if (!req.body.listingId) {
        return res.status(400).send({ message: "Looks like're missing the listing id." });
    }
        if (price.toString().length > 0 && price.toString().length < 255) {
            if (typeof description != "undefined" && description.length < 255) {
                if (pictures.length > 0) {
                    if (pictures.length < 6) {
                        try {
                            let sql1 = "UPDATE listings SET description=$1, sellerid=$2, condition=$3, price=$4, status=0, pictures=$5 WHERE id=$6";
                            let insertQuery = pool.query(sql1, [description, res.locals.userId, condition, price, pictures, req.body.listingId]);
                            let listingId = req.body.listingId;
                            res.sendStatus(200);
                        } catch (err) {
                            slackUtil.sendErrorLog(err)
                            res.status(500).send({ message: "There has been a server error, please try again." });
                        }
                    } else {
                        res.status(400).send({ message: "You have exceeded the 5 authorized listing pictures." });
                    }
                } else {
                    res.status(400).send({ message: "Please upload at least 1 picture." })
                }
            } else {
                res.status(400).send({ message: "Your listing description should be between 1 and 255 characters." })
            }
        } else {
            res.status(400).send({ message: "Your listing price should be greater than 0." })
        }
});



app.post("/accountSetup", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.fname != "undefined" && typeof req.body.lname != "undefined" && typeof req.body.countryCode != "undefined" && typeof req.body.followedCategories != "undefined" && req.body.followedCategories instanceof Array) {
        let sql1 = "UPDATE users SET isaccountsetup = true, firstName=$1, lastName=$2, shippingCountry=$3 WHERE id = $4";
        let sql2Values = [res.locals.userId];
        let sql2 = "INSERT INTO followCategories (followerId, categoryId) VALUES ";
        for (let i = 0, index = 2; i < req.body.followedCategories.length; i++, index++) {
            sql2 += "($1, $" + index + "),";
            sql2Values.push(req.body.followedCategories[i].id);
        }
        sql2 = sql2.substring(0, sql2.length - 1);
        try {
            await Promise.all([pool.query(sql1, [req.body.fname, req.body.lname, req.body.countryCode, res.locals.userId]), pool.query(sql2, sql2Values)]);
            console.log("All good");
            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            slackUtil.sendErrorLog(err)
            res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        console.log("400");
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});


app.post("/addTrackingNumber", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.trackingNumber != "undefined" && typeof req.body.carrierName != "undefined" && typeof req.body.listingId != "undefined") {
        let sqlQuery = await pool.query("UPDATE transactions SET trackingNumber=$1, carrierName=$2 WHERE listingId=$3", [req.body.trackingNumber, req.body.carrierName, req.body.listingId]);
        res.sendStatus(200);
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});


app.post("/submitListingVerification", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.picture != "undefined" && typeof req.body.listingId != "undefined") {
        try {
            let sql = await pool.query("UPDATE listings SET verificationPicture=$1, verificationStatus=1 WHERE id=$2 AND sellerid=$3", [req.body.picture, req.body.listingId, res.locals.userId]);
            return res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/categorySearchClick", async (req, res) => {
    if (typeof req.body.catId == "undefined") {
        return res.sendStatus(200);
    } else {
        pool.query("INSERT INTO categoryTrends (catId) VALUES ($1)", [req.body.catId]);
    }
});


app.post('/notifSubscribe', sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    const subscription = req.body.subscription;
    await pool.query("INSERT INTO notificationKeys (endpoint, privatekey, authkey, userid) VALUES ($1, $2, $3, $4)", [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, res.locals.userId]);
    res.status(200).json({ 'success': true })
});

app.post('/notifUnsubscribe', (req, res) => {
    const subscription = req.body.subscription;

    jwt.verify(req.body.userToken, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
        if (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "These has been a server error, please try again." });
        } else {
            await pool.query("UPDATE notificationKeys SET isValid = false WHERE endpoint = $1 AND privatekey = $2 AND authkey = $3 AND userid = $4", [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, decryptedToken.id]);
            res.status(200).json({ 'success': true });
        }
    });


});


app.post("/addPredefItemRecommendation", (req, res)=>{
    if(typeof req.body.item != "undefined"){
        slackUtil.newProductsRecommendation(req.body.item);
        res.sendStatus(200);
    }
});


module.exports = app;
