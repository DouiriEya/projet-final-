import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiThreeFriends } from "react-icons/gi";
import { IoIosArrowDropdownCircle, IoMdHome } from "react-icons/io";
import { FaHome } from "react-icons/fa";

import UserPosts from '../components/UserPosts';
import Modal from 'react-modal'; // Import react-modal
import './Profile.css';
import Complaint from '../components/Complaint/Complaint';

Modal.setAppElement('#root'); // Set the app root element for accessibility

function Profile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const profileId = localStorage.getItem('profileId');
  const navigate = useNavigate();

  const [updatedProfile, setUpdatedProfile] = useState({
    username: '',
    age: '',
    bio: '',
    profilePic: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        setError('You need to be logged in to view this page');
        navigate('/');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/profiles/${userId}`);
        setProfile(response.data.profiles);
        setUpdatedProfile({
          username: response.data.profiles.username,
          age: response.data.profiles.age,
          bio: response.data.profiles.bio,
          profilePic: response.data.profiles.profilePic
        });
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching the profile');
        console.error(err);
      }
    };
    fetchProfile();
  }, [profileId, navigate]);

  const getFriendsList = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profiles/friends/${profile._id}`);
      const friends = response.data.friendsList;
      setFriendsList(friends);
      setShowFriends(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFriendClick = async (friendId) => {
    const response = await axios.get(`http://localhost:3000/api/profiles/${friendId}`);
    const friend = response.data.profiles;
    setFriendsList([]);
    setShowFriends(false);
    navigate('/searchprofile', { state: { profile: friend } });
  };

  if (!profile) {
    return <p>No profile data available</p>;
  }

  const logOut = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const openDeleteModal = () => {
    setModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setModalIsOpen(false);
  };

  const deleteProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`http://localhost:3000/api/users/delete/${userId}`);
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value
    });
  };

  const updateProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/profiles/updateProfile/${profileId}`, updatedProfile);
      setProfile(response.data.updatedProfile);
      setEditMode(false);
      navigate(`/profile/${profileId}`);
    } catch (err) {
      setError('An error occurred while updating the profile');
      console.error(err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const UserProfile = () => {
    const userId = localStorage.getItem('userId');
    return (
      <div>
        <UserPosts userId={userId} />
      </div>
    );
  };
  const handleHome = () => {
    navigate('/Feed');}

  return (
    <>
 <FaHome onClick={handleHome} style={{fontSize: '30px', color: 'black', cursor: 'pointer' , 
      position: 'absolute', top: '10px', left: '80px'
      }}/>      
      
      
      <div className="profile-container">
        
      <Complaint 
      />
        
          <div className="gear-icon" onClick={toggleDropdown}>
            <IoIosArrowDropdownCircle className="icon" />
            <div className={`dropdown-options ${isDropdownOpen ? 'open' : ''}`}>
              <button className="dropdown-button" onClick={logOut}>Log Out</button>
              <button className="dropdown-button" onClick={openDeleteModal}>Delete Profile</button>
              <button className="dropdown-button" onClick={() => setEditMode(!editMode)}>Update Profile</button>
            
          </div>
        </div>
        <div className="profile">
          <div className="profile-header">
            <h2>Profile Details</h2>
          </div>
          <div className="profile-info">
            {editMode ? (
              <div>
                <input
                  type="text"
                  name="username"
                  value={updatedProfile.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="profile-input"
                />
                <input
                  type="number"
                  name="age"
                  value={updatedProfile.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  className="profile-input"
                />
                <input
                  type="text"
                  name="bio"
                  value={updatedProfile.bio}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  className="profile-input"
                />
                <input
                  type="text"
                  name="profilePic"
                  value={updatedProfile.profilePic}
                  onChange={handleInputChange}
                  placeholder="Profile Picture"
                  className="profile-input"
                />
                <button onClick={updateProfile}>Save</button>
              </div>
            ) : (
              profile && (
                <div>
                  <img src={profile.profilePic || 'default-pic-url.jpg'} alt="Profile" className="profile-pic" />
                  <div className="profile-details">
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                  </div>
                  <div className="star-rating">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                  </div>
                </div>
              )
            )}
            <GiThreeFriends className="friends-icon" onClick={getFriendsList} />
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
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
      <UserProfile />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete your profile?</p>
        <div className="modal-buttons">
          <button onClick={deleteProfile}>Delete</button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>
     
    </>
  );
}

export default Profile;
