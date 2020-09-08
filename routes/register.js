const express = require('express');
const debug = require('debug')('teach-me:register');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');
const checkSignIn = require('../controllers/session');


router.use(rateLimit());

/* GET register page. */
router.get('/', checkSignIn, function(req, res) {
  res.render('register');
});

/* POST a new user. */
router.post('/', checkSignIn, async(req, res, next) => {
  const user = {
    id : shortid.generate(),
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
    imageURL : 'images/users/default.jpg',
    isAdmin : false,
    isTeacher : false,
    loginActivity : [],
    purchaseHistory : []
  };
  debug(`A new user is trying to register...`);

  try {
    let users = await DButils.getSetValues("users");
    
    const userExists = users.some((currentUser) => {
      return currentUser.email.toLowerCase() === user.email.toLowerCase();
    });

    if (userExists) {
      debug(`Impossible to register with an already exisiting email address...`);
      return res.status(409).send({message: "This email address already exists"});
    } else {
      // everything works as expected
      debug('Adding a new user to redis:');
      debug(user);
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      res.status(201).send({message: "The user has registered successfully"});
    }

  } catch (err) {
    debug(err.message);
    next(err);
  }
});

module.exports = router;