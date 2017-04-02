var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');

module.exports = function(passport) {
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Admin.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		Admin.findOne({'email': email}, function(err, user) {
			if(err) {
				return done(err);
			}
			if(!user || !user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Invalid username or password'));
			}
			return done(null, user);
		})
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email,password, done) {
		process.nextTick(function(){
			Admin.findOne({'email': email}, function(err, user){
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email address exists'));
				} else {
					var newAdmin = new Admin();
					newAdmin.firstName = req.body.first_name;
					newAdmin.lastName = req.body.last_name;
					newAdmin.email = email;
					newAdmin.password = newAdmin.generateHash(password);
					newAdmin.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, null);
					});
				}
			});
		});
	}));
}