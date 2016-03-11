var webdriver = require('../webdriver');
var parser = require('../parser');
var passport = require('passport');
var config = require('../config');
var Scenarios = require('../db/models').Scenarios;
var Users = require('../db/models').Users;
var Tests = require('../db/models').Tests;
var Roles = require('../utils').Roles;
var _ = require('lodash');
require('../passport')(passport);


module.exports = function (app, passport) {

/*
  /parse - endpoint for receive text in human language
  status codes:
  200 - ok;
  400 - undefined data;
  500 - internal server error;
*/
    app.post('/parse', function(req, res, next){
        if(!req.body.data.trim()){
            res.status(400).send('Human text is not defined');
         }
        parser.start(req.body.data.trim(), function(err, data){
          res.header("Content-Type", "application/json");
          if (!err) {
              res.status(200).send(data);
          } else {
              res.status(500).send('500 Internal Server Error');
          }
        })
    });

/*
  /app - main endpoint, returns main page
*/

    app.get('/app', function(req, res, next) {
        if(req.session.user){
            var roles = Roles.resolve(req.session.user.role);
            res.render('../views/index', {
                'user': req.session.user.name,
                'menu' : roles.menu,
                'options' : roles.createOptions
            })
        }
        else res.redirect('/')
    });

/*
  default route - if user logged in that redirects to /app
  and redirects to authorization page if user not authorized
*/

    app.get('/', function(req, res, next){
        if(req.session.user) {
            res.redirect('/app')
        }
        else {
            res.render('../views/auth', { flash: JSON.stringify(req.flash('msg'))})
        }
    });

/*
  authentication route
*/

    app.post('/', function(req, res, next) {

        passport.authenticate('local',
            function(err, user, info){
                if(err) {
                    req.flash('msg', 'Ooops, something went wrong. Please, try again');
                    res.redirect('/');
                }
                if(info) {
                    req.flash('msg', 'Sorry, you are not registered in the system');
                    res.redirect('/');
                }
                if(user) {
                    req.session.user = { id: user._id, role: user.role, name: user.name };
                    res.cookie('role', user.role);
                    res.redirect('/app');
                }
        })(req, res, next);
    });

/*
  endpoints for CRUD operations on scenarios
  get /scenario - returns all scenarios in database;
  post /scenario - update existing scenario;
  put /scenario - create new scenario;
  delete /scenario - deleting selected scenario;
  get /script - return specified scenario;
  status codes:
  200 - ok;
  400 - something wrong wit request;
  500 - internal server error;
  550 - permission denied;
*/

    app.get('/scenario', function(req, res){

            Scenarios.find({}, function (err, scenarios) {
                if (!err) {
                    res.send(scenarios)
                }
                else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
    });

    app.post('/scenario', function(req, res){

        var role = req.session.user.role;
        if(role === 'admin' || role === 'checker') {

            if (!req.body.name || !req.body.text || !req.body.url) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");

            var scenario = {
                name: req.body.name,
                scenario: req.body.text,
                url: req.body.url
            };

            Scenarios.update({'name' : scenario.name}, scenario, { upsert: true }, function (err) {
                if (!err) {
                    res.status(200).send('Success! Scenario has been saved in the system. ');
                } else {
                    res.status(500).send('500 Internal Server Error');
                }
            });

        } else {
            res.status(550).send('Permission denied');
        }
    });

    app.put('/scenario', function(req, res){

        var role = req.session.user.role;

        if(role === 'admin' || role === 'checker') {

            if (!req.body.name) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");
            Scenarios.update({'name': req.body.name}, {
                'name': req.body.name,
                'scenario': req.body.text,
                'url' : req.body.url
            }, function (err) {
                if (!err) {
                    res.status(200).send('Success! Scenario has been updated. ');
                } else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
        } else {
            res.status(550).send('Permission denied');
        }
    });

    app.delete('/scenario', function(req, res) {
        var role = req.session.user.role;
        if (role === 'admin' || role === 'checker') {

            if (!req.body.scenario) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");
            Scenarios.remove({'scenario': req.body.scenario}, function (err) {
                if (!err) {
                    res.status(200).send('Success! Scenario has been removed. ');
                } else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
        } else {
            res.status(550).send('Permission denied');
        }
    });

    app.post('/script', function(req, res){

            if (!req.body.name) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");
            Scenarios.find({'name': req.body.name}, function (err, data) {
                if (!err) {
                    res.status(200).send(data);
                } else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
    });
/*
  /account - create a new account in system
  status codes:
  200 - ok;
  400 - something wrong wit request;
  500 - internal server error;
  550 - permission denied;
*/
    app.post('/account', function(req, res){

        var role = req.session.user.role;
        if (role === 'admin' || role === 'checker') {

            if (!req.body.user) {
                res.status(400).send('Bad request');
            }

            res.header("Content-Type", "application/json");

            var newUser = req.body.user;

            if(role === 'checker' && (newUser.role === 'admin' || newUser.role === 'checker')) {
                res.status(550).send('Permission denied');
            }
            else {
                Users.create(newUser, function (err) {
                    if (!err) {
                        res.status(200).send('Success! New user has been created.');
                    } else {
                        res.status(500).send('500 Internal Server Error');
                    }
                })
            }
        } else {
            res.status(550).send('Permission denied');
        }
    });

    /*
        /students
        get - returns all tests
        post - create new test assigned for current student
    */

    app.get('/students', function(req, res){
        Tests.find({}, function(err, students){
            if(!err) {
                res.send(students)
            }
            else {
                res.status(500).send('500 Internal Server Error');
            }
        })
    });

    app.post('/students', function(req, res){
        if(!req.body.test) {
            res.status(400).send('Bad request');
        }
        res.header("Content-Type", "application/json");

        var test = req.body.test;
        test.student['name'] = req.session.user.name;
        test.student['id'] = req.session.user.id;
        Tests.create(test, function(err){
            if (!err) {
                res.status(200).send('Success! Test results has been saved.');
            } else {
                res.status(500).send('500 Internal Server Error');
            }
        });
    });

    // search students in database
    app.post('/search', function(req, res){

        if(!req.body.name) {
            res.status(400).send('Bad request');
        }
        res.header("Content-Type", "application/json");

        var name = req.body.name;
        Tests.find( { 'student.name' : { $regex: new RegExp('^' + name.toLowerCase(), 'i')} }, function(err, user){
            if(!err) {
                res.send(user);
            } else {
                res.status(500).send('500 Internal Server Error');
            }
        })
    });

    app.post('/restore', function(req, res){
        var names = config.scenarios.names;
        _.each(names, function(item){
            Scenarios.remove({'name' : item}, function(err){
                if(err) console.error(err);
            })
        });
        config.scenarios.insert();
        res.header("Content-Type", "application/json");
        res.status(200).send('Default scenarios data has been restored');
    });

    app.get('/logout', function(req, res){
        delete req.session.user;
        res.redirect('/');
    });
//if specified route not matches with routes above, then redirect it to default
    app.get('*', function(req, res){res.redirect('/')});
};
