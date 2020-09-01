const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const redisClient = require('../redis/redisConnector');

/* GET upload class page. */
router.get('/', function(req, res) {
  const teacher = req.session.user;

  // if (!teacher.isTeacher){  //// UNCOMMENT
  //   res.redirect('/enroll');
  // }

  res.render('upload');
});

router.post('/', async(req, res) => {
  const teacher = req.session.user;
  teacher.isTeacher = true; // For coding - remove later

  if (!teacher.isTeacher){
    res.redirect('/enroll');
  }

  const startTime = new Date(req.body.time).toUTCString().slice(0, -7);

  const newClass = {
    id : shortid.generate(),
    instructor: `${teacher.firstName} ${teacher.lastName}`,
    title : req.body.title,
    subject : req.body.subject,
    details : req.body.details,
    startTime : startTime,
    endTime : req.body.endTime,
    price : req.body.price
  };

  console.log(`Creating Class on DB:`);
  console.log(newClass);

  try {
    await redisClient.lpush('classes', JSON.stringify(newClass));
    res.status(201).send({message: "ok"});
  } catch (err) {
    res.status(500).send({message: "Could not create class"});;
  }

});

module.exports = router;