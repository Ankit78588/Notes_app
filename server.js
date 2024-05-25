const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userModel = require('./models/users');
const postModel = require('./models/post');
const { generateToken, verifyTokenMiddleware } = require('./config/jwt');
const upload = require('./config/multer');
require('dotenv').config();
const PORT = process.env.PORT || 3009;


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());




app.get('/', verifyTokenMiddleware, async function (req, res) {
    const user = await userModel.findOne({ username: req.userPayload.email }).populate('posts');
    res.render('profile', { user });
})
app.get('/showusers', verifyTokenMiddleware, async function (req, res) {
    const user = await userModel.find({});
    res.send(user);
})
app.post('/createpost', verifyTokenMiddleware, async function (req, res) {
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
app.get('/showallpost', verifyTokenMiddleware, async function (req, res) {
    const post = await postModel.find({});
    res.send(post);
})
app.get('/like/:id', verifyTokenMiddleware, async function (req, res) {
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
app.get('/edit/:id', verifyTokenMiddleware, async function (req, res) {
    const post = await postModel.findOne({ _id: req.params.id });
    res.render('edit', { post });
})
app.post('/updatepost/:id', verifyTokenMiddleware, async function (req, res) {
    const post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect('/');
})
app.get('/delete/:id',async function(req, res){

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


app.get('/uploadDP', verifyTokenMiddleware, async function(req, res){
    res.render('uploadImage');
});
app.post('/uploadDP', verifyTokenMiddleware, upload.single('picture'), async function(req, res){
    const user = await userModel.findOne({_id: req.userPayload.id});
    user.profileimage = req.file.filename;
    await user.save();
    // console.log(req.body);
    // console.log(req.file);

    res.redirect('/');
});


app.get('/signup', function (req, res) {
    res.render('signup');
})
app.post('/signup', async function (req, res) {
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
app.get('/login', function (req, res) {
    res.render('login');
})
app.post('/login', async function (req, res) {
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
app.get('/logout', function (req, res) {
    res.cookie('token', '');
    res.redirect('/login');
})



app.listen(PORT);














