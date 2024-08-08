import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const owner = localStorage.getItem('userId');
    if (profile.userId === owner) {
      navigate(`/profile/${profile.userId}`);
      return;
    } else {
      await axios.get(`http://localhost:3000/api/profiles/${profile.userId}`);
      // Navigate to ProfileSearch and pass profile data as state
      navigate('/searchprofile', { state: { profile } });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
    >
      <img
        src={profile.profilePic || 'default-pic-url.jpg'}
        alt={profile.username}
        style={styles.image}
      />
      <h3>{profile.username}</h3>
      <p>{profile.bio}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
};

export default ProfileCard;
