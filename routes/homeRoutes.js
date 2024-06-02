const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/', verifyTokenMiddleware, async function (req, res) {
    const user = await userModel.findOne({ username: req.userPayload.email }).populate('posts');
    res.render('profile', { user });
})


module.exports = router;




