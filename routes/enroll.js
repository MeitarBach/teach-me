const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
const upload = require('../controllers/multer');

/* GET enrollment page. */
router.get('/', function(req, res) {
  if (req.session.user.isTeacher) {
    res.render('enroll', {userID: req.session.user.id});
    // res.redirect('/upload');
  } else {
    res.render('enroll', {userID: req.session.user.id});
  }
});

router.post('/', async (req, res, next) =>{
  const user = req.session.user;
  console.log(`User ${user.id} enrolls as a teacher`);

  try {
    // Check if the user is already a teacher
    if (user.isTeacher){
      res.status(409).send({message: "You are already a teacher!"});
    }

    // Update user's teacher status
    user.isTeacher = true;
    await redisClient.hmset('users', user.id, JSON.stringify(user));

    // Add user to the teachers set
    await redisClient.hmset('teachers', user.id, JSON.stringify(req.body));
    console.log(`Succsessfully updated user as a teacher`);
    console.log(req.body);
    res.status(201).send({message: 'ok'});
  } catch (err) {
    error.log(err.message);
    next(err);
  }
  
  
});

router.post('/img', upload.single("file"), async (req, res, next) =>{
  console.log('Posting an image...');
  console.log(req.body);
});

// router.post('/', upload.single("file"), (req, res) => {

// });

module.exports = router;