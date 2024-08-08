// ProfileIcon.js
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './ProfileIcon.css'; // Import the CSS file

const ProfileIcon = ({ onClick }) => {
  return <FaUserCircle className="profile-icon" onClick={onClick} />;
};

export default ProfileIcon;
