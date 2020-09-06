const express = require('express');
const debug = require('debug')('teach-me:store');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const DButils = require('../controllers/utilities');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET store page. */
router.get('/', checkSignIn, async (req, res, next) => {
  debug(`User ${req.session.user.id} is accessing the store...`);
  try{
    // Get lessons from redis
    let lessons = await DButils.getSetValues('lessons');

    // Filter results if needed
    const searchFilter = req.query.search;
    if (searchFilter){
      debug(`Filtering results with user's search filter: ${req.query.search}`);
      lessons = lessons.filter((lesson)=>{
      return lesson.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
              lesson.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
              lesson.details.toLowerCase().includes(searchFilter.toLowerCase()) ||
              lesson.instructor.name.toLowerCase().includes(searchFilter.toLowerCase());
      });
    }

    // Render results for user
    lessons = DButils.splitArrayToChunks(lessons, 3);
    res.render('store', {lessons: lessons});
  } catch (err) {
    debug(err);
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
      debug(req.params.lessonID);
      throw new Error(`Lesson ${req.params.lessonID} Doesn't exist!`);
    }
    lesson = JSON.parse(lesson);

    // Get teacher of this lesson from redis
    let teacher = await redisClient.hget('users', lesson.instructor.id);
    teacher = JSON.parse(teacher);


    // Render lesson for user
    res.render('lesson', {lesson: lesson, teacherDetails: teacher.teacherDetails});
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

/* GET add item to cart */
router.get('/add-to-cart/:id', checkSignIn, async (req, res, next) => {
  const userID = req.session.user.id;
  const lessonID = req.params.id
  debug(`User: ${userID} is trying to add lesson: ${lessonID} to his cart`);
  
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
      debug('This lesson is already in his cart');
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
    debug(`Adding lesson: ${lessonID} to the user's cart!`);
    userCart.items.push(lesson);
    userCart.totalPrice += lesson.price;
    await redisClient.HMSET('carts', userID, JSON.stringify(userCart));

    // Success - notify the user
    debug("Successfully updated user's cart:");
    debug(userCart);
    res.status(200).send({message: "The lesson was added to your cart!"});

  } catch (err) {
    debug(err);
    next(err);
  }
  
});

module.exports = router;