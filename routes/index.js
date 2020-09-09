var express = require('express');
const debug = require('debug')('teach-me:index');
var router = express.Router();
const rateLimit = require('../controllers/protection');
const checkSignIn = require('../controllers/session');


router.use(rateLimit());

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.user){
    res.redirect('store');  //If session exists, go to Store page
    debug(`User ${req.session.user.id} is already logged-in so is redirceted to store from homepage...`);
 } else {
    res.render('index');
    debug(`A new user is visiting the homepage...`);
 }
});

//Log user out of the store
router.get('/logout', checkSignIn, function(req, res) {
  const userID = req.session.user.id;
  if (req.session.user) {
    req.session.destroy();
    debug(`User ${userID} has logged out successfully...`);
  }
  
  if (req.headers.test){
    return res.status(200).send({message : `User ${userID} has logged out successfully`});
  }
  
  res.redirect('/');

});

module.exports = router;