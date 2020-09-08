const express = require('express');
const debug = require('debug')('teach-me:login');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET login page. */
router.get('/', function(req, res) {
  debug(`A user is logging in...`);
  res.render('login', {user: req.session.user});
});

/* POST user login */
router.post('/', async (req, res, next) =>{
  try {
    // Authenticate User
    debug(`Searching user's email in the database...`);
    let users = await DButils.getSetValues("users");
    let user = users.find( user => {
      return user.email.toLowerCase() === req.body.email.toLowerCase() &&
              user.password === req.body.password;
    });
    
    //Log user in and update his login activity
    if (user) {
      user.loginActivity.push((new Date()).toUTCString().slice(0, -7));
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      req.session.user = user;

      // Remember user if he checked Remember Me
      if (req.body.remember){
        debug(`User checked remember me button, canceling cookie expiration...`);
        req.session.cookie.expires = false;
      }

      debug(`User has logged in:`);

      res.status(200).send({message: `OK! User  has logged in:`});
    } else {
      res.status(404).send({message: `*The email or password were incorrect!`});
    }
    
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

module.exports = router;