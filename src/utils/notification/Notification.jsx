import React, { useState, useEffect } from 'react';
import './notification.css';

const Notification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); 

    return () => clearTimeout(timeout);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
