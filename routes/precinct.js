var express = require('express');
var router = express.Router();
var osTmpDir = require('os-tmpdir');
var CSV = require('fast-csv');
var Precinct = require('../models/precinct');

// precinct list
router.get('/', function(req, res) {
	Precinct.find({}, function (err, precincts) {
		res.render('app/precinct/list', {precincts: precincts, message: req.flash('precinct')});
	});
});

router.get('/add', function(req, res) {
	res.render('app/precinct/add',  {message: req.flash('precinct')});
});

router.post('/add', function(req, res) {
	process.nextTick(function() {
		Precinct.findOne({'name': req.body.precinct_name}, function(err, p) {
			if(err) {
				throw err;
			}
			if(p) {
				req.flash('precinct', 'Precinct already exists in the database');
				res.redirect('/membership/precinct/add');
			} else {
				var newPrecinct = new Precinct();
				newPrecinct.code = req.body.precinct_code;
				newPrecinct.name = req.body.precinct_name;
				newPrecinct.congressional_district = req.body.cong;
				newPrecinct.legislative_district = req.body.leg;
				newPrecinct.kingcounty_district = req.body.kc;
				newPrecinct.save(function(err) {
					if(err) {
						throw err;
					}
					res.redirect('/membership/precinct');
				});
			}
		})
	});
});

router.get('/bulk', function(req, res) {
	res.render('app/precinct/bulk',  {message: req.flash('precinct')});
});

router.post('/bulk', function(req, res) {
	if(!req.files.bulkUpload) {
		req.flash('precinct', "No files uploaded, please select a file to contine");
		res.redirect('/membership/precinct/bulk');
	}
	var csv = req.files.bulkUpload;
	var file = osTmpDir() + "/precinct.csv";
	csv.mv(file);
	CSV.fromPath(file).on("data", function(data) {
		Precinct.findOne({'name': data[1]}, function(err, p) {
			if(err) {
				throw err;
			}
			if(!p) {
				var newPrecinct = new Precinct();
				newPrecinct.code = data[0];
				newPrecinct.name = data[1];
				newPrecinct.congressional_district = data[2];
				newPrecinct.legislative_district = data[3];
				newPrecinct.kingcounty_district = data[4];
				newPrecinct.save(function(err) {});
			}
		});
	}).on("end", function() {
		req.flash('precinct', 'File upload completed');
		res.redirect('/membership/precinct');
	})
	//res.render('app/precinct/bulk',  {message: req.flash('precinct')});
});

// delete precinct
router.get('/delete/:id', function(req, res) {
	Precinct.findOneAndRemove({'_id': req.params.id}, function(err, offer) {
		res.redirect('/membership/precinct');
	});
});

module.exports = router;