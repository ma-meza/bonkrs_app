const app = require("express").Router();
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const slackUtil = require("../utils/slackUtils");


app.get("/searchSuggest", function (req, res) {
    let searchQuery = req.query.search;
    if (searchQuery) {



        // let sqlString = "SELECT listing.id, listing.title, listing.price, listing.pictures FROM listings listing, filtermap fm, filtervalues fv WHERE listing.status = 0 AND fm.filterId = fv.id AND (fv.value IN (";

        // let queryVars = [];
        // keys.forEach((key, index) => {
        //     sqlString += "$" + index + ", ";
        //     queryVars.push(searchQuery[key]);
        // });

        // const findListings = await pool.query("fv.value IN ($1)) AND listing.categoryId = fm.categoryId", [0]);




        let results = [];
        let qtityResults = 0;
        for (let i = 0; i < deviceOptions.length; i++) {
            if (qtityResults < 5) {
                if (deviceOptions[i].name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery.toLowerCase().includes(deviceOptions[i].name.toLowerCase())) {
                    results.push(deviceOptions[i]);
                    qtityResults++;
                }
            } else {
                break;
            }
        }
        return res.status(200).send(results);
    }
});

app.get("/getAllFiltersFromCategoryId", async function (req, res) {
    if (typeof req.query.id != "undefined") {
        console.log(req.query.id);
        try {
            let sql1 = "SELECT fv.filtertypeid, fv.id, fv.value, fv.textvalue FROM filtervalues AS fv WHERE fv.value != -1 AND fv.filtertypeid IN (SELECT DISTINCT filtertypeid FROM filterpercategories WHERE categoryid=$1 OR categoryid IN (SELECT parentid FROM categories WHERE id=$1))";
            let sql2 = "SELECT id, name, type FROM filtertypes WHERE id IN (SELECT DISTINCT filtertypeid FROM filterpercategories WHERE categoryid=$1 OR categoryid IN (SELECT parentid FROM categories WHERE id=$1))";
            let [filterValues, filterTypes] = await Promise.all([pool.query(sql1, [req.query.id]), pool.query(sql2, [req.query.id])]);
            res.status(200).send({ filterValues: filterValues.rows, filterTypes: filterTypes.rows });
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing category field." });
    }
});


app.post("/searchResults", async function (req, res) {
    let parameters = req.body;
    console.log(parameters);
    if (parameters) {
        //all parameters -> {cat, cond, price, pricege, pricele, predefType}

        if(typeof parameters.predefType != "undefined" && !(parameters.predefType instanceof Array)){
            try{
                let sql1 = "SELECT id, title, isActualItem FROM predefitem WHERE id = $1 LIMIT 1";
                let sql2 = "SELECT listings.title, listings.id, listings.sellerid, users.id AS sellerid, users.name AS sellername, users.avgrating, users.profilepicture AS sellerprofilepicture, listings.price, listings.condition, listings.pictures FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE predefType = $1 AND listings.deleted = false AND listings.status = 0";

                let [predefType, listings] = await Promise.all([pool.query(sql1, [parameters.predefType]), pool.query(sql2, [parameters.predefType])]);

                if(predefType.rows.length > 0){
                   if(predefType.rows[0].isactualitem == false){
                        let listingsNewSql = await pool.query("SELECT listings.title, listings.id, listings.sellerid, users.id AS sellerid, users.name AS sellername, users.avgrating, users.profilepicture AS sellerprofilepicture, listings.price, listings.condition, listings.pictures FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE predefType IN (SELECT id FROM predefitem WHERE title LIKE '%' || $1 || '%') AND listings.deleted = false AND listings.status = 0", [predefType.rows[0].title]);
                            console.log(listingsNewSql.rows);
                        return res.send(listingsNewSql.rows);
                   }else{
                       return res.send(listings.rows);
                   }
                }else{
                    return res.send(listings.rows);
                }



            }catch(err){
                slackUtil.sendErrorLog(err);
                return res.status(500).send({ message: "There has been a server error, please try again." });
            }

        }else if (typeof parameters.cat != "undefined" && !(parameters.cat instanceof Array)) {
            let categoryId = parameters.cat;

            // sample search query: [...] ? cat = 0 & 2=2 & 27=12 & 33=12 & 3=iphone
            const allKeys = Object.keys(parameters);
            try {
                let varCounter = 2;
                let nbRelevantFilters = 0;
                // let relevantFiltersSql = await pool.query("SELECT ARRAY(SELECT filtertypeid from filterpercategories WHERE categoryid = $1 OR categoryid IN (SELECT id FROM categories WHERE parentid = $1)) AS filter_id", [categoryId]);
                // let relevantFiltersId = relevantFiltersSql.rows[0].filter_id;
                // let sqlString = "SELECT id FROM filtervalues where";

                // let sqlQueryVars = [categoryId];
                // if (relevantFiltersId.length > 0) {
                //     allKeys.forEach((key) => {
                //         if (relevantFiltersId.indexOf(parseFloat(key)) != -1) {
                //             console.log(parameters[key]);
                //             if (!(parameters[key] instanceof Array)) {
                //                 nbRelevantFilters++;
                //                 sqlString += " (filtertypeid = $" + varCounter + " AND value = $" + (varCounter + 1) + ") OR ";
                //                 varCounter += 2;
                //                 sqlQueryVars.push(key);
                //                 sqlQueryVars.push(parameters[key]);
                //             } else {
                //                 nbRelevantFilters++;
                //                 sqlQueryVars.push(key);
                //                 let keyIndex = varCounter;
                //                 varCounter++;
                //                 for (let k = 0; k < parameters[key].length; k++) {
                //                     sqlString += " (filtertypeid = $" + keyIndex + " AND value = $" + (varCounter) + ") OR ";
                //                     varCounter++;
                //                     sqlQueryVars.push(parameters[key][k]);
                //                 }
                //             }
                //         }
                //     });
                // }
                let sqlCompleteQuery;
                if (varCounter == 2 || nbRelevantFilters == 0) {
                    //no params
                    // sqlString = sqlString.substring(0, sqlString.length - 6);
                    sqlCompleteQuery = "SELECT DISTINCT listingid FROM filtermap WHERE (categoryId = $1 OR categoryId IN (SELECT id FROM categories WHERE parentid = $1))";
                } else {
                    sqlString = sqlString.substring(0, sqlString.length - 4);
                    sqlCompleteQuery = "SELECT listingid FROM filtermap WHERE (categoryId = $1 OR categoryId IN (SELECT id FROM categories WHERE parentid = $1)) AND filterid IN (" + sqlString + ") GROUP By listingid HAVING COUNT(*) = " + nbRelevantFilters;
                }
                // let searchResults = await pool.query("SELECT listings.title, listings.id, listings.sellerid, users.id AS sellerid, users.name AS sellername, users.avgrating, users.profilepicture AS sellerprofilepicture, listings.price, listings.condition, listings.pictures FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE (listings.categoryid = $1 OR listings.categoryid IN (SELECT id FROM categories WHERE parentid = $1)) AND listings.deleted = false AND listings.status = 0", sqlQueryVars);
                let searchResults = await pool.query("SELECT listings.title, listings.id, listings.sellerid, users.id AS sellerid, users.name AS sellername, users.avgrating, users.profilepicture AS sellerprofilepicture, listings.price, listings.condition, listings.pictures FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE (listings.categoryid = $1 OR listings.categoryid IN (SELECT id FROM categories WHERE parentid = $1)) AND listings.deleted = false", [categoryId]);
                res.status(200).send(searchResults.rows);

            } catch (err) {
                slackUtil.sendErrorLog(err);
                return res.status(500).send({ message: "There has been a server error, please try again." });
            }
        } else {
            return res.status(400).send({ message: "Missing category field." });
        }
    } else {
        return res.status(400).send({ message: "Missing filter fields." });
    }
});

app.get("/reservationDetails", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.query.id != "undefined") {
        try {
            let details = await pool.query("SELECT res.offerId, res.timestamp, offers.amount, res.listingid FROM reservations AS res LEFT JOIN offers ON offers.id = res.offerId WHERE res.id=$1 AND res.buyerid=$2", [req.query.id, res.locals.userId]);
            if (details.rows.length > 0) {
                let otherOptionsSqlArray = [];
                if (details.rows[0].amount == null) {
                    otherOptionsSqlArray.push(pool.query("SELECT price FROM listings WHERE id=$1", [details.rows[0].listingid]));
                }
                otherOptionsSqlArray.push(pool.query("SELECT users.email AS sellerEmail FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE listings.id = $1 LIMIT 1", [details.rows[0].listingid]));
                let otherOptions = await Promise.all(otherOptionsSqlArray);

                return res.send({ details: details.rows[0], otherDetails: otherOptions });
            } else {
                return res.sendStatus(400);
            }
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.sendStatus(500);
        }
    } else {
        return res.sendStatus(400);
    }
});


