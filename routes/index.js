var express = require('express');
var router = express.Router();

var Student = require('../models/student');
var User = require('../models/user');
var Sanction = require('../models/Sanction');
var Statistic = require('../models/Statistical');
var Report = require('../models/report');
var Archived = require('../models/archived');


/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.post('/signin', async( req, res ) => {
	const { username, password } = req.body;

	User.find({ username: username, password: password }, (err, doc) => {
		if( err ) return res.sendStatus( 503 );

		return res.end();
	});
});


router.get('/student-data', async( req, res ) => {
	Student.find({}, (err, doc) => {
		if( err ) return res.sendStatus( 503 );

		return res.json( doc );
	});
});


module.exports = router;
