const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const redisClient = require('../redis/redisConnector');

/* GET upload class page. */
router.get('/', function(req, res) {
  const teacher = req.session.user;

  if (!teacher.isTeacher){
    res.redirect('/enroll');
  }

  res.render('upload');
});

router.post('/', async(req, res, next) => {
  const teacher = req.session.user;
  console.log(teacher);

  if (!teacher.isTeacher){
    res.redirect('/enroll');
  }

  const startTime = new Date(req.body.time).toUTCString().slice(0, -7);
  const instructor = {
    name: `${teacher.firstName} ${teacher.lastName}`,
    imageURL: teacher.imageURL
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

  console.log(`Creating Class on DB:`);
  console.log(newClass);

  try {
    await redisClient.lpush('classes', JSON.stringify(newClass));
    res.status(201).send({message: "ok"});
  } catch (err) {
    next(err);
  }

});

module.exports = router;