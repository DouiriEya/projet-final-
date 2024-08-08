import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';
import rideRequestAnimation from '../../assets/carpoolRequests.json'; // Import Lottie animation JSON
import { BiFontFamily } from 'react-icons/bi';

function RideRequestNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false); // State to toggle visibility
    const [unseenCount, setUnseenCount] = useState(0); // State for unseen notifications
    const [isTooltipVisible, setIsTooltipVisible] = useState(false); // State for tooltip visibility
    const [disabledRequests, setDisabledRequests] = useState(new Set()); // Track disabled requests

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Retrieve disabled requests from local storage
        const storedDisabledRequests = JSON.parse(localStorage.getItem('disabledRequests')) || {};
        setDisabledRequests(new Set(Object.keys(storedDisabledRequests)));
        getRideRequests();
    }, []);

    useEffect(() => {
        // Store disabled requests to local storage
        localStorage.setItem('disabledRequests', JSON.stringify(Array.from(disabledRequests)));
    }, [disabledRequests]);

    // Fetch ride requests for the user
    const getRideRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/notification/getnotifs', {
                params: { userId }
            });
            const rideRequests = response.data.notif.filter(n => n.type === 'rideRequest');
            setNotifications(rideRequests);
            console.log('Ride requests:', rideRequests);
            setUnseenCount(rideRequests.filter(n => !n.seen).length); // Count unseen notifications

            // Fetch status for each ride request
            const statusRequests = rideRequests.map(async (request) => {
                const statusResponse = await axios.get(`http://localhost:3000/api/rideRequests/statusrequest/${request.postId}`);
                const status = statusResponse.data.status;
                return { ...request, status };
            });

            const requestsWithStatus = await Promise.all(statusRequests);
            setNotifications(requestsWithStatus);

        } catch (error) {
            console.error('Error getting ride requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle accepting a ride request
    const handleAccept = async (rideRequestId) => {
        setLoading(true);
        setDisabledRequests(prev => new Set(prev).add(rideRequestId)); // Disable buttons for this request
        try {
            const url = `http://localhost:3000/api/rideRequests/approveRequest/${rideRequestId}`;
            const rep = await axios.put(url);
            setNotifications(prevNotifications => prevNotifications.filter(n => n.postId !== rideRequestId));
            setUnseenCount(prevCount => prevCount - 1);
            console.log('Request accepted', rep);
        } catch (error) {
            console.error('Error accepting request:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle declining a ride request
    const handleDecline = async (rideRequestId) => {
        setLoading(true);
        setDisabledRequests(prev => new Set(prev).add(rideRequestId)); // Disable buttons for this request
        try {
            const url = `http://localhost:3000/api/rideRequests/declineRequest/${rideRequestId}`;
            await axios.put(url);
            setNotifications(prevNotifications => prevNotifications.filter(n => n.postId !== rideRequestId));
            setUnseenCount(prevCount => prevCount - 1);
            console.log('Request declined');
        } catch (error) {
            console.error('Error declining request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIconClick = () => {
        if (!showNotifications) {
            getRideRequests(); // Fetch notifications
        }
        setShowNotifications(prev => !prev); // Toggle notification visibility
    };

    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    return (
        <div style={styles.container}>
            <div
                style={{ ...styles.tooltip, display: isTooltipVisible ? 'block' : 'none' }}
            >
                Carpool requests 🤑
            </div>
            <div
                style={styles.iconContainer}
                onClick={handleIconClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Lottie animationData={rideRequestAnimation} style={styles.icon} />
                {unseenCount > 0 && (
                    <div style={styles.counter}>{unseenCount}</div>
                )}
            </div>
            {loading && <p>Loading...</p>}
            {showNotifications && (
                <div style={styles.notificationsContainer}>
                    {notifications.map(notification => (
                        <div key={notification._id} style={styles.notificationItem}>
                            <p>{notification.message}</p>
                            <button
                                style={styles.acceptbutton}
                                onClick={() => handleAccept(notification.postId)}
                                disabled={disabledRequests.has(notification.postId) || notification.status === 'accepted' || notification.status === 'declined'}
                            >
                                Accept
                            </button>
                            <button
                                style={styles.declinebutton}
                                onClick={() => handleDecline(notification.postId)}
                                disabled={disabledRequests.has(notification.postId) || notification.status === 'accepted' || notification.status === 'declined'}
                            >
                                Decline
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Inline styles for the component
const styles = {
  
        container: {
            position: 'fixed',
            bottom: '716px',
            right: '320px',  // Adjust this value to position next to PostNotifications
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    
    tooltip: {
        backgroundColor: 'black',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '4px',
        position: 'absolute',
        left: '-100px',
        bottom: '-40%',
        whiteSpace: 'nowrap',
        zIndex: 1001,
    },
    iconContainer: {
        position: 'relative',
        cursor: 'pointer',
    },
    icon: {
        width: '70px',
        height: '70px',
    },
    counter: {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        backgroundColor: '#ff0000',
        color: '#fff',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
    },
    notificationsContainer: {
        position: 'absolute',
        top: '50px', /* Adjust based on the icon position */
        right: '0',
        backgroundColor: 'white',
        border: '1px solid black',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: '1000',
    },
    notificationItem: {
        marginBottom: '10px',
        color: 'black',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0'
    },
    acceptbutton: {
        backgroundColor: 'green',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    declinebutton: {
        backgroundColor: 'red',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default RideRequestNotifications;
