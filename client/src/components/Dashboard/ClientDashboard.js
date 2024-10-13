import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import ClientInfoForm from "../ClientInfoForm";
import "./Dashboard.css";
import ChatComponent from "../Chat/ChatComponent";
import { AuthContext } from "../../context/AuthContext";
import Header from "../Header";
import io from "socket.io-client";
import NotificationBubble from "../NotificationBubble";
import FormPopupModal from "../FormPopupModal";

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [receivedForms, setReceivedForms] = useState([]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open");
  };


  useEffect(() => {
    fetchClientData();
    fetchAdminUser();
    fetchForms();
    fetchReceivedForms();

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
    if (clientData && socketRef.current) {
      socketRef.current.emit("join", clientData._id);

      socketRef.current.on("newMessage", (message) => {
        if (message.receiver === clientData._id) {
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
  }, [clientData]);


  const fetchClientData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setClientData(response.data);
      setProfilePic(response.data.profilePic);
      console.log("Client data:", response.data);
      if (!response.data.assignedManager) {
        console.warn("No assigned manager for this client");
      }
      fetchClientInfo(response.data._id);
    } catch (error) {
      console.error("Error fetching client data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchClientInfo = async (clientId) => {
    try {
      const response = await api.get(`/api/users/client-info/${clientId}`);
      setClientInfo(response.data);
    } catch (error) {
      console.error("Error fetching client info:", error);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleChatSelect = (user) => {
    setOpenChats((prevChats) => ({
      ...prevChats,
      [user._id]: true,
    }));
    setActiveTab("chat");
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
  };

  const handleCloseChat = (userId) => {
    setOpenChats((prevChats) => {
      const newChats = { ...prevChats };
      delete newChats[userId];
      return newChats;
    });
  };

  const fetchForms = async () => {
    try {
      const response = await api.get("/api/forms/user");
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const fetchReceivedForms = async () => {
    try {
      const response = await api.get('/api/forms/user');
      setReceivedForms(response.data);
    } catch (error) {
      console.error('Error fetching received forms:', error);
    }
  };

  const handleFormClick = (form) => {
    setSelectedForm(form);
  };

  const handleFormSubmit = async (formId, formData) => {
    try {
      await api.post(`/api/forms/${formId}/submit`, formData);
      alert('Form submitted successfully');
      fetchReceivedForms();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="client-dashboard">
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
              <div className="profile-pic-placeholder">No file chosen</div>
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
          {clientData && (
            <div className="client-info">
              <p>Username: {clientData.username}</p>
              <p>Email: {clientData.email}</p>
              <p>Role: {clientData.role}</p>
            </div>
          )}
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("submitInfo")}>
            Submit Info
          </button>
          <button onClick={() => setActiveTab("chat")}>Chat</button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="client-main-content">
          <h2>Client Dashboard</h2>
          <NotificationBubble userId={clientData?._id} />
          {activeTab === "dashboard" && clientData && (
            <div className="dashboard-info">
              <h3>Welcome, {clientData.username}</h3>
              <p>Email: {clientData.email}</p>
              <p>Role: {clientData.role}</p>
              {clientData.assignedManager ? (
                <p>Assigned Manager: {clientData.assignedManager.username}</p>
              ) : (
                <p>No manager assigned yet.</p>
              )}
              <h3>Your Info</h3>
              {clientData.clientInfo ? (
                <>
                  <h4>Personal Information</h4>
                  <p>Full Name: {clientData.clientInfo.fullName}</p>
                  <p>Occupation: {clientData.clientInfo.occupation}</p>
                  <p>Spouse Name: {clientData.clientInfo.spouseName}</p>
                  <p>
                    Spouse Occupation: {clientData.clientInfo.spouseOccupation}
                  </p>
                  <p>Email: {clientData.clientInfo.email}</p>
                  <p>Cell No: {clientData.clientInfo.cellNo}</p>
                  <p>SSN: {clientData.clientInfo.ssn}</p>
                  <p>Spouse SSN: {clientData.clientInfo.spouseSSN}</p>
                  <p>Date of Birth: {clientData.clientInfo.dob}</p>
                  <p>Spouse Date of Birth: {clientData.clientInfo.spouseDOB}</p>
                  <p>
                    Address: {clientData.clientInfo.addressLine1}{" "}
                    {clientData.clientInfo.addressLine2}
                  </p>
                  <p>
                    How did you find us: {clientData.clientInfo.howDidYouFindUs}
                  </p>
                  <p>Referred by: {clientData.clientInfo.referredName}</p>
                  <p>Filing Status: {clientData.clientInfo.filingStatus}</p>
                  <p>
                    Total Dependents: {clientData.clientInfo.totalDependents}
                  </p>

                  <h4>Dependents</h4>
                  {clientData.clientInfo.dependents.map((dep, index) => (
                    <div key={index}>
                      <p>Name: {dep.name}</p>
                      <p>SSN: {dep.ssn}</p>
                      <p>Date of Birth: {dep.dob}</p>
                      <p>Relation: {dep.relation}</p>
                    </div>
                  ))}

                  <h4>Business Information</h4>
                  <p>Business Name: {clientData.clientInfo.businessName}</p>
                  <p>Business Phone: {clientData.clientInfo.businessPhone}</p>
                  <p>
                    Business Address:{" "}
                    {clientData.clientInfo.businessAddressLine1}{" "}
                    {clientData.clientInfo.businessAddressLine2}
                  </p>
                  <p>
                    Business Entity Type:{" "}
                    {clientData.clientInfo.businessEntityType}
                  </p>
                  <p>Business TIN: {clientData.clientInfo.businessTIN}</p>
                  <p>Business SOS: {clientData.clientInfo.businessSOS}</p>
                  <p>Business EDD: {clientData.clientInfo.businessEDD}</p>
                  <p>
                    Business Accounting Method:{" "}
                    {clientData.clientInfo.businessAccountingMethod}
                  </p>
                  <p>Business Year: {clientData.clientInfo.businessYear}</p>
                  <p>Business Email: {clientData.clientInfo.businessEmail}</p>
                  <p>
                    Contact Person Name:{" "}
                    {clientData.clientInfo.contactPersonName}
                  </p>
                  <p>
                    Number of Active Employees:{" "}
                    {clientData.clientInfo.noOfEmployeesActive}
                  </p>
                  <p>
                    Business Referred By:{" "}
                    {clientData.clientInfo.businessReferredBy}
                  </p>

                  <h4>Members/Shareholders</h4>
                  {clientData.clientInfo.members.map((mem, index) => (
                    <div key={index}>
                      <p>Name: {mem.name}</p>
                      <p>SSN: {mem.ssn}</p>
                      <p>Cell Phone: {mem.cellPhone}</p>
                      <p>Position: {mem.position}</p>
                    </div>
                  ))}

                  <h4>Service Requested</h4>
                  <p>{clientData.clientInfo.serviceRequested.join(", ")}</p>
                </>
              ) : (
                <p>No client information submitted yet.</p>
              )}
            </div>
          )}
          {activeTab === "submitInfo" && <ClientInfoForm />}
          {activeTab === "chat" && (
            <div className="chat-section">
              <h3>Chat</h3>
              <div className="chat-list">
                {clientData?.assignedManager && (
                  <button
                    onClick={() => handleChatSelect(clientData.assignedManager)}
                    className={`chat-button ${
                      openChats[clientData.assignedManager._id]
                        ? "selected"
                        : ""
                    }`}
                  >
                    Chat with Manager
                    {unreadCounts[clientData.assignedManager._id] > 0 && (
                      <span className="unread-bubble">
                        {unreadCounts[clientData.assignedManager._id]}
                      </span>
                    )}
                  </button>
                )}
                {adminUser && (
                  <button
                    onClick={() => handleChatSelect(adminUser)}
                    className={`chat-button ${
                      openChats[adminUser._id] ? "selected" : ""
                    }`}
                  >
                    Chat with Admin
                    {unreadCounts[adminUser._id] > 0 && (
                      <span className="unread-bubble">
                        {unreadCounts[adminUser._id]}
                      </span>
                    )}
                  </button>
                )}
              </div>
              <div className="chat-windows">
                {Object.entries(openChats).map(([userId, isOpen]) => {
                  if (!isOpen) return null;
                  const chatPartner =
                    userId === adminUser?._id
                      ? adminUser
                      : clientData?.assignedManager;
                  if (!chatPartner) return null;
                  return (
                    <div key={userId} className="chat-window">
                      <ChatComponent
                        currentUser={clientData}
                        otherUser={chatPartner}
                        onClose={() => handleCloseChat(userId)}
                        chatId={`${clientData._id}-${chatPartner._id}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="forms-section">
            <h3>Forms to Complete</h3>
            {forms.map((form) => (
              <div key={form._id} className="form-item" onClick={() => handleFormClick(form)}>
                <h4>{form.title}</h4>
                <p>Deadline: {form.deadline} days</p>
                {form.isCompulsory && <span className="compulsory-tag">Compulsory</span>}
              </div>
            ))}
          </div>
          <div className="received-forms">
            <h3>Received Forms</h3>
            {receivedForms.map((form) => (
              <div key={form._id} className="form-item">
                <h4>{form.title}</h4>
                <p>Deadline: {form.deadline} days</p>
                <button onClick={() => handleFormClick(form)}>Fill Out Form</button>
              </div>
            ))}
          </div>
          {selectedForm && (
            <FormPopupModal
              form={selectedForm}
              onClose={() => setSelectedForm(null)}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleDrawer}
      ></div>
    </>
  );
};


export default ClientDashboard;