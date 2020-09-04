const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
    const userID = req.session.user.id;
    console.log(`User ${userID} is in checkout...`);

    try {
        let userCart = await redisClient.hget('carts', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        console.log(userCart);

        res.render('checkout', {totalPrice: userCart.totalPrice});
    } catch (err) {
        error.log(err.message);
        next(err);
    }
});

module.exports = router;