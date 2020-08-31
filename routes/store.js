var express = require('express');
var router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');

/* GET store page. */
router.get('/', checkSignIn, async (req, res) => {
  let lessons = await redisClient.lrange("classes", 0, -1);
  lessons = splitArrayToChunks(lessons, 3);
  console.log(lessons);
  
  res.render('store', {lessons: lessons});
});

function splitArrayToChunks (arr, chunkSize) {
  let resultArr = [];
  let i, arrChunk;
  for (i=0 ; i < arr.length ; i += chunkSize) {
    arrChunk = arr.slice(i, i + chunkSize);
    resultArr.push(parseLessons(arrChunk));
  }

  return resultArr;
}

function parseLessons(arr){
  const resultArr = [];
  arr.forEach(lesson => {
    resultArr.push(JSON.parse(lesson));
  });

  return resultArr;
}

module.exports = router;