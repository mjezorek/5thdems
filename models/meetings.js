var autoref = require('mongoose-autorefs');
var mongoose = require('mongoose');
var meetingsSchema = mongoose.Schema({
	name: String,
	date: Date,
	location: String,
	list: {type: Boolean, default: true},
	type: { type: String, enum: ["eboard", "general", "committee"], default: 'general'},
	attendance: [{type: mongoose.Schema.Types.ObjectId, ref: "Members"}],
},{
	timestamps: true
});

meetingsSchema.plugin(autoref, [
	'attendance.attendance'
]);
module.exports = mongoose.model('Meetings', meetingsSchema);