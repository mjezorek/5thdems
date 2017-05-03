var autoref = require('mongoose-autorefs');
var mongoose = require('mongoose');
var Interests = require('./interests');
var MemberTypes = require('./membertypes');
var MemberRoles = require('./memberroles');
var Precinct = require('./precinct');
var Meetings = require('./meetings');
var async = require('async');

var memberSchema = mongoose.Schema({
	first_name: {type:String,default:""},
	last_name: {type:String,default:""},
	address: {type:String,default:""},
	address_2: {type:String,default:""},
	city: {type:String,default:""},
	state: {type:String,default:""},
	zip: {type:String,default:""},
	email: {type:String,default:""},
	mobile_phone: {type:String,default:""},
	home_phone: {type:String,default:""},
	residential_precinct: {type: mongoose.Schema.Types.ObjectId, ref: "Precinct"},
	residential_precinct_string: {type:String,default:""},
	service_precinct: {type: mongoose.Schema.Types.ObjectId, ref: "Precinct"},
	service_precinct_string: {type:String,default:""},
	family_members: [{type: mongoose.Schema.Types.ObjectId, ref: "Members"}],
	family_members_string: {type: String, default:""},
	membership_type: {type: mongoose.Schema.Types.ObjectId, ref: "MembershipTypes"},
	membership_type_string: {type:String,default:""},
	roles: [{type: mongoose.Schema.Types.ObjectId, ref: "MembershipRoles"}],
	role_string: {type:String,default:""},
	interests: [{type: mongoose.Schema.Types.ObjectId, ref: "Interests"}],
	attendance: [{type: mongoose.Schema.Types.ObjectId, ref: "Meetings"}],
	interest_string: {type:String,default:""},
	date_paid: Date,
	tags: [String],
	comments: {type: String, default: ""}

},{
	timestamps: true
});

memberSchema.plugin(autoref, [
	'family_members.family_members',
	'attendance.attendance'
]);
// this is all post hooks for bulk upload anyway.
memberSchema.post('save', function(doc) {

	if(doc.residential_precinct_string) {
		Precinct.findOne({"name": doc.residential_precinct_string.toUpperCase()}, function(err, data) {
			if(err) {
				console.log(err);
			} else if(data) {
				doc.residential_precinct = data._id;
				doc.residential_precinct_string = null;
				doc.save();
			}
		});
	}
	if(doc.service_precinct_string) {
		Precinct.findOne({"name": doc.service_precinct_string.toUpperCase()}, function(err, data) {
			if(err) {
				console.log(err);
			} else if(data) {
				doc.service_precinct = data._id;
				doc.service_precinct_string = null;
				doc.save();
			} 
		});
	}
	if(doc.membership_type_string) {
		MemberTypes.findOne({"name": doc.membership_type_string}, function(err, data) {
			if(err) {
				console.log(err);
			} else if(data) {
				doc.membership_type_string = null;
				doc.membership_type = data._id;
				doc.save();
			} 
		});
	}

	if(doc.role_string) {
		var roles = doc.role_string.split(",");
		for( i in roles){
			MemberRoles.findOne({"name": roles[i].trim()}, function(err, mem) {
				if(err) {
					console.log(err);
				}
				if(mem) {

					console.log(mem.name + " " + mem._id);

					doc.roles.addToSet(mem._id);
					roles.shift();
					doc.role_string = roles.toString();
					doc.save();
				}
			});
		}
		doc.role_string = null;
		doc.save();
	}
	if(doc.interest_string) {
		var interests = doc.interest_string.split(",");
		for(i in interests){
			d = null;
			Interests.findOne({"name": interests[i].trim()}, function(err, d) {
				if(err) {
					console.log(err);
				}
				if(d) {
					console.log(d.name + " " + d._id);
					doc.interests.addToSet(d._id);
					doc.save();
				}
			});

		}
		doc.interest_string = null;
		doc.save();
	}

});
module.exports = mongoose.model('Members', memberSchema);