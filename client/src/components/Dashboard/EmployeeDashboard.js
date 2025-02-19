import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Button,
  List,
  Avatar,
  Progress,
  Tag,
  Tooltip,
  Spin,
  Form,
  Upload,
  Alert,
  Select,
  DatePicker,
  InputNumber,
  message,
  Empty,
  Space,
  Tabs,
  Badge,
  Modal,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AuthContext } from "../../context/AuthContext";
import Header from "../Header";
import {
  UserOutlined,
  EditOutlined,
  CheckOutlined,
  SaveOutlined,
  TrophyOutlined,
  UploadOutlined,
  InboxOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MoonOutlined as SleepOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import EmployeeNotesSection from "./EmployeeNotesSection";
import DragAndDropScreen from "../DragAndDropScreen";
import { getProfilePicUrl } from "../../utils/profilePicHelper";
import RoleChecker from "../../Authentication/main";
import ChatComponent from "../Chat/ChatComponent";
import { useEnabledComponents } from "../../hooks/useEnabledComponents";
import WallpaperSelector from "./WallpaperSelector";
import SoftwareShortcuts from "./SoftwareShortcuts";
import LogoutConfirmModal from "../LogoutConfirmModal";
import SleepMode from "../SleepMode/SleepMode";
import EmployeeChatCenter from "../Chat/EmployeeChatCenter";
import WaitlistMessage from "../WaitlistMessage"; // New Import
import FancyLoader from '../common/FancyLoader';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Define styles at the top of the file, after imports
const COMMON_STYLES = {
  CARD: {
    width: "100%",
    height: "400px",
    marginBottom: 16,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "auto",
  },
  WALLPAPER_CARD: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    height: "auto",
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("selectedWallpaper") || "default.jpg"
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passbook, setPassbook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState(null);
  const [notesPage, setNotesPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [pageSize] = useState(5);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [personnelForm] = Form.useForm();
  const [employeeData, setEmployeeData] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  let [widgets, setWidgets] = useState([]);
  const canShowComponent = (component) => true; // Replace with actual logic
  const hasActiveComponents = () => {
    return (
      (activeTab === "dashboard" && canShowComponent("dashboard")) ||
      (activeTab === "chatCenter" && canShowComponent("chatCenter")) ||
      (activeTab === "profile" && canShowComponent("profile")) ||
      (activeTab === "settings" && canShowComponent("settings")) ||
      (activeTab === "personnelSettings" && canShowComponent("personnelSettings"))
    );
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
    fetchPassbook();
    fetchNotes();
    checkSleepMode();
    const savedWallpaper = localStorage.getItem("selectedWallpaper");
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
    const fetchChatUsers = async () => {
      try {
        const response = await api.get("/api/users/chat-users");
        setChatUsers(response.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };
    fetchChatUsers();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await api.get("/api/employee/dashboard");
      setEmployeeData(response.data);
      setEmail(response.data.email);
      setUsername(response.data.username);
      setProfilePic(response.data.getProfilePicUrl(profilePic));
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to fetch employee data. Please try again.");
    }
  };

  const fetchPassbook = async () => {
    try {
      const response = await api.get("/api/employee/passbook");
      setPassbook(response.data);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching passbook:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get("/api/employee/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const updateProfile = async () => {
    try {
      await api.put(`/api/users/profile/${employeeData._id}`, {
        username,
        email,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    try {
      await api.delete("/api/users/profile-pic");
      setProfilePic(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Error deleting profile picture. Please try again.");
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: null,
    },
    {
      key: "profile",
      icon: <EditOutlined />,
      label: "Edit Profile",
      onClick: null,
    },
    {
      key: "personnelSettings",
      icon: <UserOutlined />,
      label: "Personnel Settings",
      onClick: null,
    },
    {
      key: "chatCenter",
      icon: <MessageOutlined />,
      label: "Chat Center",
      onclick: null,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
    {
      key: "sleep",
      icon: <SleepOutlined />,
      label: "Sleep Mode",
    },
  ].filter((item) => {
    if (item.key === "logout" || item.key === "sleep") return true;
    return canShowComponent(item.key);
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const handlePersonnelSubmit = async (values) => {
    try {
      const response = await api.put(
        `/api/users/employee-personal-info/${employeeData._id}`,
        values
      );
      setEmployeeData(response.data);
      message.success("Personnel information updated successfully");
    } catch (error) {
      console.error("Error updating personnel information:", error);
      message.error("Failed to update personnel information");
    }
  };

  const checkSleepMode = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setIsSleepMode(response.data.isInSleepMode);
    } catch (error) {
      console.error("Error checking sleep mode:", error);
    }
  };

  const handleSleepMode = async () => {
    try {
      await api.put("/api/users/sleep-mode", { isInSleepMode: true });
      setIsSleepMode(true);
    } catch (error) {
      console.error("Error activating sleep mode:", error);
    }
  };

  const handleWallpaperChange = (wallpaperPath) => {
    localStorage.setItem("selectedWallpaper", wallpaperPath);
    setWallpaper(wallpaperPath);
  };

  const handleChatSelect = (user) => {
    setSelectedChatUser(user);
    setOpenChats((prev) => ({
      ...prev,
      [user._id]: true,
    }));
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
  };

  const handleCloseChat = (userId) => {
    setOpenChats((prev) => ({
      ...prev,
      [userId]: false,
    }));
    if (selectedChatUser?._id === userId) {
      setSelectedChatUser(null);
    }
  };

  widgets = [
    { id: "taskOfTheDay", title: "Task of the Day", content: <TaskOfTheDay /> },
    {
      id: "softwareShortcuts",
      title: "Software Shortcuts",
      content: <SoftwareShortcuts />,
    },
    {
      id: "employeePassbook",
      title: "Employee Passbook",
      content: <EmployeePassbook />,
    },
    {
      id: "dragAndDrop",
      title: "Drag and Drop Screen",
      content: <DragAndDropScreen />,
    },
    {
      id: "personalWriting",
      title: "Personal Writing Space",
      content: <NotesSection />,
    },
    {
      id: "wallpaperSelector",
      title: "Theme Selection",
      content: <WallpaperSelector onWallpaperChange={handleWallpaperChange} />,
    },
  ];

  if (loading) {
    return <FancyLoader />;
  }

  return (
    <RoleChecker userRole={user?.role} userEmail={user?.email}>
      <Header profilePic={profilePic} />
      <Layout
        style={{
          minHeight: "100vh",
          backgroundImage: `url(/wallpapers/${wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Layout>
          <Sider
            width={200}
            collapsible
            collapsed={!isSidebarOpen}
            onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
          >
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["dashboard"]}
              onClick={({ key }) => {
                if (key === "logout") {
                  handleLogout();
                } else if (key === "sleep") {
                  handleSleepMode();
                } else {
                  setActiveTab(key);
                }
              }}
            >
              {menuItems.map((item) => (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={item.onClick}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
              backgroundImage: `url(/wallpapers/${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              borderRadius: "0px",
            }}
          >
            <Content>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                {!hasActiveComponents() && <WaitlistMessage />}
                <Title
                  level={2}
                  style={{
                    color: "#fff",
                    margin: "24px 0",
                    fontFamily: "Trebuchet MS",
                    fontWeight: "600",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                    letterSpacing: "1px",
                    textTransform: "capitalize",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    padding: "15px 25px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Welcome, {user?.username || "Employee"}
                </Title>
                {activeTab === "dashboard" && canShowComponent("dashboard") && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="widgets">
                      {(provided) => (
                        <Row
                          gutter={[16, 16]}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {widgets.map((widget, index) => (
                            <Draggable
                              key={widget.id}
                              draggableId={widget.id}
                              index={index}
                            >
                              {(provided) => (
                                <Col
                                  xs={24}
                                  sm={12}
                                  lg={8}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card
                                    title={widget.title}
                                    style={COMMON_STYLES.CARD}
                                  >
                                    {widget.content}
                                  </Card>
                                </Col>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Row>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
                {activeTab === "profile" && canShowComponent("profile") && (
                  <Card
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Avatar
                      size={64}
                      src={
                        getProfilePicUrl(profilePic)
                          ? `${
                              process.env.REACT_APP_API_URL
                            }/uploads/${getProfilePicUrl(profilePic)}`
                          : null
                      }
                      icon={<UserOutlined />}
                    />
                    <input
                      type="file"
                      onChange={handleProfilePicUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                      id="profile-pic-upload"
                    />
                    <label htmlFor="profile-pic-upload">
                      <Button
                        icon={<UploadOutlined />}
                        style={{ marginLeft: 16 }}
                      >
                        Upload Picture
                      </Button>
                    </label>
                    {getProfilePicUrl(profilePic) && (
                      <Button
                        onClick={handleProfilePicDelete}
                        style={{ marginLeft: 16 }}
                      >
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
                        />
                      </Form.Item>
                      <Form.Item
                        label="Email"
                        validateStatus={emailError ? "error" : ""}
                        help={emailError}
                      >
                        <Input value={email} onChange={handleEmailChange} />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" onClick={updateProfile}>
                          Update Profile
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                )}
                {activeTab === "personnelSettings" &&
                  canShowComponent("personnelSettings") && (
                    <Card title="Personnel Settings">
                      <Form
                        form={personnelForm}
                        layout="vertical"
                        onFinish={handlePersonnelSubmit}
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item name="fullName" label="Full Name">
                              <Input />
                            </Form.Item>
                            <Form.Item name="occupation" label="Occupation">
                              <Input />
                            </Form.Item>
                            <Form.Item name="spouseName" label="Spouse Name">
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="spouseOccupation"
                              label="Spouse Occupation"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Phone Number">
                              <Input />
                            </Form.Item>
                            <Form.Item name="cellNo" label="Cell Number">
                              <Input />
                            </Form.Item>
                            <Form.Item name="ssn" label="SSN">
                              <Input />
                            </Form.Item>
                            <Form.Item name="spouseSSN" label="Spouse SSN">
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="dateOfBirth" label="Date of Birth">
                              <DatePicker />
                            </Form.Item>
                            <Form.Item
                              name="spouseDOB"
                              label="Spouse Date of Birth"
                            >
                              <DatePicker />
                            </Form.Item>
                            <Form.Item
                              name="addressLine1"
                              label="Address Line 1"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="addressLine2"
                              label="Address Line 2"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="businessName"
                              label="Business Name"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="businessPhone"
                              label="Business Phone"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="businessAddressLine1"
                              label="Business Address Line 1"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="businessAddressLine2"
                              label="Business Address Line 2"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name="businessEntityType"
                              label="Business Entity Type"
                            >
                              <Select>
                                <Option value="llc">LLC</Option>
                                <Option value="corporation">Corporation</Option>
                                <Option value="partnership">Partnership</Option>
                                <Option value="soleProprietorship">
                                  Sole Proprietorship
                                </Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name="businessTIN" label="Business TIN">
                              <Input />
                            </Form.Item>
                            <Form.Item name="businessSOS" label="Business SOS">
                              <Input />
                            </Form.Item>
                            <Form.Item name="businessEDD" label="Business EDD">
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="businessEmail"
                              label="Business Email"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="contactPersonName"
                              label="Contact Person Name"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name="noOfEmployeesActive"
                              label="Number of Active Employees"
                            >
                              <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item
                              name="businessReferredBy"
                              label="Business Referred By"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              name="accountNumber"
                              label="Account Number"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item name="accountType" label="Account Type">
                              <Select>
                                <Option value="checking">Checking</Option>
                                <Option value="savings">Savings</Option>
                                <Option value="business">Business</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name="accountStatus"
                              label="Account Status"
                            >
                              <Select>
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                                <Option value="suspended">Suspended</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name="employmentStatus"
                              label="Employment Status"
                            >
                              <Select>
                                <Option value="employed">Employed</Option>
                                <Option value="selfEmployed">
                                  Self Employed
                                </Option>
                                <Option value="unemployed">Unemployed</Option>
                                <Option value="retired">Retired</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name="taxFilingStatus"
                              label="Tax Filing Status"
                            >
                              <Select>
                                <Option value="single">Single</Option>
                                <Option value="married">
                                  Married Filing Jointly
                                </Option>
                                <Option value="separate">
                                  Married Filing Separately
                                </Option>
                                <Option value="headOfHousehold">
                                  Head of Household
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="kycStatus" label="KYC Status">
                              <Select>
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name="amlStatus" label="AML Status">
                              <Select>
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name="riskToleranceLevel"
                              label="Risk Tolerance Level"
                            >
                              <Select>
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name="investmentRiskProfile"
                              label="Investment Risk Profile"
                            >
                              <Select>
                                <Option value="conservative">
                                  Conservative
                                </Option>
                                <Option value="moderate">Moderate</Option>
                                <Option value="aggressive">Aggressive</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Save Personnel Information
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}
                {activeTab === "chatCenter" &&
                  canShowComponent("chatCenter") && (
                    <EmployeeChatCenter employeeData={user} />
                  )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <LogoutConfirmModal
        visible={logoutModalVisible}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutModalVisible(false)}
      />
      <SleepMode
        isActive={isSleepMode}
        onExit={() => setIsSleepMode(false)}
        setActiveTab={setActiveTab}
      />
    </RoleChecker>
  );
};

const TaskOfTheDay = () => {
  const [task, setTask] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get("/api/employee/task-of-the-day");
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task of the day:", error);
      }
    };
    fetchTask();
  }, []);

  const completeTask = async () => {
    if (!task) return;

    setCompleting(true);
    try {
      await api.post(`/api/employee/${task._id}/complete`);
      setTask({ ...task, completed: true });
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompleting(false);
    }
  };

  if (!task) return <Spin />;

  return (
    <div>
      <Title level={4}>{task.title}</Title>
      <Text>{task.description}</Text>
      <br />
      <Text type="secondary">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </Text>
      <br />
      <Button
        type="primary"
        icon={<CheckOutlined />}
        onClick={completeTask}
        loading={completing}
        disabled={task.completed}
        style={{ marginTop: 16 }}
      >
        {task.completed ? "Completed" : "Mark as Complete"}
      </Button>
    </div>
  );
};

const EmployeePassbook = () => {
  const [passbook, setPassbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassbook();
  }, []);

  const fetchPassbook = async () => {
    try {
      const response = await api.get("/api/employee/passbook");
      setPassbook(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching passbook:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (!passbook) {
    return <Empty />;
  }

  return (
    <div>
      <Title level={4}>Recent Achievements</Title>
      <List
        dataSource={passbook.achievements}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<TrophyOutlined />} />}
              title={item.title}
              description={item.date}
            />
          </List.Item>
        )}
      />
      <Title level={4}>Support Directory</Title>
      <List
        dataSource={passbook.supportDirectory}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.name}
              description={`${item.role} - ${item.contact}`}
            />
          </List.Item>
        )}
      />
      <Title level={4}>Project Trackers</Title>
      {passbook.projectTrackers.map((project) => (
        <div key={project.id}>
          <Text>{project.name}</Text>
          <Progress percent={project.progress} status="active" />
        </div>
      ))}
    </div>
  );
};

const PersonalWritingSpace = () => {
  const [notes, setNotes] = useState("");

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div>
      <Input.TextArea
        rows={4}
        value={notes}
        onChange={handleNotesChange}
        placeholder="Write your personal notes here..."
      />
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => {
          /* Save notes logic */
        }}
        style={{ marginTop: 16 }}
      >
        Save Notes
      </Button>
    </div>
  );
};

const NotesSection = () => (
  <div style={{ padding: "24px" }}>
    <EmployeeNotesSection />
  </div>
);

export default EmployeeDashboard;
