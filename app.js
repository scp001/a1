// app.js Node.js server

"use strict;"   // flag JS errors 

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. splat.api
 * The convention is use the same name for variable and module.
 */
var http = require('https'),
    // NOTE, use the version of "express" linked to the assignment handout
    express = require('express'),
    fs = require("fs"),
    path = require("path"),
    url = require("url"),
    multer = require("multer"),
    logger = require("morgan"),
    compression = require("compression"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    directory = require("serve-index"),
    errorHandler = require("errorhandler"),
    basicAuth = require("basic-auth-connect"),  // optional, for HTTP auth	
	csrftoken = require("csurf"),	// for CSRF token
	
    // config is an object module, that defines app-config attribues,
    // such as "port", DB parameters
    config = require("./config"),
    splat = require('./routes/splat.js');  // route handlers

var options = {
	key: fs.readFileSync('key.pem'), //RSA private-key
	cert: fs.readFileSync('cert.pem'), // RSA public-key certificate
};

var app = express()  // Create Express app server

// Configure app server

// use PORT environment variable, or local config file value
app.set('port', process.env.PORT || config.port);

// activate basic HTTP authentication (to protect your solution files)
app.use(basicAuth('songzhi', '12345'));  // REPLACE username/password

// change param value to control level of logging
app.use(logger(config.env));  // 'default', 'short', 'tiny', 'dev'

// use compression (gzip) to reduce size of HTTP responses
app.use(compression());

// change the configuration of your session cookies to include the secure flag
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie:{secure: true}
}));
app.use(csrftoken());

// Setup for rendering csurf token into index.html at app-startup
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public');
// When client-side requests index.html, perform template substitution on it
app.get('/index.html', function(req, res) {
    // req.csrfToken() returns a fresh random CSRF token value
    res.render('index.html', {csrftoken: req.csrfToken()});
});

// parse HTTP request body
app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));

// set file-upload directory for poster images
app.use(multer({dest: __dirname + '/public/img/uploads/'}));

// checks req.body for HTTP method overrides
app.use(methodOverride());

// load static html
app.use(express.static(__dirname + ""));

// App routes (RESTful API) - handler implementation resides in routes/splat.js

// Perform route lookup based on HTTP method and URL.
// Explicit routes go before express.static so that proper
// handler is invoked rather than static-content processor

// Heartbeat test of server API
app.get('/', splat.api);

// Retrieve a single movie by its id attribute
app.get('/movies/:id', splat.getMovie);

// ADD CODE to support other routes listed on assignment handout
app.get('/movies', splat.getMovies);
app.post('/movies', splat.addMovie);
app.put('/movies/:id', splat.editMovie);
app.delete('/movies/:id', splat.deleteMovie);

app.get('/movies/:id/reviews', splat.getReviews);
app.post('/movies/:id/reviews', splat.addReview);

app.get('/movies/:id/video', splat.playMovie);

app.get('/auth', splat.getUsers);
app.post('/auth', splat.signup);
app.put('/auth', splat.signin);


// location of app's static content
app.use(express.static(__dirname + "/public"));

// return error details to client - use only during development
app.use(errorHandler({ dumpExceptions:true, showStack:true }));

// Default-route middleware, in case none of above match
app.use(function (req, res) {
	res.status(404).send("Request not accepted.");
});

// error-handling Express middleware function
app.use(function(err, req, res, next) {
    if(err.code == 'EBADCSRFTOKEN'){
        res.status(403).send("Please reload the page to get a fresh CSRF token value.");
    }else{
        // hand off control to the next callback
        next(err);
    }
});

// Start HTTP server
var a = http.createServer(options, app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode",
    		app.get('port'), config.env );
});
