  import React, { useState } from 'react';
  import './Feed.css';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import Lottie from 'lottie-react';
  import LottieFile from '../components/assets/Animation - 1722030477400.json';
  import video from '../components/assets/gr.mp4';
  import Posting from '../components/Posting/Posting.js';
  import SearchBar from '../components/SearchBars/SearchBar';
  import Notification from '../components/All Notifs/Bell/Notifications.js';
  import PostSearchBar from '../components/SearchBars/PostSearchBar';
  import RideRequestNotificatios from '../components/All Notifs/Ride Requests/RideRequestNotificatios.js';
  import PostNotifications from '../components/All Notifs/PostNotif/PostNotifications.js';
  import { FaPlus } from 'react-icons/fa';
  import logo from '../components/assets/logo.png';

  function Feed() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPostForm, setShowPostForm] = useState(false);

    const takeMeToProfile = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        console.log('token:', token);
        const userId = localStorage.getItem('userId');
        console.log('userId:', userId);
        if (!token || !userId) {
          navigate('/');
          return;
        } else {
          const response = await axios.get(`http://localhost:3000/api/profiles/${userId}`);
          const profileId = response.data.profiles._id;
          localStorage.setItem('profileId', profileId);
          localStorage.setItem('data', JSON.stringify(response.data));
          navigate(`/profile/${userId}`);
          setError('');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    };

    const togglePostForm = () => {
      setShowPostForm(!showPostForm);
    };
    // fc that wuill take to a page where you can look for a carpool
    const carpool=()=>{
      navigate('/carpoolSearch')
    }

    return (
      <> 
    
        <div className="header">
        <img src={logo} alt="logo"  className='logo'/>
        
          <div className="header-icons">
          <Notification className='bell' />
            <Lottie className='profile-icon' animationData={LottieFile}  onClick={takeMeToProfile} />
            <PostNotifications />
          </div>
        
          
        </div>
        
        <div className="feed">
          <video autoPlay muted id="background-video">
            <source src={video} type="video/mp4" />
          </video>

          <div className="sidebar">
            
            <RideRequestNotificatios />
          </div>
          <div className="feed-container">
          <div className="feed-container">
            <SearchBar className="search-bar" />
          </div>
        
      
      </div>

          <div className="main-content">
        
            <button className="add-post-button" onClick={togglePostForm}>
              <FaPlus className="add-post-icon" />
              <span>Offer a Carpool</span>
            </button>
          

            {showPostForm && (
              <div className="post-content">
                <Posting />
                <div className="post-footer">
                  <button className="post-cancel" onClick={togglePostForm}>Cancel</button>
                </div>
              </div>
            )}

            <div className="posts-feed">
            
            
            
            </div>
          </div>
          <button className="add-post-button" onClick={carpool}>
              <FaPlus className="add-post-icon" />
              <span>already have a destination in mind?</span>
              <a>look for a carpool now </a>
            </button>
        </div>
      </>
    );
  }

  export default Feed;
