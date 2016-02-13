var Users = require('../db/models').Users;
Users.update({'name' : 'root'}, {'name' : 'root', 'username' : 'root', 'password' : '1', 'role' : 'admin'}, { upsert: true });

module.exports = {
    'port': process.env.PORT || 3000,
    'database': 'mongodb://localhost/altester',
    'secret': 'secret'
};