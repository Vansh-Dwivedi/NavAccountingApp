import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Dashboard.css";
import AuditLogs from "../AuditLogs";
import ChatComponent from "../Chat/ChatComponent";
import Header from "../Header";
import Modal from "../Modal";
import SendFormTab from "../SendFormTab";
import FormSubmissionPage from "../FormSubmissionPage";
import FormSubmissionsList from "../FormSubmissionsList";
import {
  FaTrash,
  FaBan,
  FaComment,
  FaUserPlus,
  FaUsers,
  FaFilter,
  FaFileAlt,
  FaTimes,
  FaUserShield,
  FaChartLine,
  FaUserCircle,
  FaEnvelope,
  FaIdBadge,
  FaCheckCircle,
  FaTimesCircle,
  FaUserTie,
  FaUserFriends,
  FaExclamationTriangle,
  FaSearch,
  FaSignOutAlt,
  FaMoon,
  FaLock,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [roles, setRoles] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormId, setSelectedFormId] = useState(null);
  const sidebarRef = useRef(null);
  const [columnFilters, setColumnFilters] = useState({
    username: true,
    email: true,
    role: true,
    assignedManager: true,
    assignedClients: true,
    actions: true,
  });
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [password, setPassword] = useState("");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open");
  };

  useEffect(() => {
    fetchUsers();
    fetchAdminData();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const response = await api.get("/api/users/all");
      console.log("Response received:", response);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setAdminData(response.data);
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/api/users/roles");
      console.log("Roles fetched from API:", response.data);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role: newRole },
    }));
  };

  const applyChanges = async (userId) => {
    try {
      const changes = pendingChanges[userId];
      if (!changes) return;

      if (changes.delete) {
        await api.delete(`/api/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        setMessage(`User deleted successfully`);
      } else {
        if (changes.role) {
          await api.put(`/api/users/update-role/${userId}`, {
            role: changes.role,
          });
        }

        if (changes.assignedManager) {
          await api.put(`/api/users/${userId}/assign-manager`, {
            managerId: changes.assignedManager,
          });
          await api.put(`/api/users/${changes.assignedManager}/assign-client`, {
            clientId: userId,
          });
        }

        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, ...changes } : user
          )
        );

        setMessage(
          `Changes applied successfully for ${
            users.find((u) => u._id === userId).username
          }`
        );
      }

      setPendingChanges((prev) => {
        const newPending = { ...prev };
        delete newPending[userId];
        return newPending;
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error applying changes:", error);
      setMessage("Failed to apply changes. Please try again.");
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

  const handleStartChat = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        setMessage("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        setMessage("Failed to delete user");
      }
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const action = isBlocked ? "unblock" : "block";
      await api.put(`/api/users/${userId}/${action}`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
      setMessage(`User ${action}ed successfully`);
    } catch (error) {
      console.error(
        `Error ${isBlocked ? "unblocking" : "blocking"} user:`,
        error
      );
      setMessage(`Failed to ${action} user`);
    }
  };

  const handleAssignManager = async (userId) => {
    try {
      const managers = users.filter((user) => user.role === "manager");
      setModalContent(
        <div>
          <h3>Assign Manager</h3>
          <select onChange={(e) => assignManager(userId, e.target.value)}>
            <option value="">Select a manager</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.username}
              </option>
            ))}
          </select>
        </div>
      );
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setMessage("Failed to fetch managers");
    }
  };

  const assignManager = async (userId, managerId) => {
    try {
      await api.put(`/api/users/${userId}/assign-manager`, { managerId });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, assignedManager: managerId } : user
        )
      );
      setMessage("Manager assigned successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Error assigning manager:", error);
      setMessage("Failed to assign manager");
    }
  };

  const handleViewClients = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/assigned-clients`);
      setModalContent(
        <div>
          <h3>Assigned Clients</h3>
          {response.data.length > 0 ? (
            <ul>
              {response.data.map((client) => (
                <li key={client._id}>
                  <img
                    src={
                      client.profilePic
                        ? `${process.env.REACT_APP_API_URL}/uploads/${client.profilePic}`
                        : process.env.DEPROPIC
                    }
                    alt={client.username}
                    className="profile-pic-small"
                    crossOrigin="anonymous"
                    onClick={() =>
                      handleEnlargeProfilePic(
                        client.profilePic,
                        client.username
                      )
                    }
                  />
                  {client.username}
                </li>
              ))}
            </ul>
          ) : (
            <p>No clients assigned</p>
          )}
        </div>
      );
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching assigned clients:", error);
      setMessage("Failed to fetch assigned clients");
    }
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch = roleFilter === "All" || user.role === roleFilter;
    const searchMatch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && searchMatch;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEnlargeProfilePic = (profilePic, username) => {
    setModalContent(
      <div>
        <h3>{username}'s Profile Picture</h3>
        <img
          src={
            profilePic
              ? `${process.env.REACT_APP_API_URL}/uploads/${profilePic}`
              : process.env.DEPROPIC
          }
          alt={username}
          style={{ width: "100%", maxWidth: "400px" }}
          crossOrigin="anonymous"
        />
      </div>
    );
    setShowModal(true);
  };

  const handleColumnFilterChange = (column) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const toggleSleepMode = () => {
    setIsSleepMode(!isSleepMode);
    setPassword("");
  };

  const handleLogin = () => {
    // Here you should implement the actual password verification
    // For this example, we're using a dummy password "admin123"
    if (password === adminData.pin) {
      setIsSleepMode(false);
      setPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  console.log("Current roles state before rendering:", roles);

  const sidebarItems = [
    { icon: <FaUserShield />, label: "Users", value: "users" },
    { icon: <FaChartLine />, label: "Logs", value: "logs" },
    { icon: <FaUserCircle />, label: "Dashboard", value: "dashboard" },
    { icon: <FaFileAlt />, label: "Send Form", value: "sendForm" },
    {
      icon: <FaFileAlt />,
      label: "Form Submissions",
      value: "formSubmissions",
    },
  ];

  const filterStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  if (isSleepMode) {
    return (
      <div
        style={{
          backgroundColor: "white",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaLock size={48} />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ margin: "20px 0" }}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <button className="drawer-toggle-button" onClick={toggleDrawer}>
          ☰
        </button>
        <div
          className={`sidebar ${isDrawerOpen ? "active" : ""}`}
          ref={sidebarRef}
        >
          <div className="profile-section">
            <img
              src={
                profilePic
                  ? `${process.env.REACT_APP_API_URL}/uploads/${profilePic}`
                  : process.env.DEPROPIC
              }
              alt="Profile"
              className="profile-pic"
              crossOrigin="anonymous"
              onClick={() =>
                handleEnlargeProfilePic(profilePic, adminData?.username)
              }
            />
            <input
              type="file"
              onChange={handleProfilePicUpload}
              accept="image/*"
            />
            {profilePic && (
              <button onClick={handleProfilePicDelete}>Delete Picture</button>
            )}
          </div>
          {adminData && (
            <div className="admin-info">
              <p>Username: {adminData.username}</p>
              <p>Email: {adminData.email}</p>
              <p>Role: {adminData.role}</p>
            </div>
          )}
          {sidebarItems.map((item) => (
            <button
              key={item.value}
              className={`sidebar-item ${
                activeTab === item.value ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <hr />
          <button onClick={handleLogout} className="sidebar-item">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
          <button onClick={toggleSleepMode} className="sidebar-item">
            <FaMoon />
            <span>Sleep Mode</span>
          </button>
        </div>

        <div className="main-content">
          <h2>Admin Dashboard</h2>
          {message && <div className="message">{message}</div>}

          {activeTab === "formSubmissions" && (
            <div>
              <h3>Form Submissions</h3>
              {selectedFormId ? (
                <FormSubmissionPage formId={selectedFormId} />
              ) : (
                <FormSubmissionsList onSelectForm={setSelectedFormId} />
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="user-management">
              <h3>User Management</h3>
              <div className="filter-container">
                <FaFilter />
                <select value={roleFilter} onChange={handleRoleFilterChange}>
                  <option value="All">All Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "admin" ? (
                        <FaUserShield />
                      ) : role === "manager" ? (
                        <FaUserTie />
                      ) : (
                        <FaUserCircle />
                      )}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="search-container">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div style={filterStyle}>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="username"
                    checked={columnFilters.username}
                    onChange={() => handleColumnFilterChange("username")}
                  />
                  <label htmlFor="username">Username</label>
                </div>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="email"
                    checked={columnFilters.email}
                    onChange={() => handleColumnFilterChange("email")}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="role"
                    checked={columnFilters.role}
                    onChange={() => handleColumnFilterChange("role")}
                  />
                  <label htmlFor="role">Role</label>
                </div>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="assignedManager"
                    checked={columnFilters.assignedManager}
                    onChange={() => handleColumnFilterChange("assignedManager")}
                  />
                  <label htmlFor="assignedManager">Assigned Manager</label>
                </div>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="assignedClients"
                    checked={columnFilters.assignedClients}
                    onChange={() => handleColumnFilterChange("assignedClients")}
                  />
                  <label htmlFor="assignedClients">Assigned Clients</label>
                </div>
                <div style={checkboxStyle}>
                  <input
                    type="checkbox"
                    id="actions"
                    checked={columnFilters.actions}
                    onChange={() => handleColumnFilterChange("actions")}
                  />
                  <label htmlFor="actions">Actions</label>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    {columnFilters.username && (
                      <th>
                        <FaUserCircle /> Username
                      </th>
                    )}
                    {columnFilters.email && (
                      <th>
                        <FaEnvelope /> Email
                      </th>
                    )}
                    {columnFilters.role && (
                      <th>
                        <FaIdBadge /> Role
                      </th>
                    )}
                    {columnFilters.assignedManager && (
                      <th>
                        <FaUserTie /> Assigned Manager
                      </th>
                    )}
                    {columnFilters.assignedClients && (
                      <th>
                        <FaUserFriends /> Assigned Clients
                      </th>
                    )}
                    {columnFilters.actions && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      {columnFilters.username && (
                        <td>
                          <img
                            src={
                              user.profilePic
                                ? `${process.env.REACT_APP_API_URL}/uploads/${user.profilePic}`
                                : process.env.DEPROPIC
                            }
                            alt={user.username}
                            className="profile-pic-small"
                            crossOrigin="anonymous"
                            onClick={() =>
                              handleEnlargeProfilePic(
                                user.profilePic,
                                user.username
                              )
                            }
                          />
                          {user.username}
                        </td>
                      )}
                      {columnFilters.email && <td>{user.email}</td>}
                      {columnFilters.role && (
                        <td>
                          <select
                            value={pendingChanges[user._id]?.role || user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="role-select"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role === "admin" ? (
                                  <FaUserShield />
                                ) : role === "manager" ? (
                                  <FaUserTie />
                                ) : (
                                  <FaUserCircle />
                                )}
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      {columnFilters.assignedManager && (
                        <td>
                          {user.assignedManager ? (
                            <>
                              <img
                                src={
                                  user.assignedManager.profilePic
                                    ? `${process.env.REACT_APP_API_URL}/uploads/${user.assignedManager.profilePic}`
                                    : process.env.DEPROPIC
                                }
                                alt="Assigned Manager"
                                className="profile-pic-small"
                                crossOrigin="anonymous"
                                onClick={() =>
                                  handleEnlargeProfilePic(
                                    user.assignedManager.profilePic,
                                    user.assignedManager
                                  )
                                }
                              />
                              {user.assignedManager}
                            </>
                          ) : (
                            <span className="na-box">
                              <FaExclamationTriangle /> N/A
                            </span>
                          )}
                        </td>
                      )}
                      {columnFilters.assignedClients && (
                        <td>
                          {user.role === "manager" ? (
                            <button
                              onClick={() => handleViewClients(user._id)}
                              className="view-clients-button"
                            >
                              <FaUsers /> View Clients
                            </button>
                          ) : (
                            <span className="na-box">
                              <FaExclamationTriangle /> N/A
                            </span>
                          )}
                        </td>
                      )}
                      {columnFilters.actions && (
                        <td>
                          <div className="action-buttons">
                            {pendingChanges[user._id] && (
                              <button
                                onClick={() => applyChanges(user._id)}
                                className="apply-button"
                              >
                                Apply
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="delete-button"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                            <button
                              onClick={() => handleStartChat(user)}
                              className="chat-button"
                              title="Chat with User"
                            >
                              <FaComment />
                            </button>
                            {user.role === "client" && (
                              <button
                                onClick={() => handleAssignManager(user._id)}
                                className="assign-manager-button"
                                title="Assign Manager"
                              >
                                <FaUserPlus />
                              </button>
                            )}
                            {user.role === "manager" && (
                              <button
                                onClick={() => handleViewClients(user._id)}
                                className="view-clients-button"
                                title="View Clients"
                              >
                                <FaUsers />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "logs" && <AuditLogs />}
          {activeTab === "dashboard" && <div>Dashboard content goes here</div>}
          {activeTab === "sendForm" && <SendFormTab />}

          {showChat && selectedUser && (
            <div className="chat-window">
              <ChatComponent
                currentUser={adminData}
                otherUser={selectedUser}
                onClose={handleCloseChat}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default AdminDashboard;
