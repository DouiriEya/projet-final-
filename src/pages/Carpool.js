import React from 'react';
import PostSearchBar from '../components/SearchBars/PostSearchBar';
import './Carpool.css';

function Carpool() {
  return (
    <div className='all'>
      <div className='post-container'>
        <PostSearchBar />
        {/* Add your posts here */}
      </div>
    </div>
  );
}

export default Carpool;
