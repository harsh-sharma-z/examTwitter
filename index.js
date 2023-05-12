const express = require('express');
const engine = require('ejs-mate');
require('dotenv').config();
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');
const session = require('express-session');


const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const Tweet = require('./models/Tweet');
const User = require('./models/User');
const { isLoggedIn } = require('./middleware');


mongoose.connect(process.env.dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB is connected');
    })
    .catch((err) => {
        console.log(err);
    })


app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('partials', path.join(__dirname, 'partials'));
app.use(express.urlencoded({ extended: true }));


const session_secret = 'this is a secret session'

const sessionflash = {
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionflash));
app.use(passport.authenticate('session'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;

    next();
})


app.use(authRoutes);
app.use(tweetRoutes);


app.get('/', async (req, res) => {

    const tweets = await Tweet.find().populate('author');

    res.render('home', { tweets });
})

app.get('/:userid', isLoggedIn, async (req, res) => {
    const { userid } = req.params;
    const user = await User.findById(userid).populate('tweets');
    const tweets = user.tweets;
    res.render('profile', { tweets });
})




app.listen(process.env.port, () => {
    console.log(`server is running on port ${process.env.port}`);
})