// Notifications.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, selectNotifications } from '../../../Redux/NotificationSlice.js';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { acceptFriendRequest, declineFriendRequest } from '../../../Redux/friendRequestSlice';
import './Notifications.css';

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [processing, setProcessing] = useState(null);

  const fetchUserNotifications = () => {
    const userId = localStorage.getItem('userId');
    dispatch(fetchNotifications(userId));
  };

  const handleBellClick = () => {
    if (!showNotifications) {
      fetchUserNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const handleAccept = (senderId) => {
    const receiverId = localStorage.getItem('userId');
    setProcessing(senderId);

    dispatch(acceptFriendRequest({ senderId, receiverId }))
      .then(() => {
        fetchUserNotifications();
      })
      .finally(() => {
        setProcessing(null);
      });
  };

  const handleDecline = (senderId) => {
    const receiverId = localStorage.getItem('userId');
    setProcessing(senderId);

    dispatch(declineFriendRequest({ senderId, receiverId }))
      .then(() => {
        fetchUserNotifications();
      })
      .finally(() => {
        setProcessing(null);
      });
  };

  const filteredNotifications = notifications.filter(notif => 
    notif.type === 'friendRequest' || notif.type === 'other' || notif.type === 'accepted friend request' || notif.type === 'declined friend request'
  );

  return (
    <div className="notification-wrapper">
      <button onClick={handleBellClick} className="notification-bell">
        <IoMdNotificationsOutline className="notification-icon" size={27} />
        {filteredNotifications.some(notif => !notif.seen) && (
          <span className="notification-counter">
            {filteredNotifications.filter(notif => !notif.seen).length}
          </span>
        )}
        <div className="tooltip">New friend requests and carpool replies</div>
      </button>
      {showNotifications && (
        <div className="notification-dropdown">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div key={notif._id} className="notification-item">
                <p>{notif.message}</p>
                {notif.type === 'friendRequest' && (
                  <div className="friend-request-actions">
                    <button 
                      onClick={() => handleAccept(notif.from)}
                      disabled={processing === notif.from}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDecline(notif.from)}
                      disabled={processing === notif.from}
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
