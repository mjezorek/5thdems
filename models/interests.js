var mongoose = require('mongoose');

var interestsSchema = mongoose.Schema({
	name: String,
},{
	timestamps: true
});


module.exports = mongoose.model('Interests', interestsSchema);