import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, selectFriendRequestStatus } from '../Redux/friendRequestSlice';
import { fetchNotifications } from '../Redux/NotificationSlice';

const SendFriendRequestButton = ({ senderId, receiverId, status, onRequestSent }) => {
  const dispatch = useDispatch();
  const [buttonStatus, setButtonStatus] = useState(status);

  useEffect(() => {
    setButtonStatus(status);
  }, [status]);

  const handleSendRequest = () => {
    dispatch(sendFriendRequest({ senderId, receiverId }))
      .then(() => {
        dispatch(fetchNotifications(receiverId));
        setButtonStatus('pending');
        onRequestSent('pending'); // Update the parent component state
      });
  };

  const handleAccept = () => {
    dispatch(acceptFriendRequest({ senderId, receiverId }));
    setButtonStatus('accepted');
    onRequestSent('accepted'); // Update the parent component state
  };

  const handleDecline = () => {
    dispatch(declineFriendRequest({ senderId, receiverId }));
    setButtonStatus('rejected');
    onRequestSent('rejected'); // Update the parent component state
  };

  const renderButton = () => {
    switch (buttonStatus) {
      case 'pending':
        return <button disabled>Request Sent</button>;
      case 'accepted':
        return <button disabled style={{backgroundColor:'black'}}>Friends✅</button>;
      case 'rejected':
        return <button onClick={handleSendRequest}>Send Friend Request</button>;
      case 'not_sent':
      default:
        return <button onClick={handleSendRequest}>Send Friend Request</button>;
    }
  };

  return (
    <div className="profile-button">
      {renderButton()}
    </div>
  );
};

export default SendFriendRequestButton;
