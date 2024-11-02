import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "antd/dist/reset.css";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Avatar,
  List,
  Pagination,
  Badge,
  Form,
  Input,
} from "antd";
import {
  UserOutlined,
  FileOutlined,
  DashboardOutlined,
  LogoutOutlined,
  FormOutlined,
  MessageOutlined,
  DollarOutlined,
  EditOutlined,
  SettingOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ClientInfoForm from "../ClientInfoForm";
import ChatComponent from "../Chat/ChatComponent";
import { AuthContext } from "../../context/AuthContext";
import Header from "../Header";
import io from "socket.io-client";
import NotificationBubble from "../NotificationBubble";
import FormPopupModal from "../FormPopupModal";
import InputForm from "../InputForm";
import Notes from "../Notes/Notes";
import Signatures from "../Signatures/Signatures";
import FinancialInfoSection from "./FinancialInfoSection";
import RoleChecker from "../../Authentication/main";
import { getProfilePicUrl } from "../../utils/profilePicHelper";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [assignedForms, setAssignedForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [email, setEmail] = useState(clientData?.email || "");
  const [username, setUsername] = useState(clientData?.username || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    fetchClientData();
    fetchAdminUser();
    fetchForms();
  }, []);

  useEffect(() => {
    if (clientData) {
      fetchAssignedForms();
    }
  }, [clientData]);

  useEffect(() => {
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const updateProfile = async () => {
    try {
      const response = await api.put("/api/users/profile", { email, username });
      setClientData(response.data);
      console.log("Profile updated successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setEmailError(error.response.data.email);
        }
        if (error.response.data.username) {
          setUsernameError(error.response.data.username);
        }
      } else {
        console.error("Failed to update profile");
      }
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("The file size should not exceed 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await api.post("/api/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    }
  };

  const handleProfilePicDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile picture?"
    );
    if (!confirmed) return;

    try {
      await api.delete("/api/users/profile-pic");
      setProfilePic(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Error deleting profile picture. Please try again.");
    }
  };

  const fetchClientData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setClientData(response.data);
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

  const fetchAssignedForms = async () => {
    try {
      console.log("Fetching assigned forms...");
      const response = await api.get(`/api/forms/assigned/${clientData._id}`);
      console.log("Assigned forms response:", response.data);
      setAssignedForms(response.data);
    } catch (error) {
      console.error(
        "Error fetching assigned forms:",
        error.response?.data || error.message
      );
    }
  };

  const handleFormClick = (form) => {
    setSelectedForm({ ...form, user });
  };

  const handleFormSubmit = async (formData) => {
    try {
      await api.post(`/api/forms/${selectedForm._id}/submit`, formData);
      alert("Form submitted successfully");
      setSelectedForm(null);
      fetchForms();
      fetchAssignedForms();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedForms = assignedForms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "submitInfo", icon: <FormOutlined />, label: "Submit Info" },
    {
      key: "notesAndSignatures",
      icon: <FileOutlined />,
      label: "Notes & Signatures",
    },
    { key: "forms", icon: <FormOutlined />, label: "Forms" },
    { key: "chat", icon: <MessageOutlined />, label: "Chat" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    {
      key: "financialInfo",
      icon: <DollarOutlined />,
      label: "Financial Information",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider
          collapsible
          collapsed={!isSidebarOpen}
          onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
          style={{
            background: "#001529",
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            marginTop: "60px",
          }}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={["dashboard"]}
            mode="inline"
            onClick={({ key }) => {
              if (key === "logout") {
                handleLogout();
              } else {
                setActiveTab(key);
              }
            }}
            style={{
              background: "transparent",
              borderRight: 0,
            }}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{ margin: "8px 0" }}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginTop: "64px" }}>
          <Content style={{ margin: "0 16px" }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              {activeTab === "dashboard" && clientData && (
                <div className="dashboard-info">
                  <Title level={2}>Welcome, {clientData.username}</Title>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card>
                        {getProfilePicUrl(clientData.profilePic) ? (
                          <img
                            src={getProfilePicUrl(clientData.profilePic)}
                            alt="Profile"
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <Avatar size={64} icon={<UserOutlined />} />
                        )}
                        <Title level={4} style={{ marginTop: 16 }}>
                          {clientData.username}
                        </Title>
                        <Text>Email: {clientData.email}</Text>
                        <br />
                        <Text>Role: {clientData.role}</Text>
                      </Card>
                    </Col>
                    <Col span={16}>
                      <Card title="Your Info">
                        {clientData.clientInfo ? (
                          <>
                            <Title level={4}>Personal Information</Title>
                            <Text>
                              Full Name: {clientData.clientInfo.fullName}
                            </Text>
                            <br />
                            <Text>
                              Occupation: {clientData.clientInfo.occupation}
                            </Text>
                            <br />
                            <Text>Email: {clientData.clientInfo.email}</Text>
                            <br />
                            <Text>Cell No: {clientData.clientInfo.cellNo}</Text>
                            <br />
                            <Text>
                              Filing Status:{" "}
                              {clientData.clientInfo.filingStatus}
                            </Text>
                            <br />
                            <Text>
                              Total Dependents:{" "}
                              {clientData.clientInfo.totalDependents}
                            </Text>
                          </>
                        ) : (
                          <Text>No client information submitted yet.</Text>
                        )}
                      </Card>
                    </Col>
                    <Card>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        src={getProfilePicUrl(clientData.profilePic)}
                      />
                      <input
                        type="file"
                        onChange={handleProfilePicUpload}
                        accept="image/*"
                      />
                      {getProfilePicUrl(clientData.profilePic) && (
                        <Button onClick={handleProfilePicDelete}>
                          Delete Picture
                        </Button>
                      )}
                      <Title level={4} style={{ marginTop: 16 }}>
                        Profile Information
                      </Title>
                      <Form layout="vertical">
                        <Form.Item
                          label="Username"
                          validateStatus={usernameError ? "error" : ""}
                          help={usernameError}
                        >
                          <Input
                            value={clientData.username}
                            onChange={handleUsernameChange}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Email"
                          validateStatus={emailError ? "error" : ""}
                          help={emailError}
                        >
                          <Input value={clientData.email} onChange={handleEmailChange} />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" onClick={updateProfile}>
                            Update Profile
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Row>
                </div>
              )}
              {activeTab === "submitInfo" && clientData && (
                <ClientInfoForm clientId={clientData._id} />
              )}

              {activeTab === "notesAndSignatures" && clientData && (
                <div className="notes-and-signatures">
                  <Notes userId={clientData._id} />
                  <Signatures userId={clientData._id} />
                </div>
              )}
              {activeTab === "dragAndDrop" && (
                <div className="drag-and-drop-section">
                  <Title level={3}>File Transfer</Title>
                  <DragAndDropScreen userRole="client" />
                </div>
              )}
              {activeTab === "forms" && (
                <div className="assigned-forms-section">
                  <Title level={3}>Forms to Complete</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={paginatedForms}
                    renderItem={(form) => (
                      <List.Item
                        onClick={() => handleFormClick(form)}
                        style={{ cursor: "pointer" }}
                      >
                        <List.Item.Meta
                          title={form.title}
                          description={`Deadline: ${form.deadline} days`}
                        />
                        {form.isCompulsory && (
                          <Text type="danger">Compulsory</Text>
                        )}
                      </List.Item>
                    )}
                  />
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={assignedForms.length}
                    onChange={handlePageChange}
                    style={{ marginTop: "16px", textAlign: "center" }}
                  />
                </div>
              )}
              {activeTab === "chat" && (
                <div className="chat-section">
                  <Title level={3}>Chat</Title>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card title="Chat List">
                        {clientData?.assignedManager && (
                          <Button
                            onClick={() =>
                              handleChatSelect(clientData.assignedManager)
                            }
                            type={
                              openChats[clientData.assignedManager._id]
                                ? "primary"
                                : "default"
                            }
                            block
                          >
                            Chat with Manager
                            {unreadCounts[clientData.assignedManager._id] >
                              0 && (
                              <Badge
                                count={
                                  unreadCounts[clientData.assignedManager._id]
                                }
                              />
                            )}
                          </Button>
                        )}
                        {adminUser && (
                          <Button
                            onClick={() => handleChatSelect(adminUser)}
                            type={
                              openChats[adminUser._id] ? "primary" : "default"
                            }
                            block
                            style={{ marginTop: 8 }}
                          >
                            Chat with Admin
                            {unreadCounts[adminUser._id] > 0 && (
                              <Badge count={unreadCounts[adminUser._id]} />
                            )}
                          </Button>
                        )}
                      </Card>
                    </Col>
                    <Col span={16}>
                      <Card title="Chat Window">
                        {Object.entries(openChats).map(([userId, isOpen]) => {
                          if (!isOpen) return null;
                          const chatPartner =
                            userId === adminUser?._id
                              ? adminUser
                              : clientData?.assignedManager;
                          if (!chatPartner) return null;
                          return (
                            <ChatComponent
                              key={userId}
                              currentUser={clientData}
                              otherUser={chatPartner}
                              onClose={() => handleCloseChat(userId)}
                              chatId={`${clientData._id}-${chatPartner._id}`}
                            />
                          );
                        })}
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
              {activeTab === "financialInfo" && clientData && (
                <FinancialInfoSection clientId={clientData._id} />
              )}
              {selectedForm && (
                <FormPopupModal
                  form={selectedForm}
                  onClose={() => setSelectedForm(null)}
                  onSubmit={handleFormSubmit}
                  userId={clientData._id}
                />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
      <NotificationBubble userId={clientData?._id} />
      <RoleChecker userRole={clientData?.role} userEmail={clientData?.email}>
      </RoleChecker>
    </Layout>
  );
};

export default ClientDashboard;
