var express = require('express');
var router = express.Router();
const redisClient = require('../redis/redisConnector');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
  // redisClient.set('May', 'Meitar');
  redisClient.get('May', (err, res) =>{
    if (err)
      console.log(err);
    console.log(res);
  });
});

router.get('/cool', function(req, res) {
  res.send(`You're so cool`);
});

module.exports = router;