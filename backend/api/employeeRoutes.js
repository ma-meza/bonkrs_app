const app = require("express").Router();
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const pool = require("../db.js");
const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const { google } = require("googleapis");

app.post('/signupEmployee', async function (req, res) {
    req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : "";
    req.body.name = !isEmpty(req.body.name) ? req.body.name : "";
    console.log(req.body);
    if (!Validator.isEmpty(req.body.email) && !Validator.isEmpty(req.body.password) && !Validator.isEmpty(req.body.name)) {
        let saltRoundsBcrypt = 10;
        let email = req.body.email;
        try {
            const findUsersSameEmail = await pool.query("SELECT email FROM employeeCredentials WHERE email = $1 LIMIT 1", [email]);
            if (findUsersSameEmail.rows.length > 0) {
                //email already used
                return res.status(400).send({ message: "This email already exists." });
            } else {
                console.log(req.body.password);
                bcrypt.hash(req.body.password, saltRoundsBcrypt, async function (err, hash) {
                    if (err) {
                        return res.status(500).send({ message: "There has been a server error, please try again." });
                    } else {
                        const newUser = await pool.query("INSERT INTO employeeCredentials (email, password, name) VALUES($1, $2, $3) RETURNING id", [email, hash, req.body.name]);
                        return res.sendStatus(200);
                    }
                });
            }
        } catch (err) {
            return res.status(500).send({ message: "There has been a server error, please try again." });

        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});



app.post('/loginEmployee', async function (req, res) {
    req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : "";
    if (!Validator.isEmpty(req.body.email) && !Validator.isEmpty(req.body.password)) {
        let email = req.body.email;
        try {
            const findUsersSameEmail = await pool.query("SELECT password, id, name FROM employeeCredentials WHERE email = $1 LIMIT 1", [email]);
            if (findUsersSameEmail.rows.length > 0) {
                //email exists
                let userPass = findUsersSameEmail.rows[0].password;
                let userId = findUsersSameEmail.rows[0].id;
                let name = findUsersSameEmail.rows[0].name;
                bcrypt.compare(req.body.password, userPass, function (err, resBcrypt) {
                    // res == true
                    if (err) {
                        return res.status(500).send({ message: "There has been a server error, please try again." });
                    } else {
                        //pass match
                        console.log(resBcrypt);
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
                                        name: name
                                    });
                                }
                            );
                        } else {
                            return res.status(400).send({ message: "This password is incorrect." });
                        }
                    }
                });
            } else {
                console.log("EMAIL DOESNT EXIST");
                return res.status(400).send({ message: "This email is not registered." });
            }
        } catch (err) {
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/updateBlogPost", (req, res) => {
    try {
        console.log(req.body);
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                let post = req.body.post;
                if (typeof post.title == "undefined" || typeof post.body == "undefined" || typeof post.summary == "undefined" || typeof post.postId == "undefined") {
                    return res.status(400).send({ message: "Missing fields." });
                }
                let updatePost = await pool.query("UPDATE blogpost SET body=$1, summary = $2, title = $3 WHERE id = $4", [post.body, post.summary, post.title, post.postId]);
                res.sendStatus(200);
            }
        });

    } catch (err) {
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.post("/deleteBlogPost", (req, res) => {
    try {
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                let postId = req.body.postId;
                if (typeof postId == "undefined") {
                    return res.status(400).send({ message: "Missing post id field." });
                }
                let deletePost = await pool.query("DELETE FROM blogpost WHERE id = $1", [postId]);
                res.sendStatus(200);
            }
        });

    } catch (err) {
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.post("/createBlogPost", (req, res) => {
    try {
        console.log(req.body);
        console.log(req.headers);
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                console.log("YO");
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                console.log("SUCCESS");
                let post = req.body.post;
                if (typeof post.title == "undefined" || typeof post.body == "undefined" || typeof post.summary == "undefined") {
                    return res.status(400).send({ message: "Missing fields." });
                }
                let updatePost = await pool.query("INSERT INTO blogpost (body, summary, title) VALUES ($1, $2, $3)", [post.body, post.summary, post.title]);
                res.sendStatus(200);
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/allListingsToVerify", async (req, res) => {
    try {
        let listings = await pool.query("SELECT listings.id, listings.title, listings.verificationtimestamp, listings.verificationpicture, users.name AS sellerusername FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE listings.verificationstatus=1");
        res.send(listings.rows);
    } catch (err) {
        res.send([]);
    }
});

app.post("/postPredefItem", async (req, res) => {

    let filtersType0 = req.body.filtersType0;
    let filtersType1Custom = req.body.filtersType1Custom;
    let filtersType1Predefined = req.body.filtersType1Predefined;
    let filtersType2 = req.body.filtersType2;
    let title = req.body.title;
    let cat = req.body.cat;


    if (title.length > 0 && title.length < 255) {
        try {
            let sql1 = "INSERT INTO predefItem (title, categoryid) VALUES ($1, $2) RETURNING id";
            let insertQuery = await pool.query(sql1, [title, cat]);
            let listingId = insertQuery.rows[0].id;

            //do filters type 0 -> Y/N
            let searchType0Filter = "SELECT id FROM filtervalues WHERE ";
            //filtersType0 = {id:443, value:0}
            let filters0ValuesArray = [];
            for (let j = 0, k = 1; j < filtersType0.length; j++, k += 2) {
                searchType0Filter += "(filtertypeid = $" + k + " AND value = $" + (k + 1) + ")";
                if (j != filtersType0.length - 1) {
                    searchType0Filter += " OR "
                }
                filters0ValuesArray.push(filtersType0[j].id, filtersType0[j].value);
            }
            console.log("P1: " + searchType0Filter);
            let filterType0Id = {};
            if(filters0ValuesArray.length>0) {
                filterType0Id = await pool.query(searchType0Filter, filters0ValuesArray);
            }


            //do filters type 2 -> NUMBERS
            //filtersType2 = {id:43, value:333}
            let filterType2Id;
            if (filtersType2.length > 0) {
                let searchType2Filter = "SELECT id, filtertypeid FROM filtervalues WHERE ";
                let filters2ValuesArray = [];
                for (let j = 0, k = 1; j < filtersType2.length; j++, k += 2) {
                    searchType2Filter += "(filtertypeid = $" + k + " AND value = $" + (k + 1) + ")";
                    if (j != filtersType2.length - 1) {
                        searchType2Filter += " OR "
                    }
                    filters2ValuesArray.push(filtersType2[j].id, filtersType2[j].value);
                }
                console.log("P2: " + searchType2Filter);
                filterType2Id = await pool.query(searchType2Filter, filters2ValuesArray);
            } else {
                filterType2Id = { rows: [] };
            }


            let existingType2 = [];
            for (let j = 0; j < filterType2Id.rows.length; j++) {
                for (let k = 0; k < filtersType2.length; k++) {
                    if (filterType2Id.rows[j].filtertypeid == filtersType2[k].id) {
                        existingType2.push(filterType2Id.rows[j]);
                        filtersType2.splice(k, 1);
                        break;
                    }
                }
            }

            //insert new type 2 values filters
            let insertNewType2Query;
            if (filtersType2.length > 0) {
                let sqlInsertNewType2 = "INSERT INTO filtervalues (filtertypeid, value, textvalue) VALUES ";
                let insertNewType2ValuesArray = [];
                for (let j = 0, k = 1; j < filtersType2.length; j++, k += 3) {
                    insertNewType2ValuesArray.push(filtersType2[j].id, parseFloat(filtersType2[j].value), filtersType2[j].value);
                    sqlInsertNewType2 += "($" + k + ", $" + (k + 1) + ", $" + (k + 2) + "),";
                }
                sqlInsertNewType2 = sqlInsertNewType2.substring(0, sqlInsertNewType2.length - 1);
                sqlInsertNewType2 += " RETURNING id";
                console.log("P3: " + sqlInsertNewType2);
                insertNewType2Query = await pool.query(sqlInsertNewType2, insertNewType2ValuesArray);
            } else {
                insertNewType2Query = { rows: [] }
            }



            //insert custom type 1 filters
            // {id:33, searchValue:"apple"}
            let insertCustomType1Query;
            if (filtersType1Custom.length > 0) {
                let sqlInsertCustomType1 = "INSERT INTO filtervalues (filtertypeid, value, textvalue) VALUES ";
                let insertCustomType1ValuesArray = [];
                for (let j = 0, k = 1; j < filtersType1Custom.length; j++, k += 3) {
                    let stringValue = filtersType1Custom[j].searchValue;
                    insertCustomType1ValuesArray.push(filtersType1Custom[j].id, -2, stringValue);
                    sqlInsertCustomType1 += "($" + k + ", $" + (k + 1) + ", $" + (k + 2) + "),";
                }
                console.log("P4: " + sqlInsertCustomType1);
                sqlInsertCustomType1 = sqlInsertCustomType1.substring(0, sqlInsertCustomType1.length - 1);
                sqlInsertCustomType1 += " RETURNING id";
                console.log(sqlInsertCustomType1);
                insertCustomType1Query = await pool.query(sqlInsertCustomType1, insertCustomType1ValuesArray);
            } else {
                insertCustomType1Query = { rows: [] }
            }


            let valuesArray = [cat, listingId];
            let sql2 = "INSERT into predefItemFiltermap (filterid, categoryid, itemid) VALUES ";

            //insert type 0
            if(filters0ValuesArray.length>0) {
                for (let j = 0, k = 3; j < filterType0Id.rows.length; j++, k++) {
                    sql2 += "($" + k + ", $1, $2), ";
                    valuesArray.push(filterType0Id.rows[j].id);
                }
            }


            // insert type 2 existing
            for (let j = 0, k = valuesArray.length + 1; j < existingType2.length; j++, k++) {
                sql2 += "($" + k + ", $1, $2), ";
                valuesArray.push(existingType2[j].id);
            }

            // insert type 2 new
            for (let j = 0, k = valuesArray.length + 1; j < insertNewType2Query.rows.length; j++, k++) {
                sql2 += "($" + k + ", $1, $2), ";
                valuesArray.push(insertNewType2Query.rows[j].id);
            }

            //insert type 1 predefined
            for (let j = 0, k = valuesArray.length + 1; j < filtersType1Predefined.length; j++, k++) {
                sql2 += "($" + k + ", $1, $2), ";
                valuesArray.push(filtersType1Predefined[j].value);
            }

            // insert type 1 custom
            for (let j = 0, k = valuesArray.length + 1; j < insertCustomType1Query.rows.length; j++, k++) {
                sql2 += "($" + k + ", $1, $2), ";
                valuesArray.push(insertCustomType1Query.rows[j].id);
            }
            sql2 = sql2.substring(0, sql2.length - 2);
            let insertFilterMapQuery = await pool.query(sql2, valuesArray);
            return res.send({ listingId: insertQuery.rows[0].id });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Your listing title should be between 1 and 255 characters." })
    }
});

app.get("/getFiltersFromCategoryIdForPredefinedItem", async function (req, res) {
    if (typeof req.query.id != "undefined") {
        console.log(req.query.id);
        try {
            let sql1 = "SELECT fv.filtertypeid, fv.id, fv.value, fv.textvalue FROM filtervalues AS fv WHERE fv.value != -1 AND fv.filtertypeid IN (SELECT DISTINCT filtertypeid FROM filterpercategories WHERE categoryid=$1 OR categoryid IN (SELECT parentid FROM categories WHERE id=$1))";
            let sql2 = "SELECT id, name, type FROM filtertypes WHERE id IN (SELECT DISTINCT filtertypeid FROM filterpercategories WHERE categoryid=$1 OR categoryid IN (SELECT parentid FROM categories WHERE id=$1))";
            let [filterValues, filterTypes] = await Promise.all([pool.query(sql1, [req.query.id]), pool.query(sql2, [req.query.id])]);
            res.status(200).send({ filterValues: filterValues.rows, filterTypes: filterTypes.rows });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Missing category field." });
    }
});


app.post("/verifyListing", async (req, res) => {
    console.log(req.body);
    if (typeof req.body.update.decision == "undefined" || typeof req.body.update.listingId == "undefined" || req.body.update.decision < 0 || req.body.update.decision > 3) {
        return res.status(400).send({ message: "Missing decision field." });
    }
    try {
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                let decision = req.body.update.decision;
                let listingId = req.body.update.listingId;
                let update = await pool.query("UPDATE listings SET verificationStatus = $1 WHERE id = $2", [req.body.update.decision, req.body.update.listingId]);
                res.sendStatus(200);
            }
        });
    } catch (err) {
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});

app.get("/sellersToPay", async (req, res)=>{
    try {
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                let getSql = await pool.query("GET email, transactions.* FROM users WHERE id IN (SELECT sellerid FROM transactions WHERE isSellerPaid = false)");
                res.send(getSql.rows);
            }
        });
    } catch (err) {
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


app.post("/createGuestUser", async (req, res)=>{
    try{
        let emailValue = "";
        if(typeof req.body.email != "undefined" && req.body.email != ""){
            emailValue = req.body.email;
        }else{
            emailValue = null;
        }

        if(typeof req.body.username != "undefined" && typeof req.body.description != "undefined"){
            let randomPassword = Math.random().toString(36).slice(-8);
            let sql = await pool.query("INSERT INTO users (name, email, password, signupsource, isguest) VALUES ($1, $2, $3, 'guest_fake_supply', true)", [req.body.username, emailValue, randomPassword]);
            return res.sendStatus(200);
        }else{
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({ message: "There has been a server error, please try again." });
    }
});


app.post("/postGuestListing", async (req, res) => {
    let price = Math.round(parseFloat(req.body.price) * 100);
    let description = req.body.description;
    let condition = req.body.condition;
    let pictures = req.body.pictures;
    let predefType = req.body.predefType;
    let predefTypeName = req.body.predefTypeName;
    let sellerId = req.body.sellerId;

    if(typeof predefType != "undefined" && predefTypeName && predefType >= 0 && predefTypeName.length > 0) {
        if (price.toString().length > 0 && price.toString().length < 255) {
            if (typeof description != "undefined" && description.length < 255) {
                if (pictures.length > 0) {
                    if (pictures.length < 6) {
                        try {
                            let sql1 = "INSERT INTO listings (title, description, sellerid, condition, price, status, pictures, predefType, isguestlisting, verificationstatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
                            let insertQuery = await pool.query(sql1, [predefTypeName, description, sellerId, condition, price, 0, pictures, predefType, true, 3]);
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


app.get("/getAllGuestUsers", async (req, res)=>{
    try{
        let sql = await pool.query("SELECT id, name, password FROM users WHERE isguest = true");
        return res.send(sql.rows);
    }catch(e){
        res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/getAllGuestListings", async (req, res)=>{
    try{
        let sql = await pool.query("SELECT listings.*, users.name AS sellername FROM listings INNER JOIN users ON users.id = listings.sellerid WHERE isguestlisting = true AND status = 0");
        return res.send(sql.rows);
    }catch(e){
        res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/getGuestOffers", async (req, res)=>{
    try{
        let sql = await pool.query("SELECT offers.*, users.description AS sellerdescription, users.name AS sellername FROM offers INNER JOIN users ON users.id = offers.receiverid WHERE status = 0 AND listingid IN (SELECT id FROM listings WHERE isguestlisting = true AND status = 0)");
        return res.send(sql.rows);
    }catch(err){
        return res.sendStatus(500);
    }
});


app.get("/addPartialPredefItems", async(req, res)=>{
    try{
        let sql = await pool.query("SELECT * FROM predefitem WHERE id > 1446");

        let categoryId = 72;
        let isActualItem = false;

        let allElements = [];
        for(let i = 0;i<sql.rows.length;i++){
            let exploded = powerset(sql.rows[i].title.split(" "));
            console.log(exploded);
            for(let j=0;j<exploded.length - 1;j++){
                if(exploded[j].length > 0){
                    let reBuiltString = "";
                    for(let w = exploded[j].length - 1;w >= 0; w--){
                        reBuiltString+= exploded[j][w]+" ";
                    }
                    reBuiltString = reBuiltString.substring(0, reBuiltString.length-1);
                    reBuiltString = reBuiltString.replace("  ", " ");
                    reBuiltString = reBuiltString.replace("   ", " ");

                    allElements.push(reBuiltString);
                }
            }
        }

        let seen = {};
        let filteredAllElements = allElements.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });


        for(let i=0;i<vrHeadsets.length;i++){
            let sql = await pool.query("INSERT INTO predefitem (title, categoryid, isActualItem) VALUES ($1, $2, false)", [vrHeadsets[i], categoryId]);
        }
        res.send(vrHeadsets);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.post("/deleteGuestListing", async (req, res)=>{
    try{
        if(typeof req.body.id == "undefined"){
            res.sendStatus(500);
        }
        let sql = await pool.query("UPDATE listings SET deleted = true WHERE id = $1", [req.body.id]);
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
    }
});

app.post("/declineGuestOffer", async(req, res)=>{
    jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
        if (err || typeof req.body.id == "undefined") {
            console.log(err);
            return res.status(500).send({ message: "These has been a server error, please try again." });
        } else {
            let sql = await pool.query("UPDATE offers SET status = 2 WHERE id = $1", [req.body.id]);
            res.sendStatus(200);
        }
    });
});

app.post("/acceptGuestOffer", async(req, res)=>{
    jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
        if (err || typeof req.body.id == "undefined") {
            console.log(err);
            return res.status(500).send({ message: "These has been a server error, please try again." });
        } else {
            let sql = await pool.query("UPDATE offers SET status = 1 WHERE id = $1", [req.body.id]);
            res.sendStatus(200);
        }
    });
});



function powerset(l) {
    return (function ps(list) {
        if (list.length === 0) {
            return [[]];
        }
        var head = list.pop();
        var tailPS = ps(list);
        return tailPS.concat(tailPS.map(function(e) { return [head].concat(e); }));
    })(l.slice());
}

module.exports = app;