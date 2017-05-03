var express = require('express');
var async = require('async');
var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var router = express.Router();
var osTmpDir = require('os-tmpdir');
var CSV = require('fast-csv');
var passport = require('passport');
var Admin = require("../models/admin");
var Interests = require('../models/interests');
var MemberTypes = require('../models/membertypes');
var MemberRoles = require('../models/memberroles');
var Members = require('../models/members');
var Precinct = require('../models/precinct');
// start page
router.get('/', function(req, res) {
	res.render('app/index.ejs', {message: req.flash('welcome')});
})
// show add admin form
router.get('/addadmin',  function(req, res) {
	res.render('app/admins/newadmin.ejs', { message: req.flash('signupMessage')});
});
// process new admin form
router.post('/addadmin', passport.authenticate('local-signup', {
	successRedirect: '/membership/admins',
	failureRedirect: '/membership/addadmin',
	failureFlash: true
}), function(req, res) {
	res.redirect(config.redirectAfterLogin);
});

// delete admin
router.get('/admins/delete/:id', function(req, res) {
	Admin.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		res.redirect('/membership/admins');
	});
});
// show list of admins
router.get('/admins', function(req, res) {
	Admin.find({}, function (err, users) {
		res.render('app/admins/list-admins', {users: users});
	});
});


router.get('/interests', function(req, res) {
	Interests.find({}, function (err, interests) {
		res.render('app/interests/list', {interests: interests, message: req.flash('interests')});
	});
});

router.get('/interests/add', function(req, res) {
	res.render('app/interests/add',  { message: req.flash('interests')});
});

router.post('/interests/add', function(req, res) {
	process.nextTick(function() {
		Interests.findOne({'name': req.body.name}, function(err, p) {
			if(err) {
				throw err;
			}
			if(p) {
				req.flash('interests', 'Interest already exists in the database');
				res.redirect('/membership/interests/add');
			} else {
				var newInterest = new Interests();
				newInterest.name = req.body.name;
				newInterest.save(function(err) {
					if(err) {
						throw err;
					}
					res.redirect('/membership/interests');
				});
			}
		})
	});
});
// delete admin
router.get('/interests/delete/:id', function(req, res) {
	Interests.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		req.flash('interests', 'Deleted Interest');
		res.redirect('/membership/interests');
	});
});

router.get('/members/types/add', function(req, res) {
	res.render('app/members/types/add',  { message: req.flash('interests')});
});

router.post('/members/types/add', function(req, res) {
	process.nextTick(function() {
		MemberTypes.findOne({'name': req.body.name}, function(err, p) {
			if(err) {
				throw err;
			}
			if(p) {
				req.flash('types', 'Membership Type already exists in the database');
				res.redirect('/membership/members/types/add');
			} else {
				var newType = new MemberTypes();
				newType.name = req.body.name;
				newType.cost = req.body.cost;
				newType.save(function(err) {
					if(err) {
						throw err;
					}
					res.redirect('/membership/members/types');
				});
			}
		})
	});
});
// delete admin
router.get('/members/types/', function(req, res) {
	MemberTypes.find({}, function (err, membertype) {
		res.render('app/members/types/list', {membertype: membertype, message: req.flash('types')});
	});
});

// delete admin
router.get('/members/types/delete/:id', function(req, res) {
	MemberTypes.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		req.flash('interests', 'Deleted Membership Type');
		res.redirect('/membership/members/types');
	});
});




router.get('/members/roles/add', function(req, res) {
	res.render('app/members/roles/add',  { message: req.flash('roles')});
});

router.post('/members/roles/add', function(req, res) {
	process.nextTick(function() {
		MemberRoles.findOne({'name': req.body.name}, function(err, p) {
			if(err) {
				throw err;
			}
			if(p) {
				req.flash('types', 'Membership Role already exists in the database');
				res.redirect('/membership/members/roles/add');
			} else {
				var newType = new MemberRoles();
				newType.name = req.body.name;
				newType.eboard = req.body.eboard;
				newType.voting = req.body.voting;
				newType.save(function(err) {
					if(err) {
						throw err;
					}
					res.redirect('/membership/members/roles');
				});
			}
		})
	});
});
// delete admin
router.get('/members/roles/', function(req, res) {
	MemberRoles.find({}, function (err, membertype) {
		res.render('app/members/roles/list', {membertype: membertype, message: req.flash('roles')});
	});
});

