const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/', verifyTokenMiddleware, async function (req, res) {
    const user = await userModel.find({});
    res.send(user);
})


module.exports = router;