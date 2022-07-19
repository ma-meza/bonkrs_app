const app = require("express").Router();
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const webpush = require('web-push');
const slackUtil = require("../utils/slackUtils");

app.get("/getAllUsersWaitlist", async function (req, res) {
    try {
        const allUsers = await pool.query("SELECT * FROM waitlist");
        return res.json(allUsers.rows);
    } catch (err) {
        res.sendStatus(500)
        return err.message;
    }
});

app.get("/userProfile", async function (req, res) {
    if (req.query.id) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
                if (err) {
                    let sql = "SELECT * from users WHERE id=$1";
                    try {
                        let sqlQuery = await pool.query(sql, [req.query.id]);
                        console.log(sqlQuery);
                        return res.status(200).send({userInfos: sqlQuery.rows[0]});
                    } catch (err) {
                        slackUtil.sendErrorLog(err);
                        return res.status(500).send({message: "There has been a server error, please try again."});
                    }
                } else {
                    let sql1 = "SELECT * from users WHERE id=$1";
                    let sql2 = "SELECT * from followUsers where followerid=$1 AND followeduserid=$2";

                    try {
                        let [userInfos, followedInfo] = await Promise.all([pool.query(sql1, [req.query.id]), pool.query(sql2, [decryptedToken.id, req.query.id])]);
                        return res.status(200).send({userInfos: userInfos.rows[0], followedInfo: followedInfo.rows});
                    } catch (err) {
                        slackUtil.sendErrorLog(err);
                        return res.status(500).send({message: "There has been a server error, please try again."});
                    }
                }
            });
        } else {
            let sql = "SELECT * from users WHERE id=$1";
            try {
                let sqlQuery = await pool.query(sql, [req.query.id]);
                console.log(sqlQuery);
                return res.status(200).send({userInfos: sqlQuery.rows[0]});
            } catch (err) {
                slackUtil.sendErrorLog(err);
                return res.status(500).send({message: "There has been a server error, please try again."});
            }
        }
    } else {
        return res.status(400).send({message: "Please provide a user id."});
    }
});

app.get("/usersFollowed", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    let sqlFollow = "SELECT users.name, users.id, users.profilepicture FROM users WHERE id IN (SELECT followeduserid FROM followusers WHERE followerid = $1)";
    try {
        let getFollowed = await pool.query(sqlFollow, [res.locals.userId]);
        console.log(getFollowed);
        res.status(200).send(getFollowed.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/loggedInUserProfile", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    let sql = "SELECT name, bio, shippingAddress, profilePicture, name from users WHERE id=$1";
    try {
        let sqlQuery = await pool.query(sql, [res.locals.userId]);
        return res.status(200).send(sqlQuery.rows[0]);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/usernameIsValid", async function (req, res) {
    if (typeof req.query.uname != "undefined") {
        let username = (req.query.uname).toLowerCase();
        let findUname = await pool.query("SELECT COUNT(id) FROM users WHERE lower(name) = $1", [username]);
        try {
            console.log(findUname.rows);
            return res.status(200).send({count: findUname.rows[0].count});
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({message: "There has been a server error, please try again."});
        }
    } else {
        return res.status(400).send({message: "Please provide a username."});
    }
});


app.get("/customFeed", async (req, res) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
            if (err) {
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                let userId = decryptedToken.id;
                try {
                    let sql = await pool.query("SELECT listings.*, users.name AS sellername, users.profilePicture AS sellerprofilepicture, users.avgrating FROM listings INNER JOIN users ON users.id = listings.sellerId WHERE status = 0 AND verificationstatus = 3 AND deleted = false AND sellerid != $1 LIMIT 10", [userId]);
                    let userSql = await pool.query("SELECT name FROM users WHERE id = $1", [userId]);
                    // let notifSql = await pool.query("SELECT notif.* FROM notificationKeys AS notif WHERE userid = $1 AND isvalid=true", [res.locals.userId]);
                    // for (let i = 0; i < notifSql.rows.length; i++) {
                    //     let notif = notifSql.rows[i];
                    //     let sendNotifObj = {
                    //         endpoint: notif.endpoint,
                    //         keys: {
                    //             p256dh: notif.privatekey,
                    //             auth: notif.authkey
                    //         }
                    //     };
                    //     const payload = JSON.stringify({
                    //         title: 'Hello!',
                    //         body: 'It works.',
                    //     })

                    //     webpush.sendNotification(sendNotifObj, payload);
                    //     // .then(result => console.log(result))
                    //     // .catch(e => console.log(e.stack));
                    // }
                    return res.send({feed: sql.rows, name: userSql.rows[0].name});
                } catch (err) {
                    slackUtil.sendErrorLog(err);
                    return res.send({feed: [], name: ""});
                }
            }
        });
    } else {
        let sql = await pool.query("SELECT listings.*, users.name AS sellername, users.avgrating ,users.profilePicture AS sellerprofilepicture FROM listings INNER JOIN users ON users.id = listings.sellerId WHERE status = 0 AND deleted = false AND verificationstatus = 3 LIMIT 10 ");
        return res.send({feed: sql.rows, name: ""});
    }
});

app.get("/basicFeed", async (req, res) => {
    try {
        let sql = await pool.query("SELECT listings.*, users.name AS sellername, users.avgrating ,users.profilePicture AS sellerprofilepicture FROM listings INNER JOIN users ON users.id = listings.sellerId WHERE status = 0 AND deleted = false AND verificationstatus = 3 LIMIT 10 ");
        res.send(sql.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        res.send([]);
    }
});



app.get("/getShippingAddress", sessionMiddlewares.sessionLoggedInCheck, async (req, res)=> {
    try {
        let sql = await pool.query("SELECT shippingAddress FROM users WHERE id = $1 LIMIT 1", [res.locals.userId]);
        res.send(sql.rows[0].shippingaddress);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        res.send("");
    }
});


module.exports = app;
