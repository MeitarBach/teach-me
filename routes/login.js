const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');


/* GET login page. */
router.get('/', function(req, res) {
  res.render('login', {user: req.session.user});
});

router.post('/', async (req, res, next) =>{
  console.log(req.body.email);

  try {
    // Authenticate User
    const users = await redisClient.lrange('users', 0, -1);
    let user = users.find( user => {
      user = JSON.parse(user);
      return user.email.toLowerCase() === req.body.email.toLowerCase() &&
              user.password === req.body.password;
    });
    
    if (user){ // User exists
      user = JSON.parse(user);
      req.session.user = user;

      console.log(`Found user:`);
      console.log(user);

      res.status(200).send({message: "ok"});
    } else {
      res.status(404).send({message: `The email or password were incorrect`});
    }
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;