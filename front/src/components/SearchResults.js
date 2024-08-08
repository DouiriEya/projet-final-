// 
// SearchResults.js
import React from 'react';
import { useSelector } from 'react-redux';

const SearchResults = () => {
  const { searchType, searchResults, status, error } = useSelector((state) => state.search);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {searchType === 'profiles' && searchResults.profiles.map((profile) => (
        <div key={profile._id}>
          <h3>{profile.username}</h3>
          <p>{profile.bio}</p>
        </div>
      ))}
      {searchType === 'posts' && searchResults.posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
