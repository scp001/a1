'use strict';

var Users = require('../db/models').Users,
    Scenarios = require('../db/models').Scenarios,
    Metadata = require('../db/models').Metadata,
    defaultScenarios = require('../default/scenarios'),
    _ = require('lodash');

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    http: {
         'host': process.env.HOST || 'localhost',
         'port': process.env.PORT || 3000
    },
    templateEngine: 'ejs',
    database: {
       url :  process.env.MONGOHQ_URL || 'mongodb://localhost/altester'
    },
    secret: 'altester',
    sessionCookie: {
        maxAge: 60000000 //do not change it
    },
    scenarios: {
        insert: insertScenarios,
        names: defaultScenarios.names
    }
};


//create root user if not exist
Users.update({'name' : 'root'}, {'name' : 'root', 'username' : 'root', 'password' : '1', 'role' : 'admin'}, { upsert: true }, function(err) {
    if (err) console.error(err);
});

//insert default scenarios if not already inserted

Metadata.findOne({'name' : 'default'}, function(err, data){
    if(!data) {
        Metadata.create({'name' : 'default', 'scenarios.defaultInserted' : true}, function(err){
            if(!err) insertScenarios();
            else console.error(err);
        });
    }
    else {
        if(!data.scenarios.defaultInserted) {
            insertScenarios();
        }
    }
});


function insertScenarios(){
    _.each(defaultScenarios.all, function(item){
        Scenarios.create(item, function(err){
            if(err) console.error(err);
        });
        Metadata.update({'name' : 'default'}, {'name' : 'default', 'scenarios.defaultInserted' : true}, function(err){
            if(err) console.error(err);
        });
    });
}
