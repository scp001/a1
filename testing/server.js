var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride  = require('method-override'),
    path = require('path'),
    app = express(),
    config = require('./api/config'),
    compression = require("compression"),
    session = require("express-session"),
    passport = require('passport'),
    flash = require('connect-flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());      // simulate DELETE and PUT
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/api/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(compression());
app.use(cookieParser(config.secret));
app.use(flash());

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 60000}
}));

app.use(passport.initialize());
app.use(passport.session());

require('./api/routes')(app, passport);

app.set('port', config.port);

app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});