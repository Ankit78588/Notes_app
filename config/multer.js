const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
// console.log('Current working directory of multer.js File :', process.cwd()); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    // cb(null, file.fieldname + '-' + uniqueSuffix);

    crypto.randomBytes(12, function(err, bytes){
      const fn = bytes.toString('hex') + path.extname(file.originalname);
      // console.log(bytes);
      // console.log(bytes.toString('hex'));
      // console.log(fn);
      cb(null, fn);
    });
  }
})
const upload = multer({ storage: storage });




module.exports = upload;