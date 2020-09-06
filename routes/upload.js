const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const redisClient = require('../redis/redisConnector');

/* GET upload class page. */
router.get('/', function(req, res) {
  const teacher = req.session.user;

  // Redirect user if he's not a teacher yet
  if (!teacher.isTeacher){
    return res.redirect('/enroll');
  }

  res.render('upload');
});

router.post('/', async(req, res, next) => {
  const teacher = req.session.user;
  console.log(`User ${teacher.id} is adding a new class...`);

  // Redirect user if he's not a teacher yet
  if (!teacher.isTeacher){
    return res.redirect('/enroll');
  }


  // Create Class
  const startTime = new Date(req.body.time).toUTCString().slice(0, -7);
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

    console.log('The class was uploaded successfully:')
    console.log(newClass);
    res.status(201).send({message: "ok"});
  } catch (err) {
    console.log(err.message);
    next(err);
  }

});

module.exports = router;