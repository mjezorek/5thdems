var mongoose = require('mongoose');

var typeSchema = mongoose.Schema({
	name: String,
	cost: String
},{
	timestamps: true
});


module.exports = mongoose.model('MembershipTypes', typeSchema);