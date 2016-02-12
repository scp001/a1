var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/altester');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function(){
    console.log('Db is up and running');
});

module.exports = db;