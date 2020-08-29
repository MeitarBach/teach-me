const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register');
});

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
      res.send({status: 200, data: 'ok'});
    }

  } catch (err) {
    res.status(500);
    res.send({message: "Could not create new user"});
  }
});

module.exports = router;