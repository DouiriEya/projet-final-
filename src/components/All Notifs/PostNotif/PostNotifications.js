
// t9ollkk anehom l posts mte3 s7abk ejdod 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../../Posting/PostCard'; // Import PostCard component
import Lottie from 'lottie-react';
import notificationAnimation from '../../assets/posts.json';
import './PostNotifications.css';

function PostNotifications() {
    const userId = localStorage.getItem('userId');
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [unseenCount, setUnseenCount] = useState(0);

    useEffect(() => {
        // Fetch notifications on component mount
        getPostNotifications();
    }, []);

    const getPostNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/notification/getnotifs', {
                params: { userId }
            });
            console.log('response:', response);

            const postNotifications = response.data.notif.filter(notification => notification.type === 'post');
            console.log('Post notifications:', postNotifications);

            setPosts(postNotifications);
            setUnseenCount(postNotifications.filter(notification => !notification.seen).length);
        } catch (error) {
            console.error('Error getting post notifications:', error);
        }
    };

    const fetchPostDetails = async (postId) => {
        try {
            const response = await axios.get('http://localhost:3000/api/posts/posts', {
                params: { postId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching post details:', error);
            return null;
        }
    };

    const handleNotificationClick = async (postId) => {
        const postDetails = await fetchPostDetails(postId);
        if (postDetails) {
            setSelectedPost(postDetails);
            setNotificationsVisible(false); // Hide notifications when a post is selected
            // Optionally, mark the notification as seen here
            setUnseenCount(prevCount => prevCount - 1);
        }
    };

    const handleIconClick = () => {
        if (selectedPost) {
            setSelectedPost(null); // Hide the post if one is already selected
        } else {
            setNotificationsVisible(!notificationsVisible);
            if (!notificationsVisible) {
                getPostNotifications();
            }
        }
    };

    return (
        <div className="post-notification-wrapper">
            <div className="notification-icons">
                <div className="lottie-icon-container">
                    <div className="lottie-icon" onClick={handleIconClick}>
                        <Lottie animationData={notificationAnimation} style={{ height: 80, width: 80 }} />
                        {unseenCount > 0 && <span className="notification-counter">{unseenCount}</span>}
                    </div>
                    <div className="tooltip">New post notifications</div>
                </div>
            </div>
            {notificationsVisible && !selectedPost && (
                <div className="notifications">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="notification-item">
                                <p>{post.message}</p>
                                <button onClick={() => handleNotificationClick(post.postId)}>View Post</button>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available. Click the icon to load notifications.</p>
                    )}
                </div>
            )}
            {selectedPost && (
                <PostCard post={selectedPost} />
            )}
        </div>
    );
}

export default PostNotifications;