const express = require('express');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
  try{
    // Get lessons from redis
    let lessons = await DButils.getSetValues('lessons');

    // Filter results if needed
    const searchFilter = req.query.search;
    console.log(`Search Filter:${req.query.search}`);
    console.log(req.url);
    if (searchFilter){
      lessons = lessons.filter((lesson)=>{
        const check = lesson.title.includes(searchFilter) ||
                lesson.subject.includes(searchFilter) ||
                lesson.details.includes(searchFilter) ||
                lesson.instructor.name.includes(searchFilter);
        console.log(check);
        return lesson.title.includes(searchFilter) ||
                lesson.subject.includes(searchFilter) ||
                lesson.details.includes(searchFilter) ||
                lesson.instructor.name.includes(searchFilter);
      })
    }

    console.log(lessons);

    lessons = DButils.splitArrayToChunks(lessons, 3);
    res.render('store', {lessons: lessons});
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/lesson/:lessonID', checkSignIn, async (req, res, next)=>{
  try{
    // Get lesson from redis
    let lesson = await redisClient.hget('lessons', req.params.lessonID);
    if(!lesson){
      lesson = await redisClient.hget('lessonsHistory', req.params.lessonID);
    }
    if(!lesson){
      console.log(req.params.lessonID);
      throw new Error(`Lesson ${req.params.lessonID} Doesn't exist!`);
    }
    lesson = JSON.parse(lesson);

    // Get teacher of this lesson from redis
    let teacher = await redisClient.hget('users', lesson.instructor.id);
    teacher = JSON.parse(teacher);


    // Render lesson for user
    res.render('lesson', {lesson: lesson, teacherDetails: teacher.teacherDetails});
  } catch (err) {
    console.log(err.message);
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
    // const lessons = await redisClient.lrange('classes', 0, -1);
    const lessons = await DButils.getSetValues('lessons');
    let lesson = lessons.find( lesson => {
      // lesson = JSON.parse(lesson);
      return lesson.id === lessonID;
    });
    // lesson = JSON.parse(lesson);

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
    console.log(err);
    next(err);
  }
  
});

module.exports = router;