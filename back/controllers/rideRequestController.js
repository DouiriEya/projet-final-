const rideRequest = require('../models/rideRequest');
const Post = require('../models/post');
const Profile = require('../models/profil');
const Notification = require('../models/notification') ;

// fc to notify the driver fama chkoun y7b yatla3 m3aah wala the passenger if he s accepted or declined 
const notify = async (userId, message, from, postId,type) => {
    try {
        const notif = new Notification({
            userId,
            message,
            type, 
            postId, 
            seen: false,
            from
        });
        await notif.save();
        console.log('Notification sent:', notif);
        return 'Notification sent';
    } catch (err) {
        console.error('Error sending notification:', err);
        return 'Error sending notification';
    }
};




//fc to send a request 
const sendRequest = async (req, res) => {
    const { passengerId, driverId, postId } = req.body;

    if (!passengerId || !driverId || !postId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const post = await Post.findById(postId);
        const passenger = await Profile.findOne({ userId: passengerId });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        const existingRequest = await rideRequest.findOne({ passengerId, driverId, postId });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent, waiting for response', existingRequest });
        }

        const newRequest = new rideRequest({
            passengerId,
            driverId,
            postId
        });

        await newRequest.save();
        await notify(driverId, `
            ${passenger.username} is interested in this ride from ${post.startlocation} to ${post.destination}`, 
            passengerId, newRequest._id,
           'rideRequest'
        
        );

        return res.status(201).json({ message: 'Request sent and is pending approval or decline', newRequest });
    } catch (err) {
        console.error('Error sending request:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};


// fc to approve a ride request 
const approveRequest = async (req, res) => {
    const { rideRequestId } = req.params;

    try {
        const approvedRequest = await rideRequest.findByIdAndUpdate(
            rideRequestId,
            { status: 'accepted' },
            { new: true }
        );

        if (!approvedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        console.log(`Approved request found: ${approvedRequest}`);

        const post = await Post.findByIdAndUpdate(
            approvedRequest.postId,
            { $inc: { seats: -1 } },
            { new: true }
        );

        console.log(`Post update result: ${post}`);

        if (!post) {
            await rideRequest.findByIdAndUpdate(
                rideRequestId,
                { status: 'pending' },
                { new: true }
            );
            return res.status(404).json({ message: 'Post update failed, request reverted to pending' });
        }

        await notify(
            approvedRequest.passengerId,
            'Your request has been approved. You can now pay the driver.',
            approvedRequest.driverId,
            approvedRequest.postId,
            'other'
        );

        return res.status(200).json({ message: 'Request approved', approvedRequest });
    } catch (err) {
        console.error('Error in approveRequest:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// fc to decline a ride request
const declineRequest = async (req, res) => {
    const { rideRequestId } = req.params;
    
    try {
        const declinedRequest = await rideRequest.findByIdAndUpdate(
            rideRequestId,
            { status: 'declined' },
            { new: true }
        );

        if (!declinedRequest) {
            return res.status(404).json({ message: 'Request not found and not declined' });
        }

        console.log(`Declined request: ${declinedRequest}`);

        const notificationResult = await notify(
            declinedRequest.passengerId,
            'Your request has been declined by the driver',
            declinedRequest.driverId,
            declinedRequest.postId,
            'other'
        );

        console.log('Notification result:', notificationResult);

        return res.status(200).json({ message: 'Request declined successfully', declinedRequest });
    } catch (err) {
        console.error('Error in declineRequest:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 

// fc to check the status of a ride request not by id but by postId and passengerId
const getRequestStatus = async (req, res) => {
    const { postId } = req.params;
    const { passengerId } = req.query; // Get passengerId from query params

    if (!postId || !passengerId) {
        return res.status(400).json({ message: 'Post ID and Passenger ID are required' });
    }

    try {
        const request = await rideRequest.findOne({ postId, passengerId });

        if (request) {
            return res.status(200).json({ status: request.status });
        } else {
            return res.status(200).json({ status: null }); // No request found
        }
    } catch (err) {
        console.error('Error fetching request status:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// fc to check the status of a ride request by the id of the request
const statusRequests = async (req, res) => {
    const { rideRequestId } = req.params;

    try {
        const request = await rideRequest.findById(rideRequestId);
        console.log('request:',request);
        const status = request.status;
        console.log('status:',status);

        if (request) {
            return res.status(200).json({ status: request.status });
        } else {
            return res.status(404).json({ message: 'Request not found' });
        }
    } catch (err) {
        console.error('Error fetching request status:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}


module.exports =
{
    sendRequest,
    approveRequest,
    declineRequest,
    getRequestStatus,
    statusRequests
} 