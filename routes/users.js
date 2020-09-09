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
  debug(`Trying to access users' activity...`)
  try {
    let users = await DButils.getSetValues("users");

    const user = req.session.user;
    
    if (user.isAdmin) {
      debug('All users info is shown to admin...');
      debug(users);
      if (req.headers.test){
        return res.status(200).send({users});
      }

      res.render('users', {users: users});
    } else {
      debug(`Not an Admin. Access denied!`);
      if (req.headers.test){
        return res.status(403).send({users: `Not an Admin. Access denied!`});
      }
      res.redirect('/store');
    }
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

router.get('/activity-log/:id', checkSignIn, async (req, res, next) => {
  const userID = req.params.id;
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

    res.render('activityLog', {user : user, userCart : userCart});

  } catch (err) {
    debug(err.message);
    next(err);
  }

});

module.exports = router;