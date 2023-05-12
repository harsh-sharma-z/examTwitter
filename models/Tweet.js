const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;