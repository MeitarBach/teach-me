const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET login page. */
router.get('/', function(req, res) {
  console.log(`A user is logging in...`);
  res.render('login', {user: req.session.user});
});

router.post('/', async (req, res, next) =>{
  try {
    // Authenticate User
    let users = await DButils.getSetValues("users");

    console.log(`Searching user's email in the database...`);
    let user = users.find( user => {
      return user.email.toLowerCase() === req.body.email.toLowerCase() &&
              user.password === req.body.password;
    });
    
    //Log user in and update his login activity
    if (user) {
      user.loginActivity.push((new Date()).toUTCString().slice(0, -7));
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      req.session.user = user;

      console.log(`User ${user.id} has logged in:`);

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