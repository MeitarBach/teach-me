const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});

/* POST a new user. */
router.post('/', async(req, res, next) => {
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
  console.log(`A new user is trying to register...`);

  try {
    let users = await DButils.getSetValues("users");
    
    const userExists = users.some((currentUser) => {
      return currentUser.email.toLowerCase() === user.email.toLowerCase();
    });

    if (userExists) {
      res.status(409).send({message: "This email address already exists"});
      console.log(`Impossible to register with an already exisiting email address...`);

    } else {
      // everything works as expected
      console.log('Adding a new user to redis:');
      console.log(user);
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      res.status(201).send({message: "ok"});
    }

  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

module.exports = router;