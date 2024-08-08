const express = require('express');
const router = express.Router();
const { sendRequest, approveRequest, declineRequest ,getRequestStatus ,statusRequests} = require('../controllers/rideRequestController');

// Route to send a request
router.post('/sendRequest', sendRequest);

// Route to approve a request
router.put('/approveRequest/:rideRequestId', approveRequest);

// Route to decline a request
router.put('/declineRequest/:rideRequestId', declineRequest);
// route to get the status of a request by post id and passenger id
router.get('/status/:postId', getRequestStatus);
// route to grt the status of a request by its id 
router.get('/statusrequest/:rideRequestId', statusRequests);

module.exports = router;
