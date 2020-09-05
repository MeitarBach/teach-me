const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET login page. */
router.get('/', function(req, res) {
  res.render('login', {user: req.session.user});
});

router.post('/', async (req, res, next) =>{
  try {
    // Authenticate User
    // let users = await redisClient.hgetall('users');
    // users = Object.values(users);

    let users = await DButils.getSetValues("users");

    let user = users.find( user => {
      // user = JSON.parse(user);
      return user.email.toLowerCase() === req.body.email.toLowerCase() &&
              user.password === req.body.password;
    });
    
    if (user){ // User exists
      // user = JSON.parse(user);
      user.loginActivity.push((new Date()).toUTCString().slice(0, -7));
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      req.session.user = user;

      console.log(`User ${user.id} Logged in:`);
      console.log(user);

      res.status(200).send({message: "ok"});
    } else {
      res.status(404).send({message: `The email or password were incorrect`});
    }
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

module.exports = router;