import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FaBell } from 'react-icons/fa';
import io from "socket.io-client";
import "./components.css";
import NotificationBubble from "./NotificationBubble";

const Header = () => {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchProfilePic();

      const socket = io(process.env.REACT_APP_API_URL);

      socket.on("connect", () => {
        console.log("Header connected to Socket.IO");
        socket.emit("join", user._id);
      });

      socket.on("newNotification", (notification) => {
        console.log("New notification received:", notification);
        fetchNotifications(); // Re-fetch all notifications
      });

      return () => socket.close();
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/notifications");
      console.log("Fetched notifications:", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfilePic = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notification) => {
    if (notification.formData) {
      // Open the form modal
      openFormModal(notification.formData.formId);
    }
    // Mark notification as read
    markNotificationAsRead(notification._id);
  };

  const openFormModal = (formId) => {
    // Fetch the form data and open the modal
    api.get(`/api/forms/${formId}`)
      .then(response => {
        setSelectedForm(response.data);
      })
      .catch(error => {
        console.error('Error fetching form:', error);
      });
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      // Update the local state to reflect the change
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="user-info">
        {profilePic ? (
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${profilePic}`}
            alt="Profile"
            className="header-profile-pic"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="header-profile-pic-placeholder">No Image</div>
        )}
        <span className="username">{user.username}</span>
      </div>
      <div className="notification-area">
        <NotificationBubble />
        <FontAwesomeIcon
          icon={faBell}
          onClick={toggleNotifications}
          className="bell-icon"
        />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
        {showNotifications && (
          <div className="notifications-dropdown">
            {isLoading ? (
              <div className="loading">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification && notification.senderProfilePic && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${notification.senderProfilePic}`}
                      alt="Sender"
                      className="notification-sender-pic"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="notification-content">
                    <strong>{notification && notification.message}</strong>
                    <small className="timestamp">
                      {notification &&
                        notification.createdAt &&
                        formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                    </small>
                    {notification.formData && (
                      <p>Form: {notification.formData.formTitle}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">No notifications yet</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
