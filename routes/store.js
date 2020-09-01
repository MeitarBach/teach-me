var express = require('express');
var router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');

/* GET store page. */
router.get('/', checkSignIn, async (req, res) => {
  let lessons = await redisClient.lrange("classes", 0, -1);
  lessons = splitArrayToChunks(lessons, 3);
  // console.log(lessons);
  
  res.render('store', {lessons: lessons});
});


/* GET add item to cart */
router.get('/add-to-cart/:id', checkSignIn, async (req, res) => {
  const userID = req.session.user.id;
  const lessonID = req.params.id
  console.log(`User: ${userID} adds item: ${lessonID} to his cart`);
  // const test = {
  //   items: [
  //     { instructor: 'Asi Cohen', title: 'piano' },
  //     { instructor: 'Efi Guitara', title: 'guitar' }
  //   ],
  //   totalPrice: 60
  // };

  // await redisClient.HMSET('cards', userID, JSON.stringify(test));
  try{
    let userCart = await redisClient.hget('carts', userID);
    if (!userCart){
      userCart = {items:[], totalPrice: 0};
    } else {
      userCart = JSON.parse(userCart);
    }
    const found = userCart.items.some(item => item.id === lessonID);
    console.log(found);
    if (found){
      console.log('This lesson is already in your cart');
      res.send({message: 'This lesson is already in your cart'})
    }

    const lessons = await redisClient.lrange('classes', 0, -1);
    let lesson = lessons.find( lesson => {
      lesson = JSON.parse(lesson);
      return lesson.id === lessonID;
    });

    lesson = JSON.parse(lesson);

    console.log(`Adding lesson: ${lesson} to the users cart!`);
    userCart.items.push(lesson);
    userCart.totalPrice += lesson.price;
    console.log(userCart);

    await redisClient.HMSET('carts', userID, JSON.stringify(userCart));
    console.log("Successfully updated user's cart");

    res.redirect('/store');
  } catch (err) {

  }
  
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