app.get("/getCategoryName", async function (req, res) {
    if (typeof req.query.id != "undefined") {
        try {
            let sql = await pool.query("SELECT name FROM categories WHERE id=$1 LIMIT 1", [req.query.id]);
            res.send(sql.rows[0]);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing category id." });
    }
});

app.get("/getPredefTypeName", async function (req, res) {
    if (typeof req.query.id != "undefined") {
        try {
            let sql = await pool.query("SELECT title FROM predefItem WHERE id=$1 LIMIT 1", [req.query.id]);
            console.log(sql.rows[0]);
            res.send(sql.rows[0]);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing category id." });
    }
});



app.get("/allCategories", async function (req, res) {
    try {
        let sql = "SELECT DISTINCT cat.*, COUNT(trend.id) AS trend_count FROM categories AS cat LEFT JOIN categoryTrends AS trend ON cat.id = trend.catid WHERE cat.isActive = true GROUP BY cat.id ORDER BY trend_count DESC";

        let cats = await pool.query(sql);
        return res.status(200).send(cats.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/allLeafCategories", async function (req, res) {
    let sql = "SELECT DISTINCT id, name, parentid FROM categories WHERE parentid IS NOT NULL OR id NOT IN (SELECT DISTINCT parentid FROM categories WHERE parentid IS NOT NULL) ORDER BY name";

    try {
        let cats = await pool.query(sql);
        return res.status(200).send(cats.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/allParentCategories", async function (req, res) {
    let sql = "SELECT DISTINCT id, name, parentid FROM categories WHERE parentid IS NULL ORDER BY parentid";
    try {
        let cats = await pool.query(sql);
        return res.status(200).send(cats.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


//all filters for specific categories
app.get("/categoriesSpecificFilters", async function (req, res) {
    if (typeof req.query.categoryId !== 'undefined') {
        try {
            let categoryId = req.query.categoryId;
            let getParentCatSql = await pool.query("SELECT ARRAY(SELECT parentid FROM categories WHERE id = $1) AS cat_parent", [categoryId]);
            let catParent = getParentCatSql.rows[0].cat_parent[0] == null ? -1 : getParentCatSql.rows[0].cat_parent[0];

            let filtersValuesSql = "SELECT * FROM filtervalues WHERE filtertypeid IN (SELECT filtertypeid FROM filterpercategories WHERE categoryid=$1 OR categoryid=$2) AND value != -1";
            let filtersNamesSql = "SELECT filterTypes.name, filterTypes.id, filtertypes.type FROM filterTypes WHERE filterTypes.id IN (SELECT filterTypeId FROM filterPerCategories WHERE filterPerCategories.categoryid = $1 OR filterPerCategories.categoryid = $2)";
            let [filtersValues, filtersNames] = await Promise.all([pool.query(filtersValuesSql, [req.query.categoryId, catParent]), pool.query(filtersNamesSql, [req.query.categoryId, catParent])]);
            res.status(200).send({ filterValues: filtersValues.rows, filterNames: filtersNames.rows });
        } catch (error) {
            slackUtil.sendErrorLog(error);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing listing id." });
    }
});

app.get('/listingDetails', async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        let listingId = req.query.id;
        try {
            let query1 = "SELECT listing.title, listing.isguestlisting ,listing.description, listing.predefType, listing.sellerId, listing.condition, listing.price, listing.status, listing.categoryId, listing.pictures, users.name, users.avgRating, users.profilePicture FROM listings AS listing INNER JOIN users ON users.id = sellerId WHERE listing.id = $1";
            let query2 = "SELECT fv.*, filtertypes.name FROM filtermap AS fm INNER JOIN filtervalues AS fv on fv.id = fm.filterid INNER JOIN filtertypes on filtertypes.id = fv.filtertypeid WHERE fm.listingid = $1";
            let [listingdetails, filters, filterNames] = await Promise.all([pool.query(query1, [listingId]), pool.query(query2, [listingId])]);
            res.status(200).send({ listingDetails: listingdetails.rows[0], filters: filters.rows });
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing listing id." });
    }
});


app.get("/savedListings", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    //TODO: CHECK FOR DELETED LISTINGS
    if (typeof res.locals.userId !== 'undefined') {
        try {
            let savedListings = await pool.query("SELECT listings.title, listings.id, listings.description, listings.sellerId, listings.condition, listings.price, listings.status, listings.categoryId, listings.pictures, users.name, users.avgRating FROM ((saved INNER JOIN listings ON listings.id = saved.listingId) INNER JOIN users ON users.id = listings.sellerId) WHERE saved.userid = $1", [res.locals.userId]);
            res.status(200).send(savedListings.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(403).send({ message: "Not authorized." });
    }
});

app.get("/purchaseHistory", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof res.locals.userId !== 'undefined') {
        try {
            //IMPORTANT don't forget to search for transaction.amount
            let purchaseHistory = await pool.query("SELECT offers.amount AS offeramount, listings.title, listings.id, listings.description, listings.sellerId, listings.condition, listings.price AS buynowprice, listings.status, listings.categoryId, listings.pictures, users.name, users.avgRating, users.profilepicture, transactions.issellerreviewed, transactions.ordernb, transactions.status, transactions.receiptlink, transactions.timestamp FROM transactions INNER JOIN listings ON listings.id = transactions.listingId INNER JOIN users ON users.id = listings.sellerId LEFT JOIN offers ON offers.id = transactions.offerId WHERE transactions.buyerid = $1 AND listings.status = 1", [res.locals.userId]);
            res.status(200).send(purchaseHistory.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(403).send({ message: "Not authorized." });
    }
});

app.get("/sellingHistory", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    try {
        //IMPORTANT don't forget to search for transaction.amount
        let sellingHistory = await pool.query("SELECT listings.title, listings.id, listings.description, listings.sellerId, listings.condition, listings.price, transactions.trackingnumber, listings.categoryId, listings.pictures, users.name AS buyername, users.avgRating AS buyeravgrating, transactions.timestamp, transactions.ordernb, transactions.status, transactions.sellerreceiptlink, transactions.buyerId, transactions.isbuyerreviewed FROM transactions INNER JOIN listings ON listings.id = transactions.listingId INNER JOIN users ON users.id = transactions.buyerid WHERE listings.sellerid = $1", [res.locals.userId]);
        console.log(sellingHistory);
        res.status(200).send(sellingHistory.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


app.get("/userActiveListings", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof res.locals.userId !== 'undefined') {
        try {
            let sellingHistory = await pool.query("SELECT listings.title, listings.verificationstatus, listings.id, listings.description, listings.sellerId, listings.condition, listings.price, listings.categoryId, listings.pictures, listings.timestamp FROM listings WHERE listings.sellerId = $1 AND listings.status = 0 AND listings.deleted = false", [res.locals.userId]);
            res.status(200).send(sellingHistory.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(403).send({ message: "Not authorized." });
    }
});

app.get("/userFromIdActiveListings", async (req, res) => {
    if (req.query.userId !== 'undefined') {
        try {
            let sellingHistory = await pool.query("SELECT listings.title, listings.id, listings.description, listings.sellerId, listings.condition, listings.price, listings.categoryId, listings.pictures, listings.timestamp, users.name AS sellername, users.avgrating, users.profilepicture AS sellerprofilepicture FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE listings.sellerId = $1 AND listings.status = 0 AND listings.deleted = false", [req.query.userId]);
            res.status(200).send(sellingHistory.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});

app.get("/userFromIdPurchaseHistory", async (req, res) => {
    if (typeof req.query.userId !== 'undefined') {
        try {
            //IMPORTANT don't forget to search for transaction.amount
            let purchaseHistory = await pool.query("SELECT listings.title, listings.id, listings.description, listings.sellerId, listings.condition, listings.price, listings.status, listings.categoryId, listings.pictures, users.name, users.avgRating, transactions.issellerreviewed, transactions.timestamp FROM ((transactions INNER JOIN listings ON listings.id = transactions.listingId) INNER JOIN users ON users.id = listings.sellerId) WHERE transactions.buyerid = $1 AND transactions.status = 1", [req.query.userId]);
            res.status(200).send(purchaseHistory.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});

app.get("/loggedInUserReviewsReceived", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof res.locals.userId !== 'undefined') {
        try {
            let reviews = await pool.query("SELECT reviews.reviewerid, reviews.listingId, reviews.rating, reviews.comment, users.name FROM reviews INNER JOIN users ON users.id = reviews.reviewerid WHERE reviews.revieweeid = $1", [res.locals.userId]);
            res.status(200).send(reviews.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(403).send({ message: "Not authorized." });
    }
});

app.get("/loggedInUserReviewsGiven", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof res.locals.userId !== 'undefined') {
        try {
            let reviews = await pool.query("SELECT reviews.revieweeid, reviews.listingId, reviews.rating, reviews.comment, users.name FROM reviews INNER JOIN users ON users.id = reviews.revieweeid WHERE reviews.reviewerid = $1", [res.locals.userId]);
            res.status(200).send(reviews.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(403).send({ message: "Not authorized." });
    }
});

app.get("/userReviewsReceived", async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        try {
            let reviews = await pool.query("SELECT reviews.reviewerid, reviews.listingId, reviews.rating, reviews.comment, users.profilePicture, users.name FROM reviews INNER JOIN users ON users.id = reviews.reviewerid WHERE reviews.revieweeid = $1", [req.query.id]);
            console.log(reviews);
            res.status(200).send(reviews.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});

app.get("/userReviewsGiven", async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        try {
            let reviews = await pool.query("SELECT reviews.revieweeid, reviews.listingId, reviews.rating, reviews.comment, users.name FROM reviews INNER JOIN users ON users.id = reviews.revieweeid WHERE reviews.reviewerid = $1", [req.query.id]);
            res.status(200).send(reviews.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});


app.get("/offers", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    //listing id or not
    if (typeof res.locals.userId !== 'undefined') {
        let getOffers;
        try {
            if (typeof req.query.listingId !== 'undefined') {
                getOffers = await pool.query("SELECT offers.id, offers.amount, offers.listingId, offers.senderId, offers.receiverId, offers.status, offers.timestamp, users.name AS sendername, users.profilepicture, listings.title FROM offers INNER JOIN users ON users.id = offers.senderid INNER JOIN listings on listings.id = offers.listingid WHERE offers.status = 0 AND offers.listingid = $1 AND offers.receiverid = $2 AND offers.listingid NOT IN (SELECT id FROM listings WHERE sellerid=$2)", [req.query.listingId, res.locals.userId]);
            } else {
                getOffers = await pool.query("SELECT DISTINCT offers.id, offers.amount, offers.listingId, offers.senderId, offers.status, offers.timestamp, users.name AS sendername, users.profilepicture, listings.title, listings.pictures FROM offers INNER JOIN users ON users.id = offers.senderid INNER JOIN listings on listings.id = offers.listingid WHERE offers.status = 0 AND offers.receiverid = $1 AND offers.listingid NOT IN (SELECT id FROM listings WHERE sellerid=$1 OR deleted=true)", [res.locals.userId]);
            }
            res.status(200).send(getOffers.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});

app.get("/listingsAwaitingYourPayment", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    //listing id or not
    if (typeof res.locals.userId !== 'undefined') {
        let getListings;
        try {
            getListings = await pool.query("SELECT offers.amount, offers.id AS offerId, offers.listingId, offers.timestamp, listings.title, listings.id, listings.sellerid, listings.pictures FROM offers INNER JOIN listings on listings.id = offers.listingid WHERE offers.status = 1 AND (offers.senderId = $1 OR offers.receiverId = $1) AND offers.listingid NOT IN (SELECT id FROM listings WHERE sellerid=$1 OR deleted=true OR status = 1 OR status=2)", [res.locals.userId]);
            res.status(200).send(getListings.rows);
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        res.status(400).send({ message: "Missing user id field." });
    }
});

app.get("/activeListingsOffers", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    try {
        let activeListings = "SELECT listings.id FROM listings WHERE listings.sellerId = $1 AND listings.status = 0 AND deleted=false";
        let offers = await pool.query("SELECT offers.id, offers.amount, offers.listingId, offers.senderId, offers.receiverId, offers.status, users.profilepicture, offers.timestamp, users.name AS sendername FROM offers INNER JOIN users ON users.id = offers.senderid WHERE offers.status = 0 AND offers.listingid IN (" + activeListings + ") AND offers.receiverid = $1", [res.locals.userId]);
        res.status(200).send(offers.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
})

app.get("/getListingAllReservations", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof req.query.listingId != "undefined") {
        let sql1 = "SELECT res.id AS reservationid, res.offerId, res.timestamp, offers.amount AS offeramount, res.listingid, users.name AS buyername, users.id AS buyerid FROM reservations AS res LEFT JOIN offers ON offers.id = res.offerId INNER JOIN users ON users.id = res.buyerid WHERE res.listingid=$1 AND res.isexpired = false ORDER BY res.timestamp DESC";
        let findRes = await pool.query(sql1, [req.query.listingId]);
        if (findRes.rows.length > 0) {
            console.log(findRes.rows);
            return res.send(findRes.rows);
        } else {
            return res.status(400).send({ message: "No buyers found to mark the listing as sold." });
        }
    } else {
        return res.status(400).send({ message: "Missing listing id field." });
    }
});

app.get("/listingVerifCode", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof req.query.id != "undefined") {
        try {
            let sql = await pool.query("SELECT listings.verificationTimestamp, users.name FROM listings INNER JOIN users ON users.id=listings.sellerid WHERE listings.id=$1 AND sellerId=$2", [req.query.id, res.locals.userId]);
            res.send({ verificationTimestamp: sql.rows[0].verificationtimestamp, username: sql.rows[0].name });
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing listing id field." });
    }
});

app.get("/offerDetails", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (typeof req.query.offerId == "undefined") {
        return res.status(400).send({ message: "Missing offer id field." });
    }
    try {
        let offerDetails = await pool.query("SELECT * FROM offers WHERE id=$1 LIMIT 1", [req.query.offerId]);
        if (offerDetails.rows.length == 0) {
            return res.status(400).send({ message: "Invalid offer id." });
        }
        return res.send({ offerDetails: offerDetails.rows[0] });
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/listingPrice", async function (req, res) {
    if (typeof req.query.listingId == "undefined") {
        return res.status(400).send({ message: "Missing listing id field." });
    }
    try {
        console.log(req.query.listingId);
        let listingDetails = await pool.query("SELECT price FROM listings WHERE id=$1 LIMIT 1", [req.query.listingId]);
        console.log(listingDetails.rows);
        if (listingDetails.rows.length == 0) {
            return res.status(400).send({ message: "Invalid listing id." });
        }
        return res.send({ listingPrice: listingDetails.rows[0].price });
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/allBlogPosts", async (req, res) => {
    try {
        let posts = await pool.query("SELECT * FROM blogpost LIMIT 30");
        res.send(posts.rows);
    } catch (err) {
        res.send([]);
    }
});

app.get("/blogPost", async (req, res) => {
    if (typeof req.query.id == "undefined") {
        return res.status(400).send({ message: "Missing post id field." });
    }
    try {
        let post = await pool.query("SELECT * FROM blogpost WHERE id=$1", [req.query.id]);
        res.send(post.rows[0]);
    } catch (err) {
        res.send({});
    }
});


app.get("/predefProductsList", async (req, res)=>{
    let sql1 = await pool.query("SELECT DISTINCT predefitem.* FROM predefitem INNER JOIN predefitemfiltermap ON predefitemfiltermap.itemid = predefitem.id ORDER BY predefitem.title");
    let sql2 = await pool.query("SELECT filtervalues.textvalue, filtervalues.filtertypeid, predefitemfiltermap.itemid FROM filtervalues INNER JOIN predefitemfiltermap ON predefitemfiltermap.filterid = filtervalues.id ORDER BY predefitemfiltermap.itemid");
    let sql3 = await pool.query("SELECT id, name FROM filtertypes");
    res.send({items:sql1.rows, filters:sql2.rows, types:sql3.rows});
});

app.get("/searchPredefItemsByName", async (req, res)=>{
    if(typeof req.query.search == "undefined" && req.query.search.length>0){
        return res.status(200).send([]);
    }

    try{
        let sql = await pool.query("SELECT title, id, categoryId FROM predefitem WHERE LOWER(title) LIKE $1 AND isactualitem = true LIMIT 5", ["%"+req.query.search.toLowerCase()+"%"]);
        console.log("%"+req.query.search+"%");
        console.log(sql.rows);
        return res.send(sql.rows);
    }catch(err){
        res.send([]);
    }
});


app.get("/searchQuerySuggest", async (req, res)=>{
    if(typeof req.query.q == "undefined"){
        return res.send({categories:[], predefItems:[]});
    }
    try{
        let categoriesSearchTerm = "%"+req.query.q.toLowerCase()+"%";

        let sql1 = "SELECT title, id FROM predefitem WHERE ";
        let sql2 = "SELECT name, id FROM categories WHERE LOWER(name) LIKE $1 LIMIT 3";

        let splittedQuery = req.query.q.toLowerCase().split(" ");
        let finalPredefQueryValues = splittedQuery.map(value=>{
            return "%"+value+"%";
        });

        for(let i=0;i<finalPredefQueryValues.length;i++){
            sql1+="LOWER(title) LIKE $"+(i+1)+" AND ";
        }
        sql1 = sql1.substring(0, sql1.length - 5);

        sql1+=" ORDER BY length(title) LIMIT 6";

        let [predefItems, categories] = await Promise.all([pool.query(sql1, finalPredefQueryValues), pool.query(sql2, [categoriesSearchTerm])]);

        return res.send({categories:categories.rows, predefItems:predefItems.rows});
    }catch(err){
        slackUtil.sendErrorLog(err);
        return res.send({categories:[], predefItems:[]});
    }
});
module.exports = app;
