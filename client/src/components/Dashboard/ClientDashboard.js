import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

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
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Descriptions,
  Table,
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
  UploadOutlined,
  FileTextOutlined,
  InboxOutlined,
  MoonOutlined as SleepOutlined,
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
import moment from "moment";
import ProfileSettings from "../shared/ProfileSettings";
import ClientFinancialOverview from "./ClientFinancialOverview";
import DragAndDropScreen from "../DragAndDropScreen";
import { useEnabledComponents } from "../../hooks/useEnabledComponents";
import LogoutConfirmModal from "../LogoutConfirmModal";
import SleepMode from "../SleepMode/SleepMode";
import { getSocket } from "../../utils/socket";
import WaitlistMessage from "../WaitlistMessage";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

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
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [personnelForm] = Form.useForm();
  const { canShowComponent } = useEnabledComponents(clientData?._id);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    fetchClientData();
    fetchAdminUser();
    fetchForms();
    const checkSleepMode = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setIsSleepMode(response.data.isInSleepMode);
      } catch (error) {
        console.error("Error checking sleep mode:", error);
      }
    };
    checkSleepMode();
  }, []);

  useEffect(() => {
    if (clientData) {
      fetchAssignedForms();
      // Pre-fill personnel form when client data is loaded
      personnelForm.setFieldsValue({
        createdAt: clientData.createdAt ? moment(clientData.createdAt) : null,
        lastLogin: clientData.lastLogin ? moment(clientData.lastLogin) : null,
        resetPasswordToken: clientData.resetPasswordToken,
        resetPasswordExpire: clientData.resetPasswordExpire
          ? moment(clientData.resetPasswordExpire)
          : null,
        assignedManager: clientData.assignedManager,
        assignedClients: clientData.assignedClients,
        firmId: clientData.firmId,
        revenue: clientData.revenue,
        expenses: clientData.expenses,
        employeeSalary: clientData.employeeSalary,
        clientData: clientData.clientData,
        taxCollected: clientData.taxCollected,
        projectCompletion: clientData.projectCompletion,
        complianceStatus: clientData.complianceStatus,
        dateRange: clientData.dateRange
          ? [moment(clientData.dateRange[0]), moment(clientData.dateRange[1])]
          : null,
        fullName: clientData.fullName,
        occupation: clientData.occupation,
        spouseName: clientData.spouseName,
        spouseOccupation: clientData.spouseOccupation,
        phoneNumber: clientData.phoneNumber,
        address: clientData.address,
        dateOfBirth: clientData.dateOfBirth
          ? moment(clientData.dateOfBirth)
          : null,
        cellNo: clientData.cellNo,
        ssn: clientData.ssn,
        spouseSSN: clientData.spouseSSN,
        dob: clientData.dob ? moment(clientData.dob) : null,
        spouseDOB: clientData.spouseDOB ? moment(clientData.spouseDOB) : null,
        addressLine1: clientData.addressLine1,
        addressLine2: clientData.addressLine2,
        howDidYouFindUs: clientData.howDidYouFindUs,
        referredName: clientData.referredName,
        filingStatus: clientData.filingStatus,
        totalDependents: clientData.totalDependents,
        dependents: clientData.dependents,
        accountNumber: clientData.accountNumber,
        accountType: clientData.accountType,
        accountOpeningDate: clientData.accountOpeningDate
          ? moment(clientData.accountOpeningDate)
          : null,
        accountStatus: clientData.accountStatus,
        businessName: clientData.businessName,
        businessPhone: clientData.businessPhone,
        businessAddressLine1: clientData.businessAddressLine1,
        businessAddressLine2: clientData.businessAddressLine2,
        businessEntityType: clientData.businessEntityType,
        businessTIN: clientData.businessTIN,
        businessSOS: clientData.businessSOS,
        businessEDD: clientData.businessEDD,
        businessAccountingMethod: clientData.businessAccountingMethod,
        businessYear: clientData.businessYear,
        businessEmail: clientData.businessEmail,
        contactPersonName: clientData.contactPersonName,
        noOfEmployeesActive: clientData.noOfEmployeesActive,
        businessReferredBy: clientData.businessReferredBy,
        members: clientData.members,
        totalBalance: clientData.totalBalance,
        availableBalance: clientData.availableBalance,
        pendingTransactions: clientData.pendingTransactions,
        creditScore: clientData.creditScore,
        annualIncome: clientData.annualIncome,
        incomeSources: clientData.incomeSources,
        employmentStatus: clientData.employmentStatus,
        taxFilingStatus: clientData.taxFilingStatus,
        lastTaxReturnDate: clientData.lastTaxReturnDate
          ? moment(clientData.lastTaxReturnDate)
          : null,
        outstandingTaxLiabilities: clientData.outstandingTaxLiabilities,
        investments: clientData.investments,
        loans: clientData.loans,
        insurances: clientData.insurances,
        documents: clientData.documents,
        financialGoals: clientData.financialGoals,
        riskToleranceLevel: clientData.riskToleranceLevel,
        investmentRiskProfile: clientData.investmentRiskProfile,
        kycStatus: clientData.kycStatus,
        amlStatus: clientData.amlStatus,
        relatedAccounts: clientData.relatedAccounts,
        serviceRequested: clientData.serviceRequested,
        department: clientData.department,
        position: clientData.position,
        hireDate: clientData.hireDate ? moment(clientData.hireDate) : null,
        company: clientData.company,
        industry: clientData.industry,
        googleId: clientData.googleId,
      });
    }
  }, [clientData]);

  const handlePersonnelSubmit = async (values) => {
    try {
      const response = await api.put(
        `/api/users/client-personal-info/${clientData._id}`,
        values
      );
      setClientData(response.data);
      alert("Personnel information updated successfully");
    } catch (error) {
      console.error("Error updating personnel information:", error);
      alert("Failed to update personnel information");
    }
  };

  useEffect(() => {
    if (clientData) {
      fetchAssignedForms();
    }
  }, [clientData]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
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

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
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

  const handleSleepMode = async () => {
    try {
      await api.put("/api/users/sleep-mode", { isInSleepMode: true });
      setIsSleepMode(true);
    } catch (error) {
      console.error("Error activating sleep mode:", error);
    }
  };

  const hasActiveComponents = () => {
    return (
      activeTab === "dashboard" && canShowComponent("dashboard") ||
      activeTab === "submitInformation" && canShowComponent("submitInformation") ||
      activeTab === "notesAndSignatures" && canShowComponent("notesAndSignatures") ||
      activeTab === "fileTransfer" && canShowComponent("fileTransfer") ||
      activeTab === "forms" && canShowComponent("forms") ||
      activeTab === "chat" && canShowComponent("chat") ||
      activeTab === "financialInformation" && canShowComponent("financialInformation") ||
      activeTab === "personnelSettings" && canShowComponent("personnelSettings")
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "notesAndSignatures",
      icon: <FileTextOutlined />,
      label: "Notes & Signatures",
    },
    { key: "dragAndDrop", icon: <InboxOutlined />, label: "File Transfer" },
    { key: "forms", icon: <FileOutlined />, label: "Forms" },
    { key: "chat", icon: <MessageOutlined />, label: "Chat" },
    {
      key: "financialInfo",
      icon: <DollarOutlined />,
      label: "Financial Information",
    },
    {
      key: "personnelSettings",
      icon: <UserOutlined />,
      label: "Personnel Settings",
    },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    { key: "sleep", icon: <SleepOutlined />, label: "Sleep Mode" },
  ].filter((item) => {
    if (item.key === "logout" || item.key === "sleep") return true;
    return canShowComponent(item.key);
  });

  return (
    <RoleChecker userRole={clientData?.role} userEmail={clientData?.email}>
      <Header profilePic={profilePic} />
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider
            collapsible
            collapsed={!isSidebarOpen}
            onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
            style={{
              background: "#001529",
              boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
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
                  handleSleepMode();
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
          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                {!hasActiveComponents() && <WaitlistMessage />}
                {activeTab === "dashboard" &&
                  clientData &&
                  canShowComponent("dashboard") && (
                    <div>
                      <Title level={2}>Welcome, {clientData.username}</Title>
                      <ClientFinancialOverview clientData={clientData} />
                      <ProfileSettings
                        userData={clientData}
                        onUpdate={(updatedData) => setClientData(updatedData)}
                      />
                    </div>
                  )}

                {activeTab === "notesAndSignatures" &&
                  clientData &&
                  canShowComponent("notesAndSignatures") && (
                    <div className="notes-and-signatures">
                      <Notes userId={clientData._id} />
                      <Signatures userId={clientData._id} />
                    </div>
                  )}
                {activeTab === "dragAndDrop" &&
                  clientData &&
                  canShowComponent("dragAndDrop") && (
                    <div className="drag-and-drop-section">
                      <Title level={3}>File Transfer</Title>
                      <DragAndDropScreen userRole="client" />
                    </div>
                  )}
                {activeTab === "forms" &&
                  clientData &&
                  canShowComponent("forms") && (
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
                {activeTab === "chat" &&
                  clientData &&
                  canShowComponent("chat") && (
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
                                      unreadCounts[
                                        clientData.assignedManager._id
                                      ]
                                    }
                                  />
                                )}
                              </Button>
                            )}
                            {adminUser && (
                              <Button
                                onClick={() => handleChatSelect(adminUser)}
                                type={
                                  openChats[adminUser._id]
                                    ? "primary"
                                    : "default"
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
                            {Object.entries(openChats).map(
                              ([userId, isOpen]) => {
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
                                    visible={true}
                                  />
                                );
                              }
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )}
                {activeTab === "financialInfo" &&
                  clientData &&
                  canShowComponent("financialInfo") && (
                    <>
                      <FinancialInfoSection clientId={clientData._id} />
                    </>
                  )}
                {activeTab === "personnelSettings" &&
                  clientData &&
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
      </Layout>
    </RoleChecker>
  );
};

export default ClientDashboard;
