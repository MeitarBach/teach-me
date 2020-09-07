const express = require('express');
const debug = require('debug')('teach-me:users');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
  try {
    let users = await DButils.getSetValues("users");
    debug(users);

    const user = req.session.user;
    
    if (user.isAdmin) {
      debug('All users info is shown to admin...');
      res.render('users', {users: users});
    } else {
      res.redirect('/store');
    }
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

router.get('/activity-log/:id', checkSignIn, async (req, res, next) => {
  const userID = req.params.id;
  const userPurchases = req.session.user.purchaseHistory; ///// Should be user with :id purchase history - My Bad
  try {
    let user = await redisClient.hget('users', userID);
    user = JSON.parse(user);
    
    debug(`User ${userID} info is shown to admin...`);
    let userCart = await redisClient.hget("carts", userID);
    if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

    res.render('activityLog', {user : user, userCart : userCart, userPurchases: userPurchases});

  } catch (err) {
    debug(err.message);
    next(err);
  }

});

module.exports = router;