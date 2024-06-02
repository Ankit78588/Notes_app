const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/', function (req, res) {
    res.cookie('token', '');
    res.redirect('/login');
})


module.exports = router;