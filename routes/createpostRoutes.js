const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.post('/', verifyTokenMiddleware, async function (req, res) {
    // find the user - creating post
    const user = await userModel.findOne({ username: req.userPayload.email });

    // create post
    const newPost = await postModel.create({
        user: user._id,
        content: req.body.content
    });

    // update user with new_post id
    user.posts.push(newPost._id);
    await user.save();

    res.redirect('/');
})


module.exports = router;