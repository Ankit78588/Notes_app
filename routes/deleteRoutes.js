const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/:id',async function(req, res){

    try{
    const post_id = req.params.id;
    const post = await postModel.findOneAndDelete({_id: post_id});
    const post_owner_id = post.user;

    // remove post_id from posts Array
    const post_owner = await userModel.findOne({_id: post_owner_id});
    post_owner.posts.splice( post_owner.posts.indexOf(post_id), 1);
    await post_owner.save();

    res.redirect('/');
    }catch(err){
        console.log('6 - Error Found!');
        res.send(err);
    }
})


module.exports = router;