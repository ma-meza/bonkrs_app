const { Storage } = require('@google-cloud/storage');
const path = require('path');
const storage = new Storage({
    projectId: 'neon-alcove-266902',
    keyFilename: 'neon-alcove-266902-3277d164c360.json',
});
const bucket = storage.bucket('assets_clients');


function getPublicUrl(filename) {
    return `https://storage.googleapis.com/assets_clients/${filename}`;
}

function sendUploadToGCS(req, res, next) {
    console.log(req);
    if (!req.file) {
        console.log("NO FILE");
        return next();
    }


    const gcsname = res.locals.userId + "_logo_" + new Date();
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
        resumable: false,
    });

    stream.on('error', err => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', async () => {
        req.file.cloudStorageObject = gcsname;
        await file.makePublic();
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
    });

    stream.end(req.file.buffer);
}


const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // no larger than 10mb
    }
});

module.exports = {
    getPublicUrl,
    sendUploadToGCS,
    multer,
};