const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET checkout page. */
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

/* POST order details */
router.post('/', checkSignIn, async (req, res, next) =>{
    const user = req.session.user;
    console.log(`User ${user.id} confirmed his purchase...`);

    try {
        // Get user's shopping cart
        let userCart = await redisClient.hget('carts', user.id);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        // Add cart to user's purchase history
        userCart.checkoutDate = new Date().toUTCString().slice(0, -7);
        userCart.orderID = shortid.generate();
        user.purchaseHistory.unshift(userCart);
        await redisClient.hset('users', user.id, JSON.stringify(user));
        console.log(`Added user's cart to his purchase history:`);
        console.log(user.purchaseHistory);


        // Save order with payment details to redis
        const order = {
            userID: user.id,
            cardHolder: req.body.cardHolder,
            cardNumber: req.body.cardNumber,
            expirationDate: req.body.expirationDate,
            cvv: req.body.cvv
        }
        Object.assign(order, userCart);
        await redisClient.hset('orders', order.orderID, JSON.stringify(order));
        console.log(`Sucssessfully saved order to redis:`);
        console.log(order);

        // Move accuired lessons from lessons list to history list
        userCart.items.forEach(lesson => {
            redisClient.hset('lessonsHistory', lesson.id, JSON.stringify(lesson));
            redisClient.hdel('lessons', lesson.id);
        });

        // Empty user's cart
        userCart = {items:[], totalPrice: 0};
        await redisClient.hset('carts', user.id, JSON.stringify(userCart));
        console.log(`Successfully emptied user's cart`);

        // Send response to user
        res.status(200).send({message: 'Succesfully completed your order! Enjoy your lessons!'});
    } catch (err) {
        error.log(err);
        next(err);
    } 
});

module.exports = router;