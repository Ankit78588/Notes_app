const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');
const upload = require('./../middlewares/multer');   // fix it

router.get('/', verifyTokenMiddleware, async function(req, res){
    res.render('uploadImage');
});
router.post('/', verifyTokenMiddleware, upload.single('picture'), async function(req, res){
    const user = await userModel.findOne({_id: req.userPayload.id});
    user.profileimage = req.file.filename;
    await user.save();
    // console.log(req.body);
    // console.log(req.file);

    res.redirect('/');
});


module.exports = router;