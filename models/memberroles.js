var mongoose = require('mongoose');

var rolesSchema = mongoose.Schema({
	name: String,
	eboard: String,
	voting: String,
},{
	timestamps: true
});


module.exports = mongoose.model('MembershipRoles', rolesSchema);