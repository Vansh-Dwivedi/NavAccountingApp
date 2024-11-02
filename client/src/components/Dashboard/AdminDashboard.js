import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "antd/dist/reset.css";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  List,
  Pagination,
  Form,
  Input,
  Button,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  FileOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MoonOutlined,
  EditOutlined,
  UploadOutlined,
  TeamOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import AuditLogs from "../AuditLogs";
import ChatComponent from "../Chat/ChatComponent";
import Header from "../Header";
import Modal from "../Modal";
import FormSubmissionPage from "../FormSubmissionPage";
import MakeFormTab from "../MakeFormTab";
import FormsTab from "../FormsTab";
import CategoriesTab from "../CategoriesTab";
import TransactionsSection from "./TransactionsSection";
import FinancialInfoSection from "./FinancialInfoSection";
import DocumentsSection from "./DocumentsSection";
import NotesSection from "./NotesSection";
import TasksSection from "./TasksSection";
import ComplianceSection from "./ComplianceSection";
import AuditLogSection from "./AuditLogSection";
import FinancialOverview from "./FinancialOverview";
import TransactionList from "./TransactionList";
import UserManagement from "../Admin/UserManagement";
import { debounce } from "lodash";
import io from "socket.io-client";
import AdminEmployeeDashboard from "./AdminEmployeeDashboard";
import DragAndDropScreen from "../DragAndDropScreen";
import { getProfilePicUrl } from "../../utils/profilePicHelper";

const { Content, Sider } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [roles, setRoles] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [messageText, setMessageText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
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
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [savedForms, setSavedForms] = useState([]);
  const [activeFormsTab, setActiveFormsTab] = useState("makeForm");
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    accountStatus: "",
    assignedManager: "",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [financialInfo, setFinancialInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [email, setEmail] = useState(adminData?.email || "");
  const [username, setUsername] = useState(adminData?.username || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchAdminData();
    fetchRoles();
    fetchSavedForms();

    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("userUpdate", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    });

    // Refresh the window once when the component mounts
    if (!sessionStorage.getItem("initialLoad")) {
      window.location.reload();
      sessionStorage.setItem("initialLoad", "true");
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchFinancialInfo(selectedClient._id);
      fetchTransactions(selectedClient._id);
    }
  }, [selectedClient]);

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
      setAdminData(response.data);
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

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setAdminData(response.data);
      setProfilePic(response.data.getProfilePicUrl(profilePic));
    } catch (error) {
      console.error("Error fetching admin data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchSavedForms = async () => {
    try {
      const response = await api.get("/api/forms/all");
      setSavedForms(response.data);
    } catch (error) {
      console.error("Error fetching saved forms:", error);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const toggleSleepMode = () => {
    setIsSleepMode(!isSleepMode);
    setPassword("");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "Users" },
    { key: "logs", icon: <FileOutlined />, label: "Logs" },
    { key: "forms", icon: <EditOutlined />, label: "Forms" },
    {
      key: "employeeManagement",
      icon: <TeamOutlined />,
      label: "Employee Management",
    },
    { key: "dragAndDrop", icon: <InboxOutlined />, label: "File Transfer" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    { key: "sleep", icon: <MoonOutlined />, label: "Sleep Mode" },
  ];

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedForms = savedForms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    formData.append("getProfilePicUrl(profilePic)", file);

    try {
      const response = await api.post("/api/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(response.data.getProfilePicUrl(profilePic));
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
            } else if (key === "sleep") {
              toggleSleepMode();
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
        <Header />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {activeTab === "dashboard" && (
              <div>
                <Title level={2}>Welcome, {adminData?.username}</Title>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card>
                      <Statistic title="Total Users" value={users.length} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="Active Users"
                        value={users.filter((user) => !user.isBlocked).length}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="Blocked Users"
                        value={users.filter((user) => user.isBlocked).length}
                      />
                    </Card>
                  </Col>
                </Row>
                <Card style={{ marginTop: 16 }}>
                  <Avatar
                    size={64}
                    src={
                      getProfilePicUrl(profilePic)
                        ? `${process.env.REACT_APP_API_URL}/uploads/${getProfilePicUrl(getProfilePicUrl(getProfilePicUrl(profilePic)))}`
                        : null
                    }
                    icon={<UserOutlined />}
                  />
                  <Upload
                    type="file"
                    onChange={handleProfilePicUpload}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Upload Picture</Button>
                  </Upload>
                  {getProfilePicUrl(getProfilePicUrl(profilePic)) && (
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
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder={`${adminData?.username}`}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      validateStatus={emailError ? "error" : ""}
                      help={emailError}
                    >
                      <Input
                        value={email}
                        onChange={handleEmailChange}
                        placeholder={`${adminData?.email}`}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={updateProfile}>
                        Update Profile
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            )}
            {activeTab === "users" && <UserManagement adminData={adminData} />}
            {activeTab === "logs" && <AuditLogs />}
            {activeTab === "employeeManagement" && (
              <div>
                <Title level={3}>Employee Management</Title>
                {selectedEmployee ? (
                  <AdminEmployeeDashboard employeeId={selectedEmployee} />
                ) : (
                  <>
                    <List
                      dataSource={users
                        .filter((user) => user.role === "employee")
                        .slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize
                        )}
                      renderItem={(user) => (
                        <List.Item
                          actions={[
                            <Button
                              onClick={() => setSelectedEmployee(user._id)}
                            >
                              Manage Employee
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={user.username}
                            description={user.email}
                          />
                        </List.Item>
                      )}
                    />
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={
                        users.filter((user) => user.role === "employee").length
                      }
                      onChange={(page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                      }}
                      style={{ marginTop: "16px", textAlign: "center" }}
                    />
                  </>
                )}
              </div>
            )}
            {activeTab === "dragAndDrop" && (
              <div className="drag-and-drop-section">
                <Title level={3}>File Transfer</Title>
                <DragAndDropScreen userRole="admin" />
              </div>
            )}
            {activeTab === "forms" && (
              <div className="forms-tab">
                <Tabs activeKey={activeFormsTab} onChange={setActiveFormsTab}>
                  <TabPane tab="Forms" key="sentForms">
                    <FormsTab />
                  </TabPane>
                  <TabPane tab="Make Form" key="makeForm">
                    <MakeFormTab />
                  </TabPane>
                  <TabPane tab="Form Submissions" key="formSubmission">
                    <List
                      itemLayout="horizontal"
                      dataSource={paginatedForms}
                      renderItem={(form) => (
                        <List.Item
                          onClick={() => setSelectedFormId(form._id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedFormId === form._id ? "#e6f7ff" : "",
                          }}
                        >
                          <List.Item.Meta
                            title={form.title}
                            description={form.description}
                          />
                        </List.Item>
                      )}
                    />
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={savedForms.length}
                      onChange={handlePageChange}
                      style={{ marginTop: "16px", textAlign: "center" }}
                    />
                    {selectedFormId && (
                      <FormSubmissionPage formId={selectedFormId} />
                    )}
                  </TabPane>
                  <TabPane tab="Categories" key="categories">
                    <CategoriesTab />
                  </TabPane>
                </Tabs>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
