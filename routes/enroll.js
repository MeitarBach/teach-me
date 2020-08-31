const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisConnector');
// const upload = require('../controllers/multer');

/* GET enrollment page. */
router.get('/', function(req, res) {
  if (req.session.user.isTeacher) {
    res.redirect('/upload');
  } else {
  res.render('enroll');
  }
});

router.post('/', async (req, res) =>{
  const teacher = req.body;
  try {
    console.log(`Teacher details: ${JSON.stringify(teacher)}`);
    let postResponse = await redisClient.lpush('teachers', JSON.stringify(teacher));
    console.log(postResponse);
    
    let getResponse = await redisClient.lrange('teachers', 0, -1);

    console.log(getResponse);

  } catch (err) {
    console.log(err.message);
    res.status(500).send({message: "Couldn't save teacher to redis"});
  }
  
  
});

// router.post('/', upload.single("file"), (req, res) => {

// });

module.exports = router;