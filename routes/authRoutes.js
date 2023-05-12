const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
router.get('/register', (req, res) => {
    res.render('register');
})


router.post('/register', async (req, res) => {
    const { username, img, password } = req.body;
    const user = new User({ username, img });

    const newUser = await User.register(user, password);

    res.redirect('/login');
})

router.get('/login', (req, res) => {
    res.render('login');
})


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Login error,please try again!'
}), (req, res) => {
    res.redirect('/');
})


router.get('/logout', (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    }
    )
})



module.exports = router;