var mongoose = require('mongoose');

var precinctSchema = mongoose.Schema({
	code: String,
	name: String,
	congressional_district: Number,
	legislative_district: Number,
	kingcounty_district: Number
},{
	timestamps: true
});


module.exports = mongoose.model('Precinct', precinctSchema);