import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchFilters, searchPosts } from '../../Redux/searchPostsSlice.js';
import PostCard from '../Posting/PostCard.js';
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const PostSearchBar = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [startLocation, setStartLocation] = useState('');
  const [date, setDate] = useState('');
  const [destination, setDestination] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const { searchResults, status, error } = useSelector((state) => state.postSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!startLocation && !date && !destination) {
      return; // Do nothing if all fields are empty
    }

    const filters = {
      startlocation: startLocation,
      date: date,
      destination: destination,
    };
    const cleanedFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
    dispatch(setSearchFilters(cleanedFilters));
    dispatch(searchPosts(cleanedFilters));
  };

  const handleRequestSeat = (post) => {
    console.log('Requesting seat for post:', post);
  };

  const handleClearSearch = () => {
    setStartLocation('');
    setDate('');
    setDestination('');
    setIsExpanded(false);
    dispatch(setSearchFilters({}));
    dispatch(searchPosts({}));
  };
  // take me to feed aka home 
  const handleHome = () => {
    Navigate('/Feed');}

  return (
    <>
      <FaHome onClick={handleHome} style={{fontSize: '30px', color: 'black', cursor: 'pointer' , 
      position: 'absolute', top: '10px', left: '80px'
      }}/>
    <div style={styles.container}>
    
      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="what's your destination? 📍"
            style={styles.searchBar}
            onFocus={() => setIsExpanded(true)}
          />
          {isExpanded && (
            <button type="button" style={styles.clearButton} onClick={handleClearSearch}>
              ✖
            </button>
          )}
          <button type="submit" style={styles.searchButton}>
            🔍
          </button>
        </div>
        {isExpanded && (
          <div style={styles.expandedContainer}>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Start Location 📍"
              style={styles.input}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
              
            />
          </div>
        )}
      </form>
      {status === 'loading' && <p style={styles.loading}>Loading...</p>}
      {status === 'succeeded' && (
        <div style={styles.postList}>
          {searchResults.length > 0 ? (
            searchResults.map((post) => (
              <PostCard key={post._id} post={post} onRequestSeat={handleRequestSeat} />
            ))
          ) : (
            // Don't display anything if all fields are empty and searchResults are empty
            (startLocation || date || destination) && <p style={styles.noResults}>No results found.</p>
          )}
        </div>
      )}
      {status === 'failed' && <p style={styles.error}>Error: {error}</p>}
    </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the search bar
    padding: '0px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid black',
    borderRadius: '50px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  searchBar: {
    flex: 1,
    padding: '10px 15px',
    border: 'none',
    outline: 'none',
    borderRadius: '50px 0 0 50px',
    fontSize: '16px',
  },
  searchButton: {
    padding: '5px 10px',
    border: 'none',
    background: '#007BFF',
    color: 'black',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '0 50px 50px 0',
    transition: 'background 0.3s',
    width: '40px', // Reducing the width of the button
  },
  clearButton: {
    padding: '5px 10px',
    border: 'none',
    background: '#FF0000',
    color: 'white',
    cursor: 'pointer',
    fontSize: '10px',
    transition: 'background 0.3s',
    width: '25px', // Reducing the width of the button
    height:'25px'
  },
  expandedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    padding: '10px 15px',
    border: '2px solid black',
    borderRadius: '4px',
    fontSize: '16px',
  },
  loading: {
    color: '#007BFF',
    fontSize: '16px',
    marginTop: '10px',
  },
  postList: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px',
  },
  noResults: {
    color: '#666',
    fontSize: '16px',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default PostSearchBar;
