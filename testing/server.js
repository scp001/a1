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
    flash = require('connect-flash'),
    timeout = require('connect-timeout'),
    webdriver = require('./api/webdriver');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride());      // simulate DELETE and PUT
app.set('view engine', config.templateEngine);
app.set('views',path.join(__dirname, '/api/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(compression());
app.use(cookieParser(config.secret));
app.use(flash());

app.use(timeout(15000));

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: config.sessionCookie
}));

require('./api/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

require('./api/routes')(app, passport);

app.set('port', config.http.port);

io = require('socket.io').listen(app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
}));

util = require('util');

io.on('connection', function(socket){

    socket.on('run test', function(data){
        var address = data.address;
        var testname = data.testname;
        var command = data.command;
        var result = {testname: testname, code: 400, msg: 'Script or url is not defined'};

        if(!address.trim() || !command.trim()){
            io.emit('send status', result);
        }
        else {
            webdriver.test(address, command, function (err, message, currentRow) {
                console.log('Test completed.')
                if (!err) {
                    result = {testname: testname, code: 200, msg: 'OK'};
                } else {

                    if (message) {
                        result = {testname: testname, code: 310, msg: message.message, atRow : currentRow};
                    } else {
                        result = {testname: testname, code: 500, msg: 'Internal Server Error'};
                    }
                }
                io.emit('send status', result);
            });
        }
    });

    socket.on('error', function(err){
        console.log('socket err');
        console.log(util.inspect(err, { showHidden: true, depth: null }));
    });
});
