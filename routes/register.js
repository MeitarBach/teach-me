const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});

/* POST a new user. */
router.post('/', async(req, res) => {
  const user = {
    id : shortid.generate(),
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
    isAdmin : false,
    isTeacher : false
  };

  try {
    const users = await redisClient.lrange('users', 0, -1);
    const userExists = users.some((currentUser) => {
      return JSON.parse(currentUser).email === user.email;
    });

    if (userExists) {
      res.status(409).send({message: "This email address already exists"});
    } else {
      // everything works as expected
      console.log('Adding user to redis:');
      console.log(user);
      await redisClient.lpush('users', JSON.stringify(user));
      res.status(201).send({message: "ok"});
    }

  } catch (err) {
    res.status(500).send({message: "Could not create new user"});;
  }
});

module.exports = router;