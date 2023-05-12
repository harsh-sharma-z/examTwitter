const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Tweet = require('../models/Tweet');
const User = require('../models/User');





router.post('/new/:userid', isLoggedIn, async (req, res) => {
    const { message } = req.body;
    const { userid } = req.params;

    const user = await User.findById(userid);

    const tweet = {
        message,
        author: user._id,
        // author: user.username,
        createdAt: Date.now(),
    }

    let newTweet = await Tweet.create(tweet);
    await user.tweets.push(newTweet._id);
    await user.save();

    res.redirect('/');
})


module.exports = router;