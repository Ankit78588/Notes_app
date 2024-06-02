const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');

router.get('/', function (req, res) {
    res.render('signup');
})
router.post('/', async function (req, res) {
    const { name, username, password, age } = req.body;

    try {
        const user = await userModel.findOne({ username: username });
        if (user) return res.send('User already exists.');

        const createdUser = await userModel.create({
            name: name,
            username: username,
            password: password,
            age: age
        });

        const payload = { email: createdUser.username, id: createdUser.id };
        const token = generateToken(payload);
        res.cookie('token', token);
        res.redirect('/');
    } catch (err) {
        res.send('Error found : ' + err);
    }
})


module.exports = router;