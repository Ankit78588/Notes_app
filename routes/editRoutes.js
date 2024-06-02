const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/:id', verifyTokenMiddleware, async function (req, res) {
    const post = await postModel.findOne({ _id: req.params.id });
    res.render('edit', { post });
})


module.exports = router;