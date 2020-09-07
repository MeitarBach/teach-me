const express = require('express');
const debug = require('debug')('teach-me:cart');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
    const userID = req.session.user.id;
    debug(`User ${userID} is accessing his cart:`);

    try {
        let userCart = await redisClient.hget('carts', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        // Remove unavailable lessons from cart
        let removed = false;
        for (let i = 0 ; i < userCart.items.length ; i++){
            if (!await redisClient.hexists('lessons', userCart.items[i].id)){
                debug(`Lesson ${userCart.items[i].id} isn't available, removing it from user's cart...`)
                removed = true;
                userCart.totalPrice -= userCart.items[i].price;
                userCart.items.splice(i ,1);
            }
        }

        debug(userCart);

        // Render with appropriate message if a lesson was removed
        if (removed){
            await redisClient.hset('carts', userID, JSON.stringify(userCart));
            return res.render('cart', {message: "One or more lessons on your cart are no longer available.\nWe automatically removed them for you...", userCart});
        }

        res.render('cart', {userCart});
    } catch (err) {
        debug(err.message);
        next(err);
    }
});

/* DELETE item from shopping cart */
router.delete('/:lessonID', checkSignIn, async (req, res, next) => {
    const userID = req.session.user.id;
    const lessonID = req.params.lessonID;
    debug(`User ${userID} is deleting lesson ${lessonID} from his cart...`);

    try {
        // Bring user's cart from redis
        let userCart = await redisClient.hget('carts', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        debug('Cart before deleting the lesson:');
        debug(userCart);

        // Delete the lesson from user's cart
        for (let i = 0 ; i < userCart.items.length ; i++) {
            if (userCart.items[i].id === lessonID){
                userCart.totalPrice -= userCart.items[i].price;
                userCart.items.splice(i, 1);
            }
        }

        debug('Cart after deleting the lesson:');
        debug(userCart);

        // Store updated cart on redis
        await redisClient.hset('carts', userID, JSON.stringify(userCart));
        debug('Successfully updated cart on redis!')

        // Send resopnse to user
        res.status(200).send({message: "The lesson was successfully deleted from your cart!"});
    } catch (err) {
        debug(err.message);
        next(err);
    }
});

module.exports = router;