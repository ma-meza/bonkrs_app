const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

require('dotenv').config();


// module.exports.loggedInCheckForNonProtectedRoutes = function (req, res, next) {
//     if (!req.cookies.userLogin) {
//         //if user not logged in
//         next();
//     } else {
//         var theCookie = req.cookies.userLogin;
//         jwt.verify(theCookie, process.env.JWT_SECRET_KEY, function (err, decryptedToken) {
//             if (err) {
//                 res.sendStatus(500);
//             } else {
//                 res.locals.userId = decryptedToken.id;
//                 res.locals.userType = decryptedToken.type;

//                 res.sendStatus(403);
//             }
//         });
//     }
// };


module.exports.sessionDenyIfLoggedIn = function (req, res, next) {
    if (!req.cookies.userLogin) {
        //if user not logged in
        next();
    } else {
        res.sendStatus(403);
    }
}


module.exports.sessionLoggedInCheck = function (req, res, next) {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                res.locals.userId = decryptedToken.id;
                next();
            }
        });
    } else {
        return res.status(403).send({ message: "Not authorized." });
    }
};


module.exports.employeeSession = function (req, res, next) {
    if (req.headers.employeeAuthorization) {
        jwt.verify(req.headers.employeeAuthorization, process.env.JWT_SECRET_KEY, function (err, decryptedToken) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "These has been a server error, please try again." });
            } else {
                res.locals.userId = decryptedToken.id;
                next();
            }
        });
    } else {
        return res.status(403).send({ message: "Not authorized." });
    }
};