// delete admin
router.get('/members/roles/delete/:id', function(req, res) {
	MemberRoles.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		req.flash('interests', 'Deleted Membership Role');
		res.redirect('/membership/members/roles');
	});
});

router.get('/members/family/add/:id', function(req, res) {
	Members.find({},null, {sort: {last_name:1}}).exec(function (err, data) {
		res.render('app/members/family_list',  {member_id: req.params.id, members: data, message: req.flash('members')});
	});
});

router.post('/members/family/add/:id', function(req, res) {
	Members.findOneAndUpdate({'_id': req.params.id}, {$push: { "family_members": req.body.member_id}}, {upsert: false, strict: false}, function(err, p) {
		res.redirect('/membership/members/details/' + req.params.id);
	});
});
//// member pages
router.get('/members/add', function(req, res) {
	Precinct.find({},null, {sort: {legislative_district: 1}}, function(err, precinct) {
		MemberTypes.find({}, function(err, membertypes) {
			MemberRoles.find({}, function(err, roles) {
				Interests.find({}, function(err, interest) {
					res.render('app/members/add',  { interests: interest, precinct: precinct, roles: roles, types: membertypes, message: req.flash('membership')});

				});
			});
		});
	});
	
});

router.get('/members/delete/:id', function(req, res) {
	Members.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		req.flash('members', 'Deleted Membership');
		res.redirect('/membership/members');
	});
});

router.get('/members/details/:id', function(req, res) {
	
	MemberTypes.find({}, function(err, membertypes) {
		MemberRoles.find({}, function(err, roles) {
			Interests.find({}, function(err, interest) {
				Precinct.find({},null, {sort: {legislative_district: 1}}, function(err, precinct) {
					Members.findOne({'_id': req.params.id}).populate("residential_precinct").populate("service_precinct").populate("family_members").exec(function(err, data) {
						res.render('app/members/edit',  {members: data,interests: interest, precinct: precinct, roles: roles, types: membertypes, message: req.flash('members')});
					});
				});
			});
		});

	});
});

router.post('/members/details/:id', function(req, res) {
	if(req.body.service_precinct == "") {
		delete req.body.service_precinct;
	}
	if(req.body.residential_precinct == "") {
		delete req.body.residential_precinct;
	}
	if(req.body.membership_type == "No Membership Type Selected") {
		delete req.body.membership_type;
	}
	Members.findOneAndUpdate({'_id': req.params.id}, req.body, {upsert: false, strict: false}, function(err, p) {
		if(err) {
			console.log(err);
			throw err;
		}
		req.flash("members", "Updated member record");
		res.redirect('/membership/members/details/' + req.params.id);
	});
});


router.post('/members/bulk', function(req, res) {
	if(!req.files.bulkUpload) {
		req.flash('members', "No files uploaded, please select a file to contine");
		res.redirect('/membership/members/bulk');
	}
	var csv = req.files.bulkUpload;
	var file = osTmpDir() + "/members.csv";
	csv.mv(file);
	CSV.fromPath(file).on("data", function(data) {
		Members.findOne({"first_name": data[1], "last_name": data[2]}, function(err, p) {
			if(err){
				throw err;
			}
			if(!p) {
				var newMember = new Members();
				newMember.first_name = data[1];
				newMember.last_name = data[2];
				newMember.address = data[3];
				newMember.address_2 = data[4];
				newMember.city = data[5]
				newMember.state = data[6];
				newMember.zip = data[7];
				newMember.email = data[11];
				newMember.mobile_phone = data[12];
				newMember.home_phone = data[13];
				newMember.residential_precinct_string = data[8];
				newMember.service_precinct_string = data[16];
				newMember.role_string = data[15];
				newMember.interest_string = data[14]
				newMember.date_paid = data[18];
				newMember.family_members_string = data[19];
				tags = [];
				if(data[20] == "TRUE") {
					tags.push("Have Registration Form");
				}
				if(data[21] == "TRUE") {
					tags.push("Send Membership Link");
				}
				if(data[22] == "TRUE") {
					tags.push("Can Email");
					tags.push("Send Newsletter");
				}
				newMember.tags = tags;
				var membership = "";
				switch(data[17]) {
					case "$20 Individual Membership":
					membership = "Individual";
					break;
					case "$5 Student/Senior/Reduced Income Membership":
					membership = "Student/Senior/Reduced Income";
					break;
					case "$40 Family Membership":
					membership = "Family";
					break;
					case "$0 Covered Family Member":
					membership = "Family Member";
					break;
				}
				if (membership != "") {
					newMember.membership_type_string = membership;
				}

				newMember.save(function(err, d) {
					if (newMember.family_members_string) {
						Members.findOneAndUpdate(
							{"last_name": newMember.family_members_string, "family_members_string": {$ne: newMember.family_members_string}}, 
							{$push: { "family_members": newMember._id}, $set: {family_members_string: null}}, 
							{safe: true, upsert: true},
							function(err, model) {
							}
							);
					}
				});
			}
		});
	}).on("end", function() {
		req.flash('members', 'File upload completed');
		res.redirect('/membership/members');
	});
});


