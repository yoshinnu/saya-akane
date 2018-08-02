var express = require('express');
var router = express.Router();
let db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		db.diaries.findAll({
			where: {
				user_id: req.user.userId
			}
		}).then((result) => {
			res.render('tech_diaries/index', {
				diaries: result
			});
		});
	} else {
		res.redirect("/signin");
	}
});

router.get('/new', function(req, res, next) {
	if (req.user) {
		res.render('tech_diaries/new', {});
	} else {
		res.redirect('/signin');
	}
});

router.post('/new', function(req, res, next) {
	if (req.user) {
		db.diaries.create({
			diary_title: req.body.diaryTitle,
			diary_body: req.body.diaryBody,
			user_id: req.user.userId
		}).then(() => {
			res.redirect('/tech_diaries');
		});
	} else {
		res.redirect('/signin');
	}
});


module.exports = router;
