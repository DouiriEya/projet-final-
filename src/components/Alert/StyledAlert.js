import React, { useEffect, useState } from 'react';
import './StyledAlert.css'; // Import the CSS file for styling

const StyledAlert = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 5000); // The alert will disappear after 5 seconds

        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, [onClose]);

    if (!isVisible || !message) return null; // Only render the alert if it's visible and there's a message

    return (
        <div className="styled-alert">
            <div className="alert-content">
                <span className="alert-message">{message}</span>
                <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>
            </div>
            <div className="progress-bar"></div>
        </div>
    );
};

export default StyledAlert;
