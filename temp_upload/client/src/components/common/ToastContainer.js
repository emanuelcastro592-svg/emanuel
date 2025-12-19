import React from 'react';
import Notification from '../Notification';
import './ToastContainer.css';

const ToastContainer = ({ notifications, onRemove }) => {
  return (
    <div className="toast-container">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="toast-item"
          style={{ '--index': index }}
        >
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration || 5000}
            onClose={() => onRemove(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;



