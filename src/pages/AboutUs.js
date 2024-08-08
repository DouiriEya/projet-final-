import React from 'react';
import './AboutUs.css';
import video from '../components/assets/aboutUs.mp4'; // Update with the relative path

const AboutUs = () => {
  return (
    <div className="video-background">
      <video
        src={video}
        className="background-video"
        autoPlay
        muted={false} // Ensures sound is not muted
        controls={false} // Hides controls
        loop={false} // Ensures the video does not loop
        playsInline
      >
        Your browser does not support the video tag.
      </video>
      {/* Other content can be placed here */}
    </div>
  );
};

export default AboutUs;
