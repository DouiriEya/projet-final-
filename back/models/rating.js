const mongoose = require('mongoose');
const profile = require('./profil')
const post = require('./post');
const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min:1,
        max:5,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: post,
        required: true,
    },
    rated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: profile,
        required: true,
    },
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: profile,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Rating = mongoose.model('Rating', ratingSchema , 'ratings');
module.exports = Rating;