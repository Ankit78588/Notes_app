const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/:id', verifyTokenMiddleware, async function (req, res) {
    try {
        const post = await postModel.findOne({ _id: req.params.id }).populate('user');

        if (post.likes.indexOf(req.userPayload.id) === -1) {   // yadi user ne like nhi kiya hai
            post.likes.push(req.userPayload.id);
        } else {                                               // yadi user like kr chuka hai
            post.likes.splice(post.likes.indexOf(req.userPayload.id), 1);
        }

        await post.save();
        res.redirect('/');
    } catch (err) {
        console.log('Error while liking the post: ' + err);
        res.status(500).send('Server Error');
    }
})


module.exports = router;