const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/', verifyTokenMiddleware, async function (req, res) {
    const post = await postModel.find({});
    res.send(post);
})


module.exports = router;