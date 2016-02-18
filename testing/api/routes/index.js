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

    app.post('/runTest', function(req, res, next) {
        if(!req.body.address.trim() || !req.body.command.trim()){
            res.status(400).send('Script or url is not defined');
        }
        webdriver.test(req.body.address, req.body.command, req.body.options, function (err, message) {
            res.header("Content-Type", "application/json");
            if (!err) {
            res.status(200).send('200 OK');
            } else {
            if (message) {
             res.status(400).send(message.message);
            } else {
                res.status(500).send('500 Internal Server Error');
            }
            }
        })
    });

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

    app.get('/app', function(req, res, next) {
        if(req.session.user){
            var roles = Roles.resolve(req.session.user.role);
            res.render('../views/index', {'user': req.session.user.name, 'menu' : roles.menu, 'options' : roles.createOptions})
        }
        else res.redirect('/')
    });

    app.get('/', function(req, res, next){
        if(req.session.user) {
            res.redirect('/app')
        }
        else {
            res.render('../views/auth', { flash: JSON.stringify(req.flash('msg'))})
        }
    });

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

    app.get('/scenario', function(req, res){
        var role = req.session.user.role;
        if(role === 'admin' || role === 'checker') {

            Scenarios.find({}, function (err, scenarios) {
                if (!err) {
                    res.send(scenarios)
                }
                else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
        } else {
            res.status(550).send('Permission denied');
        }
    });

    app.post('/scenario', function(req, res){
        var role = req.session.user.role;
        if(role === 'admin' || role === 'checker') {

            if (!req.body.name || !req.body.text) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");

            var scenario = {
                name: req.body.name,
                scenario: req.body.text
            };

            Scenarios.create(scenario, function (err) {
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

            if (!req.body.id) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");
            Scenarios.update({'_id': req.body.id}, {
                'name': req.body.name,
                'scenario': req.body.scenario
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

        if (!req.body.id) {
            res.status(400).send('Bad request');
        }
        res.header("Content-Type", "application/json");
        Scenarios.remove({'_id': req.body.id}, function (err) {
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
        var role = req.session.user.role;
        if (role === 'admin' || role === 'checker') {

            if (!req.body.id) {
                res.status(400).send('Bad request');
            }
            res.header("Content-Type", "application/json");
            Scenarios.find({'_id': req.body.id}, function (err, data) {
                if (!err) {
                    res.status(200).send(data);
                } else {
                    res.status(500).send('500 Internal Server Error');
                }
            })
        } else {
            res.status(550).send('Permission denied');
        }
    });

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

    app.get('*', function(req, res){res.redirect('/')});
};