// src/components/SubmitComplaint.js
import React, { useState } from 'react';
import './SubmitComplaint.css'; // Import the CSS file

const SubmitComplaint = () => {
  const [complaint, setComplaint] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the complaint submission logic here
    alert('Complaint submitted: ' + complaint);
  };

  return (
    <div className="submit-complaint-container">
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Enter your complaint here..."
          rows="6"
        />
        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
