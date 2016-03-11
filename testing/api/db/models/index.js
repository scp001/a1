var db = require('../index.js'),
    Schema = require('mongoose').Schema,
    mongoose = require('mongoose');

//data models definition
var usersSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: String
});

var scenariosSchema = new Schema({
    name: String,
    scenario: String,
    url: String
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

var metadataSchema = new Schema({
    name: String,
    scenarios: {
        defaultInserted: { type: Boolean, default: false}
    }
});

var Users = mongoose.model('Users', usersSchema);
var Scenarios = mongoose.model('Scenarios', scenariosSchema);
var Tests = mongoose.model('Tests', testsSchema);
var Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = {
  Users: Users,
  Scenarios: Scenarios,
  Tests: Tests,
  Metadata: Metadata
};
