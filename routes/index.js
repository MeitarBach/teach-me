var express = require('express');
var router = express.Router();
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET home page. */
router.get('/', function(req, res) {
  const userID = req.session.user.id;
  if (req.session.user){
    res.redirect('store');  //If session exists, go to Store page
    console.log(`User ${userID} is already logged-in so is redirceted to store from homepage...`);
 } else {
    res.render('index');
    console.log(`User ${userID} is visiting the homepage...`);
 }
});

router.get('/logout', function(req, res) {
  const userID = req.session.user.id;
  if (req.session.user) {
    req.session.destroy();
    console.log(`User ${userID} has logged out successfully...`);
  }
  res.redirect('/');
});

module.exports = router;