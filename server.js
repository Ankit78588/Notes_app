const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userModel = require('./models/users');
const postModel = require('./models/post');
require('dotenv').config();
const PORT = process.env.PORT || 3009;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const db = require('./config/db_connection');
const homeRoutes = require('./routes/homeRoutes');

const createpostRoutes = require('./routes/createpostRoutes');
const editRoutes = require('./routes/editRoutes');
const likeRoutes = require('./routes/likeRoutes');
const deleteRoutes = require('./routes/deleteRoutes');
const showallpostRoutes = require('./routes/showallpostRoutes');
const showusersRoutes = require('./routes/showusersRoutes');
const updatepostRoutes = require('./routes/updatepostRoutes');
const uploadDPRoutes = require('./routes/uploadDPRoutes');

const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');


app.use('/', homeRoutes);
app.use('/showusers', showusersRoutes);
app.use('/createpost', createpostRoutes);
app.use('/showallpost', showallpostRoutes);
app.use('/like', likeRoutes);
app.use('/edit', editRoutes);
app.use('/updatepost', updatepostRoutes);
app.use('/delete', deleteRoutes);
app.use('/uploadDP', uploadDPRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);



app.listen(PORT);