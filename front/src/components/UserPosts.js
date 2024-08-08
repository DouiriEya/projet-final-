import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/Posting/PostCard';
import './UserPosts.css'; // Import the CSS file for styling

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/viewPost/${userId}`);
        setPosts(response.data.posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="user-posts">
      <h3>User Posts</h3>
      <div className="posts-feed">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
