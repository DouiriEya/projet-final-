const express = require('express');
const router = express.Router();
const { createProfile, viewProfile, updateProfile, getFriendsList, searchProfiles } = require('../controllers/profilController');

// Create profile route (POST method) tested w approved 
router.post('/createProfile/:userId', createProfile);

// Update profile route (PUT method) tested w approved
router.put('/updateProfile/:id', updateProfile);

// Search profiles route (GET method)
router.get('/search', searchProfiles);

// View profile route (GET method) tested w approved
router.get('/:id', viewProfile);

// Get friends list (GET method) tested w approved
router.get('/friends/:profilId', getFriendsList);

module.exports = router;
