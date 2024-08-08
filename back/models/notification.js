const mongoose = require('mongoose');
const User = require('./user');
const Profile = require('./profil');
const Post = require('./post');

const notifSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['friendRequest', 'rideRequest', 'rating', 'post', 'declined friend request', 'accepted friend request',
            'other'],
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: function() { return this.type === 'post' || this.type==='rideRequest' ; } // Conditional requirement
    },
    seen: {
        type: Boolean,
        default: false
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notifSchema, 'Notifications');
module.exports = Notification;
