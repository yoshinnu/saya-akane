var express = require('express');
var router = express.Router();
let db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		db.communities.findAll({}).then((result) => {
			res.render('communities/index', {
				communities: result
			});
		});
	} else {
		res.redirect('/signin');
	}
});

router.get('/new', function(req, res, next) {
	if (req.user) {
		db.users.findAll({}).then((result) => {
			res.render('communities/new', {
				users: result
			});
		});
	} else {
		res.redirect('/signin');
	}
});

router.post('/new', function(req, res, next) {
	if (req.user) {
		db.communities.create({
			community_title: req.body.communityTitle,
			owner: req.body.owner
		}).then((data) => {
			console.log(data.dataValues.id);
			db.communities_users.create({
				community_id: data.dataValues.id,
				user_id: req.user.userId
			}).then(() => {
				res.redirect('/communities');
			});
		});
	} else {
		res.redirect('/signin');
	}
});

module.exports = router;
