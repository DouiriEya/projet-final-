const friendRequest= require('../models/friendRequest') ;
const profile = require('../models/profil') ;
const User = require('../models/user') ; 
const Notification= require('../models/notification') ;
// bch naaml fc to actually send a friend request from x to y 
const sendInvitation = async (req,res)=>{
    const {senderId,receiverId}=req.body ; 
    try {
        const invitationSent = await friendRequest.findOne(
            {senderId, 
             receiverId
            }) ; 
        if (invitationSent) {
         return res.status(400).json({message:'invitation already sent bch  taabaath martin ye5i ?lol 🤭',invitationSent})
        } ;
        const newInvitation = new friendRequest({
                senderId,
                receiverId,
                status:'pending'
        })
        await newInvitation.save();
        //bch ne5dou esm l sender 
      
        const senderProfile = await profile.findOne({userId:senderId}) ;
        //bch nabathou notif lel receiver
        await Notification.create({
            userId:receiverId,
            type:'friendRequest',
            message:`New friend request from ${senderProfile.username}`,
            seen:false,
            from: senderId
        })
        return res.status(201).json({message:'c bon baathna l request 🤝',newInvitation}) ; 
        
    }
    catch(err){
        return res.status(500).json({message:'error sending invitation',err}) ; 
    }
} ;
// yacceptih w ywalliw s7ab 
const acceptInvitation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Find and update the invitation status
    const invitationAccepted = await friendRequest.findOneAndUpdate(
      { senderId, receiverId, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    );

    if (!invitationAccepted) {
      return res.status(400).json({ message: 'Invitation not found or already processed.' });
    }

    // Find profiles
    const senderProfile = await profile.findOne({ userId: senderId });
    const receiverProfile = await profile.findOne({ userId: receiverId });

    if (!senderProfile || !receiverProfile) {
      return res.status(404).json({ message: 'Sender or receiver profile not found.' });
    }

    // Update sender's profile to add receiver to friends list if not already present
    if (!senderProfile.friendsList.some(friend => friend.userId === receiverId)) {
      senderProfile.friendsList.push({ userId: receiverId, username: receiverProfile.username });
      await senderProfile.save();
    }

    // Update receiver's profile to add sender to friends list if not already present
    if (!receiverProfile.friendsList.some(friend => friend.userId === senderId)) {
      receiverProfile.friendsList.push({ userId: senderId, username: senderProfile.username });
      await receiverProfile.save();
    }

    // Create notifications for both users
    const senderNotification = {
      userId: senderId,
      message: `You are now friends with ${receiverProfile.username}`,
      type: 'accepted friend request',
      seen: false,
      from: receiverId
    };

    const receiverNotification = {
      userId: receiverId,
      message: `You are now friends with ${senderProfile.username}`,
      type: 'accepted friend request',
      seen: false,
      from: senderId
    };

    await Notification.create(senderNotification);
    await Notification.create(receiverNotification);

    return res.status(200).json({ message: 'Friend request accepted and profiles updated.', invitationAccepted });

  } catch (err) {
    console.error('Error while accepting invitation:', err);
    return res.status(500).json({ message: 'Server error while accepting invitation.', err });
  }
};

  

   
// fc to decline the invitation 
const declineInvitation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Find and delete the invitation
    const invitationDeclined = await friendRequest.findOneAndDelete({
      senderId,
      receiverId,
      status: 'pending',
    });

    if (!invitationDeclined) {
      return res.status(400).json({ message: 'Invitation not found or already processed.' });
    }

    // Find the profiles for sender and receiver
    const senderProfile = await profile.findOne({ userId: senderId });
    const receiverProfile = await profile.findOne({ userId: receiverId });

    if (!senderProfile || !receiverProfile) {
      return res.status(404).json({ message: 'Sender or receiver profile not found.' });
    }

    // Create notifications for both users
    const senderNotification = {
      userId: senderId,
      message: `Your friend request to ${receiverProfile.username} has been declined.`,
      type: 'declined friend request',
      seen: false,
      from: receiverId
    };

    const receiverNotification = {
      userId: receiverId,
      message: `You have declined the friend request from ${senderProfile.username}.`,
      type: 'declined friend request',
      seen: false,
      from: senderId
    };

    await Notification.create(senderNotification);
    await Notification.create(receiverNotification);

    return res.status(200).json({ message: 'Friend request declined and removed.', invitationDeclined });

  } catch (err) {
    console.error('Error while declining invitation:', err);
    return res.status(500).json({ message: 'Server error while declining invitation.', err });
  }
};

  
// fc to check the request status 
const checkFriendRequestStatus = async (req,res)=>{
    const {senderId,receiverId}=req.query ; 
    try {
        const invitationSent = await friendRequest.findOne(
            {senderId, 
             receiverId
            }) ; 
            console.log('invitationSent:',invitationSent);
        const invitationReceived = await friendRequest.findOne(
            {senderId:receiverId, 
             receiverId:senderId
            }) ;
            console.log('invitationReceived:',invitationReceived);
        const both = invitationSent || invitationReceived ;
        console.log('both:',both);
        if (!both) {
            return res.status(201).json({message:'nothing was sent aslan so no sent ',invitationSent})
            } 
        else if (both){
            const status= both.status
         return res.status(201).json({message:'here is the request status  🤭',status})
        }}
    catch(err){
        return res.status(500).json({message:'error server',err}) ; 
    }
}

//fc to fetch all the friend requests of a user
const getFriendRequests = async (req,res)=>{
    const {userId}=req.query ; 
    try {
        const friendRequests = await friendRequest.find({receiverId:userId}) ;
        if (!friendRequests) {
            return res.status(400).json({message:'no friend requests found',friendRequests})
        } ;
        return res.status(200).json({message:'friend requests found',friendRequests}) ;
    }
    catch(err){
        return res.status(500).json({message:'error server',err}) ; 
    }
}






module.exports= {sendInvitation,
                acceptInvitation,
                declineInvitation,
                checkFriendRequestStatus,
                getFriendRequests
                 
} ;