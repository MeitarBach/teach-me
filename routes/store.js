const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');
const { NotExtended } = require('http-errors');

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
  try{
    let lessons = await redisClient.lrange("classes", 0, -1);
    lessons = DButils.splitArrayToChunks(lessons, 3);
    res.render('store', {lessons: lessons});
  } catch (err) {
    next(err);
  }
});


/* GET add item to cart */
router.get('/add-to-cart/:id', checkSignIn, async (req, res, next) => {
  const userID = req.session.user.id;
  const lessonID = req.params.id
  console.log(`User: ${userID} is trying to add lesson: ${lessonID} to his cart`);
  
  try{
    // Get user's cart
    let userCart = await redisClient.hget('carts', userID);
    if (!userCart){
      userCart = {items:[], totalPrice: 0};
    } else {
      userCart = JSON.parse(userCart);
    }

    // Check if the item is already in the cart
    const found = userCart.items.some(item => item.id === lessonID);

    // If it is there notify the user
    if (found){
      console.log('This lesson is already in his cart');
      res.status(409).send({message: 'This lesson is already in your cart'});
      return;
    }

    // Find the lesson item
    const lessons = await redisClient.lrange('classes', 0, -1);
    let lesson = lessons.find( lesson => {
      lesson = JSON.parse(lesson);
      return lesson.id === lessonID;
    });
    lesson = JSON.parse(lesson);

    // Push it to the user's cart
    console.log(`Adding lesson: ${lessonID} to the user's cart!`);
    userCart.items.push(lesson);
    userCart.totalPrice += lesson.price;
    await redisClient.HMSET('carts', userID, JSON.stringify(userCart));

    // Success - notify the user
    console.log("Successfully updated user's cart:");
    console.log(userCart);
    res.status(200).send({message: "The lesson was added to your cart!"});

  } catch (err) {
    error.log(err);
    next(err);
  }
  
});

module.exports = router;