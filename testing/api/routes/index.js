var webdriver = require('../webdriver');
var parser = require('../parser');
var passport = require('passport');
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
        req.session.user ? res.render('../views/index', {'user': req.session.user}) : res.redirect('/')
    });

    app.get('/', function(req, res, next){
        req.session.user ? res.redirect('/app') : res.render('../views/auth', { flash: JSON.stringify(req.flash('msg'))})
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
                    res.redirect('/app');
                }
        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        delete req.session.user;
        res.redirect('/');
    });

    app.get('*', function(req, res){res.redirect('/')});
};