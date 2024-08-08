// src/components/Complaint.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { FaExclamationCircle } from 'react-icons/fa'; // Import an icon for the complaint
import './Complaint.css'; // Import the component's stylesheet

const Complaint = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/submit-complaint'); // Navigate to the complaint page
  };

  return (
    <div className="complaint-container" onClick={handleClick}>
      <FaExclamationCircle className="complaint-icon" />
      <span className="tooltip-text">Submit a complaint</span>
    </div>
  );
};

export default Complaint;
