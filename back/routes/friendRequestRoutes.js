const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  checkFriendRequestStatus,
  getFriendRequests
} = require('../controllers/friendRequestController');

// Send friend request (POST)
router.post('/send', sendInvitation);

// Accept friend request (PUT)
router.put('/accept', acceptInvitation);

// Decline friend request (PUT)
router.put('/decline', declineInvitation);

// Check friend request status (GET)
router.get('/check', checkFriendRequestStatus);

// Get all friend requests of a user (GET)
router.get('/get', getFriendRequests);

module.exports = router;