router.get('/members/bulk', function(req, res) {
	res.render('app/members/bulk',  {message: req.flash('members')});
});

router.get('/members', function(req, res) {
	Members.find({},null, {sort: {last_name:1}}).populate("residential_precinct").populate("service_precinct").exec(function (err, data) {
		res.render('app/members/list',  {members: data, message: req.flash('members')});
	});
});
// add member
router.post('/members/add', function(req, res) {
	process.nextTick(function() {
		Members.findOne({'first_name': req.body.first_name, 'last_name': req.body.last_name}, function(err, p) {
			if(err) {
				throw err;
			}
			if(p) {
				req.flash('membership', 'Member already exists in the database');
				res.redirect('/membership/members/add');
			} else {
				var newMember = new Members();
				newMember.first_name = req.body.first_name;
				newMember.last_name = req.body.last_name;
				newMember.address = req.body.address;
				newMember.address_2 = req.body.address_2;
				newMember.state = req.body.state;
				newMember.city = req.body.city;
				newMember.zip = req.body.zip;
				newMember.email = req.body.email;
				newMember.mobile_phone = req.body.mobile_phone;
				newMember.home_phone = req.body.home_phone;
				newMember.residential_precinct = req.body.residential_precinct;
				if(req.body.service_precinct != "") {
					newMember.service_precinct = req.body.service_precinct;
				}
				newMember.membership_type = req.body.membership_type;
				newMember.roles = req.body.roles;
				newMember.interests = req.body.interests;
				newMember.date_paid = req.body.last_paid;
				newMember.tags = req.body.tags;
				newMember.comments = req.body.comments;
				newMember.save(function(err) {
					if(err) {
						throw err;
					}
					// make up to 4 members
					if(req.body.additional_fname_1 != "") {
						Members.findOne({'first_name': req.body.additional_fname_1, 'last_name': req.body.additional_lname_1}, function(err, p) {
							if(p) {
								Members.findOneAndUpdate({'first_name': req.body.first_name, 'last_name': req.body.last_name},{$push: {family_members: p}});
							} else {
								var newMember1 = new Members();
								newMember1.first_name = req.body.additional_fname_1;
								newMember1.last_name = req.body.additional_lname_1;
								newMember1.address = req.body.address;
								newMember1.address_2 = req.body.address_2;
								newMember1.city = req.body.city;
								newMember1.state = req.body.state;
								newMember1.zip = req.body.zip;
								newMember1.email = req.body.additional_email_1;
								newMember1.mobile_phone = req.body.additional_mobile_1;
								newMember1.home_phone = req.body.home_phone;
								newMember1.residential_precinct = req.body.residential_precinct;
								newMember1.membership_type = "58d829948ad5042cb40538c1";
								newMember1.interests = req.body.interests;
								newMember1.tags = req.body.tags;
								newMember1.family_members = newMember._id
								newMember1.save(function(err, d) {
									Members.findOneAndUpdate(
										{'first_name': req.body.first_name, 'last_name': req.body.last_name},
										{$push: {family_members: d._id}}, 
										{safe: true, upsert: true},
										function(err, model) {
										});
								});
							}
						});
					}

					if(req.body.additional_fname_2 != "") {
						Members.findOne({'first_name': req.body.additional_fname_2, 'last_name': req.body.additional_lname_2}, function(err, p) {
							if(p) {
								Members.findOneAndUpdate({'first_name': req.body.first_name, 'last_name': req.body.last_name},{$push: {family_members: p}});
							} else {
								var newMember1 = new Members();
								newMember1.first_name = req.body.additional_fname_2;
								newMember1.last_name = req.body.additional_lname_2;
								newMember1.address = req.body.address;
								newMember1.address_2 = req.body.address_2;
								newMember1.city = req.body.city;
								newMember1.state = req.body.state;
								newMember1.zip = req.body.zip;
								newMember1.email = req.body.additional_email_2;
								newMember1.mobile_phone = req.body.additional_mobile_2;
								newMember1.home_phone = req.body.home_phone;
								newMember1.residential_precinct = req.body.residential_precinct;
								newMember1.membership_type = "58d829948ad5042cb40538c1";
								newMember1.interests = req.body.interests;
								newMember1.tags = req.body.tags;
								newMember1.family_members = newMember._id
								newMember1.save(function(err, d) {
									Members.findOneAndUpdate(
										{'first_name': req.body.first_name, 'last_name': req.body.last_name},
										{$push: {family_members: d._id}}, 
										{safe: true, upsert: true},
										function(err, model) {
										});
								});
							}
						});
					}

					if(req.body.additional_fname_3 != "") {
						Members.findOne({'first_name': req.body.additional_fname_3, 'last_name': req.body.additional_lname_3}, function(err, p) {
							if(p) {
								Members.findOneAndUpdate({'first_name': req.body.first_name, 'last_name': req.body.last_name},{$push: {family_members: p}});
							} else {
								var newMember1 = new Members();
								newMember1.first_name = req.body.additional_fname_3;
								newMember1.last_name = req.body.additional_lname_3;
								newMember1.address = req.body.address;
								newMember1.address_2 = req.body.address_2;
								newMember1.city = req.body.city;
								newMember1.state = req.body.state;
								newMember1.zip = req.body.zip;
								newMember1.email = req.body.additional_email_3;
								newMember1.mobile_phone = req.body.additional_mobile_3;
								newMember1.home_phone = req.body.home_phone;
								newMember1.residential_precinct = req.body.residential_precinct;
								newMember1.membership_type = "58d829948ad5042cb40538c1";
								newMember1.interests = req.body.interests;
								newMember1.tags = req.body.tags;
								newMember1.family_members = newMember._id
								newMember1.save(function(err, d) {
									Members.findOneAndUpdate(
										{'first_name': req.body.first_name, 'last_name': req.body.last_name},
										{$push: {family_members: d._id}}, 
										{safe: true, upsert: true},
										function(err, model) {
										});
								});
							}
						});
					}

					if(req.body.additional_fname_4 != "") {
						Members.findOne({'first_name': req.body.additional_fname_4, 'last_name': req.body.additional_lname_4}, function(err, p) {
							if(p) {
								Members.findOneAndUpdate({'first_name': req.body.first_name, 'last_name': req.body.last_name},{$push: {family_members: p}});
							} else {
								var newMember1 = new Members();
								newMember1.first_name = req.body.additional_fname_4;
								newMember1.last_name = req.body.additional_lname_4;
								newMember1.address = req.body.address;
								newMember1.address_2 = req.body.address_2;
								newMember1.city = req.body.city;
								newMember1.state = req.body.state;
								newMember1.zip = req.body.zip;
								newMember1.email = req.body.additional_email_4;
								newMember1.mobile_phone = req.body.additional_mobile_4;
								newMember1.home_phone = req.body.home_phone;
								newMember1.residential_precinct = req.body.residential_precinct;
								newMember1.membership_type = "58d829948ad5042cb40538c1";
								newMember1.tags = req.body.tags;
								newMember1.interests = req.body.interests;
								newMember1.family_members = newMember._id
								newMember1.save(function(err, d) {
									Members.findOneAndUpdate(
										{'first_name': req.body.first_name, 'last_name': req.body.last_name},
										{$push: {family_members: d._id}}, 
										{safe: true, upsert: true},
										function(err, model) {
										});
								});
							}
						});
					}
				});
res.redirect('/membership/members');
}
});
});
});
module.exports = router;
