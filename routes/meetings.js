var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Meetings = require('../models/meetings');
var Members = require('../models/members');
// precinct list
router.get('/', function(req, res) {
	Meetings.find({}, function (err, meetings) {
		res.render('app/meetings/list', {meetings: meetings, message: req.flash('meetings')});
	});
});

router.get('/showold', function(req, res) {
	Meetings.find({"list": false}, function (err, meetings) {
		res.render('app/meetings/list', {meetings: meetings, message: req.flash('meetings')});
	});
});
router.get('/signin-blank/:id', function(req, res) {
	Meetings.findOne({"_id": req.params.id}, function (err, meetings) {
				res.render('app/meetings/signin-blank', {meetings: meetings,message: req.flash('meetings')});
			});
});

router.get('/signin/:id', function(req, res) {
	Meetings.findOne({"_id": req.params.id}, function (err, meetings) {
		if(err) { 
			throw err;
		}
		if(meetings.type == "eboard") {
			console.log("Generating EBoard signin sheet");
			Members.find()
				.populate(
					{path: 'roles', match: {eboard: "Yes"}}
				).sort({"last_name": 1}).exec(function(err, members) {
				res.render('app/meetings/signin', {meetings: meetings, members:members, message: req.flash('meetings')});
			});
		} else if(meetings.type == "general") {
			console.log("Generating General  signin sheet");
			Members.find()
				.populate(
					{path: 'roles', match: {voting: "Yes"}}
				).sort({"last_name": 1}).exec(function(err, members) {
				res.render('app/meetings/signin', {meetings: meetings, members:members, message: req.flash('meetings')});
			});

		} else if (meetings.type == "committee") {
			console.log("Generating Committee signin sheet");
			req.flash('meetings', "Unsupported meeting type right now");
			res.redirect('/');

		}
		
	});
});

router.get('/attendance/:id', function(req, res) {
	Meetings.findOne({"_id": req.params.id}, function (err, meetings) {
		if(err) {
				throw err;
			}
		Members.find({}, function(err, members) {
			if(err) {
				throw err;
			}
			res.render('app/meetings/attendance', {meetings: meetings, members: members, message: req.flash('meetings')});
		});
	});
});

router.post('/attendance/:id', function(req, res) {
	Meetings.findOneAndUpdate({'_id': req.params.id}, {$set: {attendance: []}}, {upsert: true}, function(err, p) {if(err) { throw err;}});
	if(req.body.attendance) {
		if(typeof req.body.attendance == "string") {
			Meetings.findOneAndUpdate({'_id': req.params.id}, {$push: {attendance: mongoose.Types.ObjectId(req.body.attendance )}}, {upsert: true}, function(err, p) {if(err) throw err;});
		} else {
			console.log("in else");
			for(i in req.body.attendance) {
				Meetings.findOneAndUpdate({'_id': req.params.id}, {$push: {attendance: mongoose.Types.ObjectId(req.body.attendance[i] )}}, {upsert: true}, function(err, p) {if(err) throw err;});
			}
		}
	}
	res.redirect('/membership/meetings/attendance/' + req.params.id)
});

router.get('/add', function(req, res) {
	res.render('app/meetings/add',  {message: req.flash('meetings')});
});

router.post('/add', function(req, res) {
	var newMeeting = new Meetings();
	newMeeting.name = req.body.name;
	newMeeting.date = req.body.date;
	newMeeting.location = req.body.location;
	newMeeting.type = req.body.meeting_type;
	newMeeting.save(function(err) {
		if(err) {
			throw err;
		}
		req.flash("meetings", "Added meeting successfully");
		res.redirect('/membership/meetings');
	});
});

router.get('/delete/:id', function(req, res) {
	Meetings.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		res.redirect('/membership/meetings');
	});
});

module.exports = router;