var express = require('express');
var router = express.Router();
let db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
    db.users.findAll({
      where: {
        id: req.user.userId
      }
    }).then((result) => {
      console.log(result)
      res.render('auth/mypage', {
        userName: result[0].dataValues.user_name,
        email: result[0].dataValues.email
      });
    });
	} else {
		res.redirect('/signin');
	}
});

module.exports = router;
