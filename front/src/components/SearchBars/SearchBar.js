// src/components/SearchBar.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch, setSearchQuery, clearSearchResults } from '../../Redux/searchSlice';
import ProfileCard from '../SearchBarResults/ProfileBar/ProfileCard';
import { FaSearch, FaUserFriends, FaTimes } from 'react-icons/fa'; // Import search and carpooling icons

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, status, error } = useSelector((state) => state.search);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      dispatch(performSearch(searchQuery));
    }
  };

  const handleChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClear = () => {
    dispatch(setSearchQuery('')); // Clear the search query
    dispatch(clearSearchResults()); // Clear the search results
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: '0', // Move the search bar closer to the top
    }}>
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px',
          border: '1px solid black',
          borderRadius: '30px',
          overflow: 'hidden',
          marginTop: '-130px', // Add margin to separate search bar from content
          position: 'relative', // Required for positioning clear button
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search for profiles..."
          style={{
            width: '100%',
            padding: '8px 12px', // Adjust padding to make input smaller
            border: 'none',
            outline: 'none',
            color: 'black',
          }}
        />
        {searchQuery && ( // Show the clear button only if there is a query
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'red',
              cursor: 'pointer',
              position: 'absolute',
              left: '85px',
              top: '10px',
              fontSize: '16px', // Adjust size as needed
            }}
          >
            <FaTimes />
          </button>
        )}
        <button
          type="submit"
          style={{
            background: 'black', // Change button background color to black
            border: 'none',
            padding: '8px 12px', // Smaller button size
            color: 'white', // Change button text color to white
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaSearch />
        </button>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <div style={{
          marginTop: '10px',
          background: 'white',
          borderRadius: '8px',
          maxHeight: '400px',
          overflowY: '50px',
          width: '100%',
          maxWidth: '600px',
          padding: '10px', // Added padding for inner spacing
        }}>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {searchResults.map((profile) => (
              <li key={profile.userId} style={{
                position: 'relative',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '8px',
                background: '#f5f5f5', // Light background color
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reduced shadow for a subtle effect
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer', // Change cursor on hover
                transition: 'transform 0.2s', // Smooth transform
                color: 'black', // Ensure the text color is black
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              >
                <ProfileCard profile={profile} />
                <FaUserFriends style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: '#007bff',
                }} /> {/* Friends icon in top-right corner */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
