var express = require('express');
var router = express.Router();

/* GET enrollment page. */
router.get('/', function(req, res) {
  res.render('enroll');
});

module.exports = router;