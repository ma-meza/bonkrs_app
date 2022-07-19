const app = require("express").Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");

const s3 = new AWS.S3();
// configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// abstracts function to upload a file returning a promise
const uploadProfilePicture = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "profile-pictures-cambio",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`,
    };
    return s3.upload(params).promise();
};



const uploadListingPicture = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: "listing-pictures-cambio",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`,
    };
    return s3.upload(params).promise();
};





// Define POST route
app.post('/uploadProfilePicture', sessionMiddlewares.sessionLoggedInCheck, (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        };
        try {
            const path = files.file[0].path;
            const fileStats = fs.statSync(path);
            if(fileStats.size > 25000000){
                //25mb
                return response.status(500).send({ message: "Your image size is too big. Please try uploading an image under 25mb." });
            }
            const buffer = fs.readFileSync(path);
            const type = await fileType.fromBuffer(buffer);
            if (type.mime == "image/png" || type.mime == "image/jpg" || type.mime == "image/jpeg" || type.mime == "image/svg") {
                const fileName = `${Date.now().toString() + response.locals.userId}`;
                const data = await uploadProfilePicture(buffer, fileName, type);
                let sql = "UPDATE users SET profilePicture = $1 WHERE id=$2";
                let query = await pool.query(sql, [data.Location, response.locals.userId]);
                return response.status(200).send(data);
            } else {
                return response.status(500).send({ message: "Image file format only." });
            }
        } catch (err) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        }
    });
});


app.post('/removeProfilePicture', sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    let sql1 = "SELECT profilepicture FROM users WHERE id=$1";
    let sql2 = "UPDATE users SET profilepicture='' WHERE id=$1";
    try {
        let profilePic = await pool.query(sql1, [res.locals.userId]);
        if (profilePic.rows[0].profilepicture) {
            let query = await pool.query(sql2, [res.locals.userId]);
            let fileKey = profilePic.rows[0].profilepicture;
            fileKey = fileKey.substring(49, fileKey.length);
            var params = { Bucket: 'profile-pictures-cambio', Key: fileKey };
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    return res.sendStatus(200);
                }
            });
        } else {
            return response.status(500).send({ message: "There has been a server error, please try again." });
        }
    } catch (err) {
        console.log(err);
        return response.status(500).send({ message: "There has been a server error, please try again." });
    }
});


app.post('/uploadListingPicture', sessionMiddlewares.sessionLoggedInCheck, (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        };
        try {
            const path = files.file[0].path;
            const fileStats = fs.statSync(path);
            if(fileStats.size > 25000000){
                //25mb
                return response.status(500).send({ message: "Your image size is too big. Please try uploading an image under 25mb." });
            }
            const buffer = fs.readFileSync(path);
            const type = await fileType.fromBuffer(buffer);
            if (type.mime == "image/png" || type.mime == "image/jpg" || type.mime == "image/jpeg" || type.mime == "image/svg") {
                const fileName = `${Date.now().toString() + response.locals.userId}`;
                const data = await uploadListingPicture(buffer, fileName, type);
                return response.status(200).send(data);
            } else {
                return response.status(500).send({ message: "Image file format only." });
            }
        } catch (err) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        }
    });
});


app.post('/uploadListingVerification', sessionMiddlewares.sessionLoggedInCheck, (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        };
        try {
            const path = files.file[0].path;
            const fileStats = fs.statSync(path);
            if(fileStats.size > 25000000){
                //25mb
                return response.status(500).send({ message: "Your image size is too big. Please try uploading an image under 25mb." });
            }
            const buffer = fs.readFileSync(path);
            const type = await fileType.fromBuffer(buffer);
            if (type.mime == "image/png" || type.mime == "image/jpg" || type.mime == "image/jpeg" || type.mime == "image/svg") {
                const fileName = `${Date.now().toString() + response.locals.userId}`;
                const data = await uploadListingPicture(buffer, fileName, type);
                return response.status(200).send(data);
            } else {
                return response.status(500).send({ message: "Image file format only." });
            }
        } catch (err) {
            console.log(err);
            return response.status(500).send({ message: "There has been a server error, please try again." });
        }
    });
});

// app.post('/removeListingPicture', sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
//     try {
//         if (profilePic.rows[0].profilepicture) {
//             let fileKey = profilePic.rows[0].profilepicture;
//             fileKey = fileKey.substring(49, fileKey.length);
//             var params = { Bucket: 'listing-pictures-cambio', Key: fileKey };
//             s3.deleteObject(params, function (err, data) {
//                 if (err) {
//                     console.log(err, err.stack);
//                 } else {
//                     return res.sendStatus(200);
//                 }
//             });
//         } else {
//             return response.status(500).send({ message: "There has been a server error, please try again." });
//         }
//     } catch (err) {
//         console.log(err);
//         return response.status(500).send({ message: "There has been a server error, please try again." });
//     }
// });
module.exports = app;
