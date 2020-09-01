const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res) => {
  let users = await redisClient.lrange("users", 0, -1);
  users = DButils.parseObjectArray(users);

  const user = req.session.user;
  
  // if (user.isAdmin) {
    console.log(users.length);
    res.render('users', {users: users});
  // } else {
  //   res.redirect('/store');
  // }
});

module.exports = router;