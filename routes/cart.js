const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
    const userID = req.session.user.id;
    console.log(`User ${userID} is accessing his cart:`);

    try {
        let userCart = await redisClient.hget('carts', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        console.log(userCart);

        res.render('cart', {userCart});
    } catch (err) {
        error.log(err.message);
        next(err);
    }
});

router.delete('/:lessonID', checkSignIn, async (req, res, next) => {
    const userID = req.session.user.id;
    const lessonID = req.params.lessonID;
    console.log(`User ${userID} is deleting lesson ${lessonID} from his cart...`);

    try {
        let userCart = await redisClient.hget('carts', userID);
        if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

        console.log('Cart before deleting the lesson:');
        console.log(userCart);

        
        for (let i = 0 ; i < userCart.items.length ; i++) {
            if (userCart.items[i].id === lessonID){
                userCart.totalPrice -= userCart.items[i].price;
                userCart.items.splice(i, 1);
            }
        }

        console.log('Cart after deleting the lesson:');
        console.log(userCart);

        await redisClient.hset('carts', userID, JSON.stringify(userCart));

        console.log('Successfully updated cart on redis!')

        res.status(200).send({message: "The lesson was successfully deleted from your cart!"});
    } catch (err) {
        error.log(err.message);
        next(err);
    }
});

module.exports = router;