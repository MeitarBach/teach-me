const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');

/* GET enrollment page. */
router.get('/', function(req, res) {
  res.render('enroll');
});

router.post('/', async (req, res) =>{
  const teacher = req.body;
  try {
    
    console.log(`Teacher details: ${JSON.stringify(teacher)}`);
    let response = await redisClient.lpush('teachers', JSON.stringify(teacher));
  } catch (err) {
    res.status(500)
  }
  
  
});

module.exports = router;