const express = require('express');
const router = express.Router();
const userModel = require('./../models/users');
const postModel = require('./../models/post');
const { generateToken, verifyTokenMiddleware } = require('./../middlewares/jwt');


router.get('/', function (req, res) {
    res.render('login');
})

router.post('/', async function (req, res) {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) return res.send('Incorrect username/password.');

        const isPasswordMatch = await user.comparePassword(password);   // job-1: D
        if (isPasswordMatch) {
            const payload = { email: user.username, id: user.id };
            const token = generateToken(payload);                   // job-2
            res.cookie('token', token);
            res.redirect('/');
        } else {
            res.send('Incorrect username/password.');
        }
    } catch (err) {
        res.send('Error foundd : ' + err);
    }

})


module.exports = router;