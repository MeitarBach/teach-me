const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const shortid = require('shortid');

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register', {emailTaken:"MAY"}); //keep? delete?
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

    console.log(userExists);

    if (userExists) {
      res.status(409).send({message: "This email address already exists"});
    } else {
      const reply = await redisClient.lpush('users', JSON.stringify(user));
      console.log("ERROR 2");
      res.redirect('/login');
    }

  } catch (err) {
    res.status(500);
    res.send({message: "Could not create new user"});
  }
});

module.exports = router;