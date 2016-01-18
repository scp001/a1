var express = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    path = require('path'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());      // simulate DELETE and PUT
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
    res.sendfile('./public/inputForm.html');
});
require('./api/runTest.js')(app);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
