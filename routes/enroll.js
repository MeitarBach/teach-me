const express = require('express');
const debug = require('debug')('teach-me:enroll');
const router = express.Router();
const checkSignIn = require('../controllers/session');
const redisClient = require('../redis/redisConnector');
const upload = require('../controllers/multer');
const rateLimit = require('../controllers/protection');

router.use(rateLimit());

/* GET enrollment page. */
router.get('/', checkSignIn, function(req, res) {
  if (req.session.user.isTeacher) {
    res.redirect('/upload');
  } else {
    res.render('enroll', {userID: req.session.user.id});
  }
});

/* PUT user as a teacher */
router.put('/', checkSignIn, upload.single('image'), async (req, res, next) =>{
  const user = req.session.user;
  debug(`User ${user.id} is trying to become a teacher...`);

  try {
    // Check if the user is already a teacher
    if (user.isTeacher){
      debug('This user is already a teacher!');
      return res.status(409).send({message: "You are already a teacher!"});
    }

    // Update user's teacher status
    user.isTeacher = true;
    user.teacherDetails = req.body;

    // Updates user's image - if provided
    if(req.file){
      user.imageURL = `images/users/${req.file.filename}`;
    }

    // Save updated user to redis
    await redisClient.hmset('users', user.id, JSON.stringify(user));
    debug(`Succsessfully updated user as a teacher`);
    debug(user);

    // Send response to client
    res.status(201).send({message: 'Succsessfully updated user as a teacher'});
  
  } catch (err) {
    debug(err.message);
    next(err);
  }
});

module.exports = router;