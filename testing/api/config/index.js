'use strict';

//create root user if not exist
var Users = require('../db/models').Users;
Users.update({'name' : 'root'}, {'name' : 'root', 'username' : 'root', 'password' : '1', 'role' : 'admin'}, { upsert: true });

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    http: {
        'port': process.env.PORT || 3000
    },
    templateEngine: 'ejs',
    database: {
       url :  process.env.MONGOHQ_URL || 'mongodb://localhost/altester'
    },
    secret: 'altester',
    sessionCookie: {
        maxAge: 60000000 //do not change it
    }
};