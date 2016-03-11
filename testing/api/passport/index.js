//authentication block
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../db/models').Users;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {

            process.nextTick(function() {

                Users.findOne({'username': username, 'password' : password}, { "_id" : 1, "name" : 1, "role" : 1 },
                    function(err, user) {
                        if (err){
                            return done(err);
                        }
                        if (user) {
                            return done(null, user);
                        } else {
                            return done(null, false, 'Ooops, something went wrong. Please, try again');
                        }
                });
            });

        }));
};
