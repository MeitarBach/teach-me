const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const checkSignIn = require('../controllers/session');

/* GET my Purchases page. */
router.get('/', function(req, res) {
  const userPurchases = req.session.user.purchaseHistory;
  
  res.render('purchaseHistory', {userPurchases});
});

module.exports = router;