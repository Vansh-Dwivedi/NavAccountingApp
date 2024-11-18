import React from 'react';
import './components.css';

const NotificationBubble = ({ count }) => {
  return count > 0 ? (
    <div className="notification-bubble">{count}</div>
  ) : null;
};

export default NotificationBubble;