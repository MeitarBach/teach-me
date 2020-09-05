const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
  try {
    // let users = await redisClient.hgetall("users");
    // if(users === null){
    //   users = [];
    // }
    // users = Object.values(users);
    // users = DButils.parseObjectArray(users);
    
    let users = await DButils.getSetValues("users");
    console.log(users);

    const user = req.session.user;
    
    // if (user.isAdmin) {
      res.render('users', {users: users});
    // } else {
    //   res.redirect('/store');
    // }
  } catch (err) {
      next(err);
  }
});

router.get('/activity-log/:id', checkSignIn, async (req, res, next) => {
  const userID = req.params.id;
  try {
    let user = await redisClient.hget('users', userID);
    user = JSON.parse(user);
    
    let userCart = await redisClient.hget("carts", userID);
    if (!userCart){
            userCart = {items:[], totalPrice: 0};
        } else {
            userCart = JSON.parse(userCart);
        }

    res.render('activityLog', {user:user, userCart : userCart});

  } catch (err) {
    next(err);
  }

});

module.exports = router;