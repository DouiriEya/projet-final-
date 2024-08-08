import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GiThreeFriends } from "react-icons/gi";
import { FaCheck, FaStar } from "react-icons/fa";
import SendFriendRequestButton from '../../SendFriendRequestButton';
import UserPosts from '../../UserPosts'; // Ensure this path is correct
import './ProfileSearch.css';

const ProfileSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const senderId = localStorage.getItem('userId');
  const { profile } = location.state || {};
  const [status, setStatus] = useState('not_sent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const fetchFriendRequestStatus = async () => {
      if (profile) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('http://localhost:3000/api/friendRequests/check', {
            params: { senderId, receiverId: profile.userId },
          });
          const { status } = response.data;
          setStatus(status || 'not_sent');
        } catch (err) {
          console.error(err);
          setError('Failed to fetch friend request status.');
          setStatus('not_sent');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriendRequestStatus();
  }, [profile, senderId]);

  const getFriendsList = async () => {
    if (!showFriends) {
      try {
        const response = await axios.get(`http://localhost:3000/api/profiles/friends/${profile._id}`);
        const friends = response.data.friendsList;
        setFriendsList(friends);
        setShowFriends(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowFriends(false);
    }
  };

  const handleRequestSent = (newStatus) => {
    setStatus(newStatus);
  };

  const handleFriendClick = async (friendId) => {
    if (friendId === senderId) {
      navigate(`/profile/${senderId}`);
    } else {
      try {
        const response = await axios.get(`http://localhost:3000/api/profiles/${friendId}`);
        const friend = response.data.profiles;
        setFriendsList([]);
        setShowFriends(false);
        navigate('/searchprofile', { state: { profile: friend } });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!profile) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="profile-search-container">
      <div className="profile-info">
        <img src={profile.profilePic || 'default-pic-url.jpg'} alt="Profile" className="profile-pic" />
        <h2>{profile.username}</h2>
        <div className="profile-details">
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Age:</strong> {profile.age}</p>
        </div>

        <div className="rating-section">
          <p><strong>Rating :</strong></p>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => (
              <FaStar key={index} className={index < profile.rating ? 'star-filled' : ''} />
            ))}
          </div>
          <button className="rate-profile-button">Rate this user</button>
        </div>

        <SendFriendRequestButton
          senderId={senderId}
          receiverId={profile.userId}
          status={status}
          onRequestSent={handleRequestSent}
          className="send-friend-request-button"
          disabled={status === 'sent' || status === 'friends'}
        />
        {status === 'friends' && <FaCheck className="friends-status-icon" />}
        
       <p> <strong>Friends List:</strong>    <GiThreeFriends className="friends-icon" onClick={getFriendsList} />
       </p> 

        {showFriends && (
          <div className="friends-list">
            <h3>Friends List</h3>
            <ul>
              {friendsList.map(friend => (
                <li key={friend.userId} onClick={() => handleFriendClick(friend.userId)}>
                  {friend.username}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="user-posts-section">
        <UserPosts userId={profile.userId} />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfileSearch;
