var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		res.render("index", {});
	} else {
		res.redirect("/signin");
	}
});

module.exports = router;
