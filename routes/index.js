var express = require('express');
var router = express.Router();
var passport = require('passport');

// login and logout
router.get('/', function(req, res, next) {
  res.render('index', { message: req.flash('loginMessage') });
});

router.post('/', passport.authenticate('local-login', {
	successRedirect: '/membership', 
	failureRedirect: '/',
	failureFlash: true
}));


router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
