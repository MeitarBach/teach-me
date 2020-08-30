var express = require('express');
var router = express.Router();

/* GET store page. */
router.get('/', function(req, res) {
  res.render('store');
});

module.exports = router;