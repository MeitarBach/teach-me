var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.user){
    res.redirect('store');  //If session exists, go to Store page
 } else {
    res.render('index');
 }
});

router.get('/logout', function(req, res) {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect('/');
});

module.exports = router;