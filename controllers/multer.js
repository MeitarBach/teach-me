const multer = require('multer');
 
const storage = multer.diskStorage({
    destination: '/public/images/users',
    filename: 'YO'
});
   
const upload = multer({ storage: storage });
 
module.exports = upload;