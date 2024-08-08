import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostCard.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';


const PostCard = ({ post }) => {
  const [requestStatus, setRequestStatus] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const navigate = useNavigate();
  const passengerId = localStorage.getItem('userId');
  const isOwner = passengerId === post.userId;

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/rideRequests/status/${post._id}`, {
          params: { passengerId },
        });
        console.log('response:', response);
        console.log('Request status:', response.data.status);
        if (response.data.status) {
          setRequestStatus(response.data.status);
          if (response.data.status === 'pending') {
            setIsRequestSent(true);
          }
        }
      } catch (error) {
        console.error('Error fetching request status:', error);
      }
    };

    fetchRequestStatus();
  }, [post._id, passengerId]);

  const handleRequestSeat = async () => {
    if (isRequestSent || post.seats === 0 || isOwner) {
      return; // Prevent sending request if conditions are not met
    }

    try {
      await axios.post('http://localhost:3000/api/rideRequests/sendRequest', {
        passengerId,
        driverId: post.userId,
        postId: post._id
      });
      alert('Seat request sent!');
      setIsRequestSent(true);
      setRequestStatus('pending');
    } catch (error) {
      console.error('Error sending seat request:', error);
      alert('Failed to send seat request.');
    }
  };

  const handleOwnerClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profiles/${post.userId}`);
      if (post.userId === passengerId) {
        navigate(`/profile/${passengerId}`);
      } else {
        const profile = response.data.profiles;
        navigate('/searchprofile', { state: { profile } });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  let buttonContent = '';
  if (isOwner) {
    buttonContent = 'You are the owner';
  } else if (isRequestSent || requestStatus === 'pending') {
    buttonContent = 'Seat Request Sent!';
  } else if (requestStatus === 'accepted') {
    buttonContent = 'You are welcome to join, congrats!';
  } else if (post.seats === 0) {
    buttonContent = 'All seats are taken, oops!';
  } else if (post.seats === 1) {
    buttonContent = 'Only one seat left, hurry up!';
  } else {
    buttonContent = 'Ask for a Seat now?';
  }

  const isButtonDisabled = isRequestSent || post.seats === 0 || isOwner || requestStatus === 'accepted';

  return (
    
    <div className="post-card">
      <div className="post-header">
        <div className="owner-info" onClick={handleOwnerClick}>
          <FaUser className="owner-icon" />
          <span className="owner-name">{post.signature}</span>
        </div>  
        <p className="post-date"><FaCalendarAlt /> {new Date(post.date).toLocaleDateString()}</p>
      </div>
      <div className="post-body">
        <div className="post-info">
          <h2><FaCar /> Vehicle: {post.vehicule}</h2>
          <p><FaMapMarkerAlt /> <strong>Start Location:</strong> {post.startlocation}</p>
          <p><FaMapMarkerAlt /> <strong>Destination:</strong> {post.destination}</p>
          <p><FaClock /> <strong>Time:</strong> {post.time}</p>
          <p className="post-date"><FaCalendarAlt />  <strong>Date : </strong>   {new Date(post.date).toLocaleDateString()}</p>
          <p><FaDollarSign /> <strong>Price per Seat:</strong> {post.pricePerSeat} dt</p>
          <p><MdPayment /> <strong>Payment Method:</strong> {post.paymentMethod}</p>
          <p><FaCar /> <strong>Seats Available:</strong> {post.seats}</p>
          <p><FaCalendarAlt /> <strong>Created At:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
          <p><strong onClick={handleOwnerClick}>created by :</strong >{post.signature} </p>
        </div>
      </div>
      <button
        onClick={handleRequestSeat}
        disabled={isButtonDisabled}
        className={`request-seat-button ${isButtonDisabled ? 'disabled' : ''}`}
      >
        {buttonContent}
      </button>
    
    </div>
  );
};

export default PostCard;
