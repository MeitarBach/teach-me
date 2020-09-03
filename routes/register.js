const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');

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

  try {
    let users = await redisClient.hgetall('users');
    
    if(users === null){
      users = [];
    }
    
    users = Object.values(users);
    console.log(users);
    
    const userExists = users.some((currentUser) => {
      return JSON.parse(currentUser).email.toLowerCase() === user.email.toLowerCase();
    });

    if (userExists) {
      res.status(409).send({message: "This email address already exists"});
    } else {
      // everything works as expected
      console.log('Adding user to redis:');
      console.log(user);
      await redisClient.hmset('users', user.id, JSON.stringify(user));
      res.status(201).send({message: "ok"});
    }

  } catch (err) {
    error.log(err);
    next(err);
  }
});

module.exports = router;