const express = require('express');
const debug = require('debug')('teach-me:upload');
const router = express.Router();
const shortid = require('shortid');
const redisClient = require('../redis/redisConnector');
const rateLimit = require('../controllers/protection');
const checkSignIn = require('../controllers/session');

router.use(rateLimit());

/* GET upload class page. */
router.get('/', checkSignIn, function(req, res) {
  const teacher = req.session.user;

  // Redirect user if he's not a teacher yet
  if (!teacher.isTeacher){
    return res.redirect('/enroll');
  }

  res.render('upload');
});

router.post('/', checkSignIn, async(req, res, next) => {
  const teacher = req.session.user;
  debug(`User ${teacher.id} is adding a new class...`);

  // Redirect user if he's not a teacher yet
  if (!teacher.isTeacher){
    debug(`The user isn't a teacher...`)
    return res.send({message: `You must become a teacher before you upload a class!!`});
  }

  // Create Class
  let startTime = new Date(req.body.startTime);
  startTime.setHours(startTime.getHours() + 3);
  startTime = startTime.toUTCString().slice(0, -7);
  const instructor = {
    name: `${teacher.firstName} ${teacher.lastName}`,
    imageURL: teacher.imageURL,
    id: teacher.id
  }

  const newClass = {
    id : shortid.generate(),
    instructor: instructor,
    title : req.body.title,
    subject : req.body.subject,
    details : req.body.details,
    startTime : startTime,
    endTime : req.body.endTime,
    price : parseInt(req.body.price)
  };

  try {
    // Save class to redis
    await redisClient.hset('lessons', newClass.id, JSON.stringify(newClass));

    debug('The class was uploaded successfully:')
    debug(newClass);
    res.status(201).send({message: "The class was uploaded successfully!", lessonID: newClass.id});
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

module.exports = router;