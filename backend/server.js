const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_RR;
const numCPUs = require('os').cpus().length;

//clusters for all numCPUs
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork(); // Create a New Worker, If Worker is Dead
    });
} else {
    require('dotenv').config();

    //modules
    const helmet = require('helmet');
    const express = require('express');
    const mongoose = require('mongoose');
    mongoose.set('useFindAndModify', false);
    const cookieParser = require('cookie-parser');
    const cors = require('cors');
    const path = require("path");
    const hpp = require("hpp");


    //express framework
    var app = express();

    //set of security middlewares
    app.use(helmet());

    //cross-origin ressource sharing
    app.use( cors({
        credentials: true,
        origin: ["https://joincambio.com", "https://www.joincambio.com"],
    }));

    //for cookies
    app.use(cookieParser());

    //for static files AKA react
    // app.use(express.static(__dirname + '/public')); // configure express to use public folder for all img srcs and other files
    // app.get('*.js', function (req, res, next) {
    //     req.url = req.url + '.gz';
    //     res.set('Content-Encoding', 'gzip');
    //     next();
    // });

    // parse data from http post req
    app.use((req, res, next) => {
        if (req.originalUrl.startsWith('/stripe-webhook')) {
            next();
        } else {
            express.json()(req, res, next);
        }
    });
    app.use(express.urlencoded());

    //protect http parameter pollution attack
    app.use(hpp());

    //include all get routes
    var getRequests1 = require('./api/get/customerGet.js');
    var getRequests2 = require('./api/get/productGet.js');
    var postRequests1 = require('./api/post/customerPost.js');
    var postPictures = require("./api/post/picturesUpload.js");
    var stripeRoutes = require("./api/post/stripePayment.js");
    var employeeRoutes = require("./api/employeeRoutes.js");

    app.use('/', getRequests1);
    app.use('/', getRequests2);
    app.use('/', postRequests1);
    app.use('/', postPictures);
    app.use("/", stripeRoutes);
    app.use("/", employeeRoutes);

    //mongo connect
    mongoose.connect("mongodb+srv://markymark:Fortune2019@cluster0-sotud.gcp.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(error => console.log("MONGO SERVER ERROR" + error));


    //if no routes hit
    app.get("/*", function (_, res) {
        //react view
        // res.sendFile(path.join(__dirname, "/public/index.html"));
        res.sendStatus(404);
    });

    app.listen(8080, function () {
        console.log('Worker started! id:' + cluster.worker.id);
        console.log('Current enviro is '+process.env.NODE_ENV);
    });
}
