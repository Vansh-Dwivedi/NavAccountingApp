import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { formatDistanceToNow } from "date-fns";
import { getSocket } from "../utils/socket";
import { getProfilePicUrl } from "../utils/profilePicHelper";
import {
  Layout,
  Badge,
  Avatar,
  Dropdown,
  Space,
  Card,
  Empty,
  Spin,
  Menu,
} from "antd";
import { BellOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchNotifications();
      const socket = getSocket();

      socket.emit("join", user._id);

      socket.on("newNotification", (notification) => {
        setNotifications(prev => Array.isArray(prev) ? [notification, ...prev] : [notification]);
        setUnreadCount(prev => prev + 1);
      });

      socket.on("allNotificationsRead", () => {
        setNotifications([]);
        setUnreadCount(0);
      });

      socket.on("notificationRead", (notificationId) => {
        setNotifications(prev => 
          prev.filter(notification => notification._id !== notificationId)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      });

      return () => {
        socket.off("newNotification");
        socket.off("allNotificationsRead");
        socket.off("notificationRead");
      };
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/users/profile');
      if (response.data.profilePic) {
        const picUrl = getProfilePicUrl(response.data.profilePic);
        setProfilePic(picUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/notifications");
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put("/api/notifications/mark-all-read");
      setNotifications(prev => 
        Array.isArray(prev) ? prev.map(notif => ({ ...notif, read: true })) : []
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.formData) {
      openFormModal(notification.formData.formId);
    }
    markNotificationAsRead(notification._id);
  };

  const openFormModal = (formId) => {
    api
      .get(`/api/forms/${formId}`)
      .then((response) => {
        setSelectedForm(response.data);
      })
      .catch((error) => {
        console.error("Error fetching form:", error);
      });
  };

  const notificationItems = (
    <Card
      style={{
        width: 380,
        maxHeight: 480,
        overflow: "auto",
        padding: 0,
        boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>Notifications</span>
        {notifications.length > 0 && (
          <a
            onClick={markAllNotificationsAsRead}
            style={{ fontSize: 14, color: "#1677ff", cursor: "pointer" }}
          >
            <Space>
              <CheckCircleOutlined />
              Mark all as read
            </Space>
          </a>
        )}
      </div>
      {isLoading ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => handleNotificationClick(notification)}
            style={{
              padding: 16,
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
              transition: "background-color 0.3s",
              backgroundColor: "white",
              ":hover": {
                backgroundColor: "#fafafa",
              },
            }}
          >
            <Space align="start">
              <Avatar
                src={
                  notification.senderProfilePic &&
                  getProfilePicUrl(notification.senderProfilePic)
                }
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    marginBottom: 4,
                    color: "rgba(0, 0, 0, 0.88)",
                  }}
                >
                  {notification.message}
                </div>
                {notification.formData && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(0, 0, 0, 0.45)",
                      marginBottom: 4,
                    }}
                  >
                    Form: {notification.formData.formTitle}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(0, 0, 0, 0.45)",
                  }}
                >
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </Space>
          </div>
        ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications yet"
          style={{ padding: 24 }}
        />
      )}
    </Card>
  );

  if (!user) return null;

  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1008,
        width: "100%",
        height: 64,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar
          size={36}
          src={profilePic}
          icon={!profilePic && <UserOutlined />}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(0, 0, 0, 0.88)",
          }}
        >
          {user.username}
        </span>
      </div>

      <Dropdown
        overlay={notificationItems}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <Badge count={unreadCount} offset={[-2, 2]}>
          <Avatar
            icon={<BellOutlined />}
            style={{
              backgroundColor: "transparent",
              color: "rgba(0, 0, 0, 0.65)",
              cursor: "pointer",
              transition: "color 0.3s",
              ":hover": {
                color: "#1677ff",
              },
            }}
          />
        </Badge>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
