var db = require('../index.js'),
    Schema = require('mongoose').Schema,
    mongoose = require('mongoose');

var usersSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: String
});

var scenariosSchema = new Schema({
    name: String,
    scenario: String
});

var testsSchema = new Schema({
    student : {
        id: String,
        name: String,
        course: String
    },
    scenario: String,
    result: String,
    comment: String
});

var Users = mongoose.model('Users', usersSchema);
var Scenarios = mongoose.model('Scenarios', scenariosSchema);
var Tests = mongoose.model('Tests', testsSchema);

module.exports = {
  Users: Users,
  Scenarios: Scenarios,
  Tests: Tests
};