var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema = mongoose.Schema({
	email: String,
	firstName: String,
	lastName: String,
	password: String
},{
	timestamps: true
});

adminSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);