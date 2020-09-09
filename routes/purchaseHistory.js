const express = require('express');
const debug = require('debug')('teach-me:purchaseHistory');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET my Purchases page. */
router.get('/', checkSignIn, function(req, res, next) {
  debug(`User ${req.session.user.id} is accessing his purchase history...`)
  const userPurchases = req.session.user.purchaseHistory;
  debug(userPurchases);
  
  if(req.headers.test){
    return res.status(200).send({userPurchases});
  }
  res.render('purchaseHistory', {userPurchases});
});

module.exports = router;