var express = require('express');
var router = express.Router();
const checkSignIn = require('../controllers/session');

/* GET store page. */
router.get('/', checkSignIn, function(req, res) {
  res.render('store');
});

module.exports = router;