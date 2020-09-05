const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const checkSignIn = require('../controllers/session');

/* GET my Purchases page. */
router.get('/', function(req, res) {
  res.render('purchaseHistory');
});

router.get('/activity-log/:id', checkSignIn, async (req, res, next) => {
  const userID = req.session.user.id;
    try {
        let userPurchases = await redisClient.hget('purchases', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        console.log(userCart);

        res.render('cart', {userPurchases});
    } catch (err) {
        error.log(err.message);
        next(err);
    }

});

module.exports = router;