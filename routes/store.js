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
    // Get lessons from redis - Sorted by startTime
    let lessons = await DButils.getSetValues('lessons');
    lessons = lessons.sort((lessonA, lessonB) => {
      return (new Date(lessonA.startTime) - new Date(lessonB.startTime));
    });

    if (req.headers.test){
      debug(lessons);
      return res.status(200).send({lessons});
    }

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
    debug(err.message);
    next(err);
  }
});

/* GET lesson details page */
router.get('/lesson/:lessonID', checkSignIn, async (req, res, next)=>{
  try{

    debug(`User ${req.session.user.id} is trying to view lesson ${req.params.lessonID} informaion...`);
    // Get lesson from redis
    let lesson = await redisClient.hget('lessons', req.params.lessonID);
    if(!lesson){
      lesson = await redisClient.hget('lessonsHistory', req.params.lessonID);
    }

    if(!lesson){
      debug(`Lesson ${req.params.lessonID} Doesn't exist!`);
      throw new Error(`Lesson ${req.params.lessonID} Doesn't exist!`);
    }

    lesson = JSON.parse(lesson);

    if (req.headers.test) {
      debug(lesson);
      return res.status(200).send({lesson});
    }

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
    let lesson = await redisClient.hget('lessons', lessonID);
    lesson = JSON.parse(lesson);

    // Push it to the user's cart
    userCart.items.push(lesson);
    userCart.totalPrice += lesson.price;
    await redisClient.HMSET('carts', userID, JSON.stringify(userCart));

    // Success - notify the user
    debug("Successfully updated user's cart:");
    debug(userCart);
    res.status(200).send({message: `The lesson '${lesson.title}' was added to your cart!`});

  } catch (err) {
    debug(err.message);
    next(err);
  } 
});

module.exports = router;