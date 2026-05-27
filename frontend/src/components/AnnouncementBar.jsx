import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="container">
        <h2 style={{ color: 'white' }}>Free Shipping over ₹1,999</h2>
      </div>
    </div>
  );
};

export default AnnouncementBar;
