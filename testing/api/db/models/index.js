var db = require('../index.js'),
    Schema = require('mongoose').Schema,
    mongoose = require('mongoose');

var usersSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: String
});

var Users = mongoose.model('Users', usersSchema);

function getAll(){
    return Users.find({})
}

function getByName(name) {
    return Users.find({'name' : name})
}

//Users.create({'name' : 'root', 'username' : 'root', 'password' : '1', 'role' : 'admin'});

exports.Users = Users;

var scenariosSchema = new Schema({
    name: String,
    scenario: String
});

var Scenarios = mongoose.model('Scenarios', scenariosSchema);

function editScenario(name, newScenario){
    return Scenarios.update({'name' : name}, {'name' : newScenario.name, 'scenario' : newScenario.scenario})
}

function addScenario(newScenario){
    return Scenarios.create(newScenario)
}

function removeScenario(name){
    return Scenarios.remove({'name' : name})
}

exports.Scenarios = Scenarios;

var testsSchema = new Schema({
    student : {
        id: String,
        name: String,
        course: String
    },
    results: String,
    comment: String
});

var Tests = mongoose.model('Tests', testsSchema);



exports.Tests = Tests;