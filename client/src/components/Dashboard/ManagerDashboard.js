import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Dashboard.css";
import ChatComponent from "../Chat/ChatComponent";
import io from "socket.io-client";
import NotificationBubble from "../NotificationBubble";
import Header from "../Header";
import { FaSearch, FaPaperPlane } from 'react-icons/fa';

const ManagerDashboard = () => {
  const [managerData, setManagerData] = useState(null);
  const [assignedClients, setAssignedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open");
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerData();
    fetchAdminUser();
    fetchForms();

    socketRef.current = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000"
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    if (managerData && socketRef.current) {
      socketRef.current.emit("join", managerData._id);

      socketRef.current.on("newMessage", (message) => {
        if (message.receiver === managerData._id) {
          setUnreadCounts((prev) => ({
            ...prev,
            [message.sender]: (prev[message.sender] || 0) + 1,
          }));
        }
      });

      return () => {
        socketRef.current.off("newMessage");
      };
    }
  }, [managerData]);

  useEffect(() => {
    if (managerData) {
      fetchAssignedClients();
    }
  }, [managerData]);

  const fetchManagerData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setManagerData(response.data);
      setProfilePic(response.data.profilePic);
    } catch (err) {
      console.error("Error fetching manager data:", err);
      setError("Failed to fetch manager data. Please try again.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchAssignedClients = async () => {
    if (!managerData) return;
    try {
      const response = await api.get(
        `/api/users/${managerData._id}/assigned-clients`
      );
      setAssignedClients(response.data);
    } catch (err) {
      console.error("Error fetching assigned clients:", err);
      setError("Failed to fetch assigned clients. Please try again.");
    }
  };

  const fetchAdminUser = async () => {
    try {
      const response = await api.get("/api/users/admin");
      setAdminUser(response.data);
    } catch (error) {
      console.error("Error fetching admin user:", error);
    }
  };

  const handleClientSelect = (client) => {
    setOpenChats((prevChats) => ({
      ...prevChats,
      [client._id]: true,
    }));
    setSelectedClient(client);
    setActiveTab("chat");
    setUnreadCounts((prev) => ({ ...prev, [client._id]: 0 }));
  };

  const handleCloseChat = (clientId) => {
    setOpenChats((prevChats) => {
      const newChats = { ...prevChats };
      delete newChats[clientId];
      return newChats;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await api.post("/api/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleProfilePicDelete = async () => {
    try {
      await api.delete("/api/users/profile-pic");
      setProfilePic(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await api.get('/api/forms/all');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSelect = (form) => {
    setSelectedForm(form);
  };

  const handleSendForm = async (clientId) => {
    if (!selectedForm) return;
    try {
      await api.post('/api/forms/send', { formId: selectedForm._id, clientId });
      alert('Form sent to client successfully');
    } catch (error) {
      console.error('Error sending form to client:', error);
      alert('Failed to send form to client');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!managerData) return <div className="loading">Loading...</div>;

  return (
    <>
      <Header />
      <div className="manager-dashboard">
        <div className="sidebar-toggle-button-container">
          <button className="drawer-toggle-button" onClick={toggleDrawer}>
            ☰
          </button>
        </div>

        <div className={`sidebar ${isDrawerOpen ? "active" : ""}`}>
          <div className="profile-section">
            {profilePic ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${profilePic}`}
                alt="Profile"
                className="profile-pic"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="profile-pic-placeholder">No Image</div>
            )}
            <input
              type="file"
              onChange={handleProfilePicUpload}
              accept="image/*"
            />
            {profilePic && (
              <button onClick={handleProfilePicDelete}>Delete Picture</button>
            )}
          </div>
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("chat")}>Chat</button>
          <button onClick={() => setActiveTab("adminChat")}>
            Chat with Admin
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="main-content">
          <h2>Manager Dashboard</h2>
          {activeTab === "dashboard" && (
            <div className="dashboard-info">
              <h3>Welcome, {managerData.username}</h3>
              <p>Email: {managerData.email}</p>
              <p>Role: {managerData.role}</p>
              <h4>Assigned Clients:</h4>
              <ul>
                {assignedClients.map((client) => (
                  <li key={client._id}>{client.username}</li>
                ))}
              </ul>
            </div>
          )}
          <NotificationBubble userId={managerData._id} />
          {activeTab === "chat" && (
            <div className="chat-section">
              <h3>Chat with Clients</h3>
              <div className="client-list">
                {assignedClients.map((client) => (
                  <button
                    key={client._id}
                    onClick={() => handleClientSelect(client)}
                    className={`client-button ${
                      openChats[client._id] ? "selected" : ""
                    }`}
                  >
                    {client.username}
                    {unreadCounts[client._id] > 0 && (
                      <span className="unread-bubble">
                        {unreadCounts[client._id]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="chat-windows">
                {Object.entries(openChats).map(([clientId, isOpen]) => {
                  if (!isOpen) return null;
                  const client = assignedClients.find(
                    (c) => c._id === clientId
                  );
                  if (!client) return null;
                  return (
                    <div key={clientId} className="chat-window">
                      <ChatComponent
                        currentUser={managerData}
                        otherUser={client}
                        onClose={() => handleCloseChat(clientId)}
                        chatId={`${managerData._id}-${client._id}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "adminChat" && adminUser && (
            <ChatComponent
              currentUser={managerData}
              otherUser={adminUser}
              onClose={() => setActiveTab("dashboard")}
            />
          )}
          <div className="form-management">
            <h3>Form Management</h3>
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="form-list">
              {filteredForms.map((form) => (
                <div
                  key={form._id}
                  className={`form-item ${selectedForm?._id === form._id ? 'selected' : ''}`}
                  onClick={() => handleFormSelect(form)}
                >
                  <h4>{form.title}</h4>
                  <p>Status: {form.status}</p>
                </div>
              ))}
            </div>
            {selectedForm && (
              <div className="selected-form">
                <h4>{selectedForm.title}</h4>
                <p>Send to client:</p>
                <select onChange={(e) => handleSendForm(e.target.value)}>
                  <option value="">Select a client</option>
                  {assignedClients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.username}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleSendForm()}>
                  <FaPaperPlane /> Send Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleDrawer}
      ></div>
    </>
  );
};


export default ManagerDashboard;