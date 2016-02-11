var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride  = require('method-override'),
    path = require('path'),
    app = express(),
    config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());      // simulate DELETE and PUT
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res, next) {
    res.sendfile('./public/index.html');
});
require('./api/routes')(app);

app.set('port', config.port);

app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});
