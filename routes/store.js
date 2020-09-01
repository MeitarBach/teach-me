const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res) => {
  let lessons = await redisClient.lrange("classes", 0, -1);
  lessons = DButils.splitArrayToChunks(lessons, 3);

  console.log(lessons);
  
  res.render('store', {lessons: lessons});
});

module.exports = router;