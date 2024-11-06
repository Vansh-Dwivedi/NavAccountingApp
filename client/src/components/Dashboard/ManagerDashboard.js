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
  Input,
  Select,
  Button,
  Tooltip,
  Drawer,
  Space,
  Image,
  Divider,
  Descriptions,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  FileOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SearchOutlined,
  FilterOutlined,
  SendOutlined,
  MessageOutlined,
  FormOutlined,
  CloseOutlined,
  DownloadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import ChatComponent from "../Chat/ChatComponent";
import Header from "../Header";
import NotificationBubble from "../NotificationBubble";
import ReactPaginate from "react-paginate";
import InputForm from "../InputForm";
import "antd/dist/reset.css";
import FinancialInfoSection from "./FinancialInfoSection";
import RoleChecker from "../../Authentication/main";
import DragAndDropScreen from "../DragAndDropScreen";
import { getProfilePicUrl } from "../../utils/profilePicHelper";
import ProfileSettings from "../shared/ProfileSettings";
import FinancialMetrics from "../shared/FinancialMetrics";
import ClientInfoDisplay from "../shared/ClientInfoDisplay";
import moment from "moment";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ManagerDashboard = () => {
  const [managerData, setManagerData] = useState(null);
  const [assignedClients, setAssignedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(null);
  const [openChats, setOpenChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedForms, setSavedForms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formSearchTerm, setFormSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [formsPerPage] = useState(10);
  const [chatPage, setChatPage] = useState(1);
  const messagesPerPage = 20;
  const [clientDrawerVisible, setClientDrawerVisible] = useState(false);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [personnelForm] = Form.useForm();

  const fetchFormSubmissionsWithStructure = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/form-submissions`);
      setFormSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerData();
    fetchAdminUser();
    fetchSavedForms();
    fetchCategories();
    fetchFormSubmissions();
    fetchSentForms();
    fetchAssignedClients();

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

  useEffect(() => {
    if (managerData) {
      // Pre-fill personnel form when client data is loaded
      personnelForm.setFieldsValue({
        createdAt: managerData.createdAt ? moment(managerData.createdAt) : null,
        lastLogin: managerData.lastLogin ? moment(managerData.lastLogin) : null,
        resetPasswordToken: managerData.resetPasswordToken,
        resetPasswordExpire: managerData.resetPasswordExpire
          ? moment(managerData.resetPasswordExpire)
          : null,
        assignedManager: managerData.assignedManager,
        assignedClients: managerData.assignedClients,
        firmId: managerData.firmId,
        revenue: managerData.revenue,
        expenses: managerData.expenses,
        employeeSalary: managerData.employeeSalary,
        managerData: managerData.managerData,
        taxCollected: managerData.taxCollected,
        projectCompletion: managerData.projectCompletion,
        complianceStatus: managerData.complianceStatus,
        dateRange: managerData.dateRange
          ? [moment(managerData.dateRange[0]), moment(managerData.dateRange[1])]
          : null,
        fullName: managerData.fullName,
        occupation: managerData.occupation,
        spouseName: managerData.spouseName,
        spouseOccupation: managerData.spouseOccupation,
        phoneNumber: managerData.phoneNumber,
        address: managerData.address,
        dateOfBirth: managerData.dateOfBirth
          ? moment(managerData.dateOfBirth)
          : null,
        cellNo: managerData.cellNo,
        ssn: managerData.ssn,
        spouseSSN: managerData.spouseSSN,
        dob: managerData.dob ? moment(managerData.dob) : null,
        spouseDOB: managerData.spouseDOB ? moment(managerData.spouseDOB) : null,
        addressLine1: managerData.addressLine1,
        addressLine2: managerData.addressLine2,
        howDidYouFindUs: managerData.howDidYouFindUs,
        referredName: managerData.referredName,
        filingStatus: managerData.filingStatus,
        totalDependents: managerData.totalDependents,
        dependents: managerData.dependents,
        accountNumber: managerData.accountNumber,
        accountType: managerData.accountType,
        accountOpeningDate: managerData.accountOpeningDate
          ? moment(managerData.accountOpeningDate)
          : null,
        accountStatus: managerData.accountStatus,
        businessName: managerData.businessName,
        businessPhone: managerData.businessPhone,
        businessAddressLine1: managerData.businessAddressLine1,
        businessAddressLine2: managerData.businessAddressLine2,
        businessEntityType: managerData.businessEntityType,
        businessTIN: managerData.businessTIN,
        businessSOS: managerData.businessSOS,
        businessEDD: managerData.businessEDD,
        businessAccountingMethod: managerData.businessAccountingMethod,
        businessYear: managerData.businessYear,
        businessEmail: managerData.businessEmail,
        contactPersonName: managerData.contactPersonName,
        noOfEmployeesActive: managerData.noOfEmployeesActive,
        businessReferredBy: managerData.businessReferredBy,
        members: managerData.members,
        totalBalance: managerData.totalBalance,
        availableBalance: managerData.availableBalance,
        pendingTransactions: managerData.pendingTransactions,
        creditScore: managerData.creditScore,
        annualIncome: managerData.annualIncome,
        incomeSources: managerData.incomeSources,
        employmentStatus: managerData.employmentStatus,
        taxFilingStatus: managerData.taxFilingStatus,
        lastTaxReturnDate: managerData.lastTaxReturnDate
          ? moment(managerData.lastTaxReturnDate)
          : null,
        outstandingTaxLiabilities: managerData.outstandingTaxLiabilities,
        investments: managerData.investments,
        loans: managerData.loans,
        insurances: managerData.insurances,
        documents: managerData.documents,
        financialGoals: managerData.financialGoals,
        riskToleranceLevel: managerData.riskToleranceLevel,
        investmentRiskProfile: managerData.investmentRiskProfile,
        kycStatus: managerData.kycStatus,
        amlStatus: managerData.amlStatus,
        relatedAccounts: managerData.relatedAccounts,
        serviceRequested: managerData.serviceRequested,
        department: managerData.department,
        position: managerData.position,
        hireDate: managerData.hireDate ? moment(managerData.hireDate) : null,
        company: managerData.company,
        industry: managerData.industry,
        googleId: managerData.googleId,
      });
    }
  }, [managerData]);

  useEffect(() => {
    if (selectedClient && selectedClient.client._id) {
      fetchFormSubmissionsWithStructure(selectedClient.client._id);
    }
  }, [selectedClient]);

  const fetchFormSubmissions = async () => {
    try {
      const response = await api.get("/api/forms/submissions");
      setFormSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    }
  };

  const fetchSentForms = async () => {
    try {
      const response = await api.get("/api/forms/sent");
      setSentForms(response.data);
    } catch (error) {
      console.error("Error fetching sent forms:", error);
    }
  };

  const fetchClientData = async (clientId) => {
    try {
      const response = await api.get(`/api/users/${clientId}/data`);
      setSelectedClient(response.data);
      setClientDrawerVisible(true);
    } catch (error) {
      console.error("Error fetching client data:", error);
      setError("Failed to fetch client data");
    }
  };

  const fetchManagerData = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setManagerData(response.data);
      const orgprofilepic = getProfilePicUrl(profilePic);
      const mainData = response.data.orgprofilepic;
      setProfilePic(mainData);
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

  const fetchSavedForms = async () => {
    try {
      const response = await api.get("/api/forms/saved");
      setSavedForms(response.data);
    } catch (error) {
      console.error("Error fetching saved forms:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleClientSelect = async (client) => {
    try {
      const [clientData, formSubmissions, chatMessages] = await Promise.all([
        api.get(`/api/users/${client._id}/data`),
        api.get(`/api/users/${client._id}/form-submissions`),
        api.get(`/api/users/${client._id}/chat-messages`),
      ]);
      setSelectedClient({
        ...clientData.data,
        formSubmissions: formSubmissions.data,
        chatMessages: chatMessages.data,
      });
      setClientDrawerVisible(true);
    } catch (error) {
      console.error("Error fetching client data:", error);
      message.error("Failed to fetch client data");
    }
  };

  const handleCloseChat = (clientId) => {
    setOpenChats((prevChats) => {
      const newChats = { ...prevChats };
      delete newChats[clientId];
      return newChats;
    });
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    localStorage.removeItem("token");
    navigate("/login");
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

  const handleSendForm = async (formId, clientId) => {
    if (!clientId) {
      alert("Please select a client.");
      return;
    }

    const client = assignedClients.find((c) => c._id === clientId);
    const clientUsername = client ? client.username : "Unknown Client";

    const confirmed = window.confirm(
      `Are you sure you want to send this form to ${clientUsername}?`
    );
    if (!confirmed) return;

    try {
      await api.post(`/api/forms/sendto/${clientId}`, { formId });
      alert("Form sent successfully");
    } catch (error) {
      console.error("Error sending form:", error);
      alert("Error sending form. Please try again.");
    }
  };

  const handleFormSearchChange = (event) => {
    setFormSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(0);
  };

  const handleClientSearchChange = (event) => {
    setClientSearchTerm(event.target.value);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const filteredForms = savedForms.filter(
    (form) =>
      (selectedCategory === "" || form.category === selectedCategory) &&
      form.title.toLowerCase().includes(formSearchTerm.toLowerCase())
  );

  const filteredClients = assignedClients.filter((client) =>
    client.username.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const paginatedForms = filteredForms.slice(
    currentPage * formsPerPage,
    (currentPage + 1) * formsPerPage
  );

  const renderClientInfo = () => {
    if (!selectedClient) return null;

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={getProfilePicUrl(selectedClient.client.profilePic)}
          />
          <Title level={4} style={{ marginTop: "10px" }}>
            {selectedClient.client.fullName}
          </Title>
        </div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Personal Info" key="1">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Email">
                {selectedClient.client.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedClient.client.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Cell">
                {selectedClient.client.cellNo}
              </Descriptions.Item>
              <Descriptions.Item label="SSN">
                {selectedClient.client.ssn}
              </Descriptions.Item>
              <Descriptions.Item label="DOB">
                {selectedClient.client.dateOfBirth &&
                  new Date(
                    selectedClient.client.dateOfBirth
                  ).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedClient.client.addressLine1}{" "}
                {selectedClient.client.addressLine2}
              </Descriptions.Item>
              <Descriptions.Item label="Filing Status">
                {selectedClient.client.filingStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Total Dependents">
                {selectedClient.client.totalDependents}
              </Descriptions.Item>
              <Descriptions.Item label="Spouse Name">
                {selectedClient.client.spouseName}
              </Descriptions.Item>
              <Descriptions.Item label="Spouse SSN">
                {selectedClient.client.spouseSSN}
              </Descriptions.Item>
              <Descriptions.Item label="Spouse DOB">
                {selectedClient.client.spouseDOB &&
                  new Date(
                    selectedClient.client.spouseDOB
                  ).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Business Info" key="2">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Business Name">
                {selectedClient.client.businessName}
              </Descriptions.Item>
              <Descriptions.Item label="Business Phone">
                {selectedClient.client.businessPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Business Address">
                {selectedClient.client.businessAddressLine1}{" "}
                {selectedClient.client.businessAddressLine2}
              </Descriptions.Item>
              <Descriptions.Item label="Business Entity Type">
                {selectedClient.client.businessEntityType}
              </Descriptions.Item>
              <Descriptions.Item label="Business TIN">
                {selectedClient.client.businessTIN}
              </Descriptions.Item>
              <Descriptions.Item label="Business SOS">
                {selectedClient.client.businessSOS}
              </Descriptions.Item>
              <Descriptions.Item label="Business EDD">
                {selectedClient.client.businessEDD}
              </Descriptions.Item>
              <Descriptions.Item label="Accounting Method">
                {selectedClient.client.businessAccountingMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Business Year">
                {selectedClient.client.businessYear}
              </Descriptions.Item>
              <Descriptions.Item label="Business Email">
                {selectedClient.client.businessEmail}
              </Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Financial Info" key="3">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Total Balance">
                {selectedClient.client.totalBalance}
              </Descriptions.Item>
              <Descriptions.Item label="Available Balance">
                {selectedClient.client.availableBalance}
              </Descriptions.Item>
              <Descriptions.Item label="Credit Score">
                {selectedClient.client.creditScore}
              </Descriptions.Item>
              <Descriptions.Item label="Annual Income">
                {selectedClient.client.annualIncome}
              </Descriptions.Item>
              <Descriptions.Item label="Employment Status">
                {selectedClient.client.employmentStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Tax Filing Status">
                {selectedClient.client.taxFilingStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Last Tax Return">
                {selectedClient.client.lastTaxReturnDate &&
                  new Date(
                    selectedClient.client.lastTaxReturnDate
                  ).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Outstanding Tax">
                {selectedClient.client.outstandingTaxLiabilities}
              </Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Form Submissions" key="5">
            <List
              dataSource={formSubmissions}
              renderItem={(submission) => (
                <Card
                  title={submission.formStructure.title || "Untitled Form"}
                  style={{ marginBottom: 16 }}
                >
                  <p>
                    <strong>Status:</strong> {submission.status}
                  </p>
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleString()
                      : "Not submitted yet"}
                  </p>
                  <Divider orientation="left">Responses</Divider>
                  {submission.responses.map((response, index) => (
                    <div key={index}>
                      <p>
                        <strong>{response.fieldLabel}:</strong>
                      </p>
                      {response.value === "digitalSignature" ? (
                        <Image
                          width={200}
                          src={response.value}
                          alt="Digital Signature"
                        />
                      ) : typeof response.value === "object" ? (
                        <pre>{JSON.stringify(response.value, null, 2)}</pre>
                      ) : (
                        <p>{response.value || "No response"}</p>
                      )}
                      {response.value === "file" && (
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          size="small"
                          onClick={() => handleDownload(response.file)}
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </Card>
              )}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chat Messages" key="6">
            <div
              style={{
                maxHeight: "800px",
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#1890ff #f0f0f0",
              }}
            >
              {selectedClient.chatMessages
                .slice(
                  (chatPage - 1) * messagesPerPage,
                  chatPage * messagesPerPage
                )
                .map((message, index) => (
                  <React.Fragment key={index}>
                    <Card
                      key={index}
                      style={{
                        textAlign:
                          message.sender === selectedClient.client._id
                            ? "left"
                            : "right",
                        backgroundColor:
                          message.sender === selectedClient.client._id
                            ? "rgba(240, 240, 240, 0.8)"
                            : "rgba(230, 247, 255, 0.8)",
                        margin: "10px 0",
                        borderRadius: "20px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Typography.Text
                          strong
                          style={{
                            fontSize: "1.1em",
                            color:
                              message.sender === selectedClient.client._id
                                ? "#1890ff"
                                : "#52c41a",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          {message.sender === selectedClient.client._id
                            ? "Client"
                            : "Manager"}
                        </Typography.Text>
                        <Typography.Paragraph
                          style={{
                            fontSize: "1em",
                            lineHeight: "1.5",
                            color: "rgba(0, 0, 0, 0.85)",
                          }}
                        >
                          {message.content}
                        </Typography.Paragraph>
                        {message.file && (
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="small"
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/${message.file.path}`,
                                "_blank"
                              )
                            }
                            style={{
                              backgroundColor: "#1890ff",
                              border: "none",
                              borderRadius: "15px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            Download {message.file.filename.slice(0, 10)}...
                          </Button>
                        )}
                        <Typography.Text
                          type="secondary"
                          style={{
                            fontSize: "0.8em",
                            alignSelf: "flex-end",
                            fontStyle: "italic",
                            color: "rgba(0, 0, 0, 0.45)",
                          }}
                        >
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography.Text>
                      </Space>
                    </Card>
                    <hr
                      style={{
                        margin: "50px 0",
                        border: "none",
                        borderTop: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  </React.Fragment>
                ))}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pagination
                current={chatPage}
                total={selectedClient.chatMessages.length}
                pageSize={messagesPerPage}
                onChange={(page) => setChatPage(page)}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Financial Data Input" key="7">
            <InputForm clientId={selectedClient.client._id} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  };

  const handlePersonnelSubmit = async (values) => {
    try {
      const response = await api.put(
        `/api/users/manager-personal-info/${managerData._id}`,
        values
      );
      setManagerData(response.data);
      message.success("Personnel information updated successfully");
    } catch (error) {
      console.error("Error updating personnel information:", error);
      message.error("Failed to update personnel information");
    }
  };

  const handleFinancialDataUpdate = async (values) => {
    try {
      await api.put(`/api/users/${selectedClient._id}/financial-data`, values);
      message.success("Financial data updated successfully");
      fetchClientData(selectedClient._id);
    } catch (error) {
      console.error("Error updating financial data:", error);
      message.error("Failed to update financial data");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!managerData) return <div className="loading">Loading...</div>;

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "chat", icon: <MessageOutlined />, label: "Chat" },
    { key: "adminChat", icon: <MessageOutlined />, label: "Chat with Admin" },
    { key: "clientData", icon: <UserOutlined />, label: "Client Data" },
    { key: "forms", icon: <FileOutlined />, label: "Forms" },
    { key: "dragAndDrop", icon: <InboxOutlined />, label: "File Transfer" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    {
      key: "personnelSettings",
      icon: <UserOutlined />,
      label: "Personnel Settings",
    },
  ];

  return (
    <RoleChecker userRole={managerData.role} userEmail={managerData.email}>
      <Layout style={{ minHeight: "100vh", marginTop: "60px" }}>
        <Sider
          collapsible
          collapsed={!isSidebarOpen}
          onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
          style={{
            background: "#001529",
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          }}
        >
          <div className="logo" />
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
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header />
          <Content style={{ margin: "0 16px" }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              <Title level={2}>Manager Dashboard</Title>
              <NotificationBubble userId={managerData._id} />

              {activeTab === "dashboard" && (
                <div>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Assigned Clients"
                          value={assignedClients.length}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Unread Messages"
                          value={Object.values(unreadCounts).reduce(
                            (a, b) => a + b,
                            0
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Saved Forms"
                          value={savedForms.length}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <ProfileSettings
                    userData={managerData}
                    onUpdate={(updatedData) => setManagerData(updatedData)}
                  />
                </div>
              )}

              {activeTab === "chat" && (
                <div className="chat-section">
                  <Title level={3}>Chat with Clients</Title>
                  <List
                    dataSource={assignedClients}
                    renderItem={(client) => (
                      <List.Item
                        key={client._id}
                        onClick={() => handleClientSelect(client)}
                        style={{ cursor: "pointer" }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={client.username}
                          description={`Unread: ${
                            unreadCounts[client._id] || 0
                          }`}
                        />
                      </List.Item>
                    )}
                  />
                  {Object.entries(openChats).map(([clientId, isOpen]) => {
                    if (!isOpen) return null;
                    const client = assignedClients.find(
                      (c) => c._id === clientId
                    );
                    if (!client) return null;
                    return (
                      <Card key={clientId} style={{ marginTop: 16 }}>
                        <ChatComponent
                          currentUser={managerData}
                          otherUser={client}
                          onClose={() => handleCloseChat(clientId)}
                          chatId={`${managerData._id}-${client._id}`}
                          visible={true}
                        />
                      </Card>
                    );
                  })}
                </div>
              )}

              {activeTab === "adminChat" && adminUser && (
                <Card>
                  <ChatComponent
                    currentUser={managerData}
                    otherUser={adminUser}
                    onClose={() => setActiveTab("dashboard")}
                    visible={true}
                  />
                </Card>
              )}

              {activeTab === "forms" && (
                <div className="forms-section">
                  <Title level={3}>Saved Forms</Title>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search forms..."
                        value={formSearchTerm}
                        onChange={handleFormSearchChange}
                      />
                    </Col>
                    <Col span={8}>
                      <Select
                        style={{ width: "100%" }}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        placeholder="Select category"
                      >
                        <Option value="">All Categories</Option>
                        {categories.map((category) => (
                          <Option key={category._id} value={category._id}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search clients..."
                        value={clientSearchTerm}
                        onChange={handleClientSearchChange}
                      />
                    </Col>
                  </Row>
                  <List
                    dataSource={paginatedForms}
                    renderItem={(form) => (
                      <List.Item>
                        <List.Item.Meta
                          title={form.title}
                          description={getCategoryName(form.category)}
                        />
                        <Select
                          style={{ width: 200 }}
                          placeholder="Select client"
                          onChange={(value) => handleSendForm(form._id, value)}
                        >
                          {filteredClients.map((client) => (
                            <Option key={client._id} value={client._id}>
                              {client.username}
                            </Option>
                          ))}
                        </Select>
                      </List.Item>
                    )}
                  />
                  <Pagination
                    current={currentPage + 1}
                    total={filteredForms.length}
                    pageSize={formsPerPage}
                    onChange={(page) => setCurrentPage(page - 1)}
                    style={{ marginTop: 16, textAlign: "center" }}
                  />
                </div>
              )}
              {activeTab === "clientData" && (
                <div className="client-data-section">
                  <Title level={3}>Client Data</Title>
                  <Select
                    style={{ width: "100%", marginBottom: 16 }}
                    placeholder="Select a client"
                    onChange={(value) => fetchClientData(value)}
                  >
                    {assignedClients.map((client) => (
                      <Option key={client._id} value={client._id}>
                        {client.username}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
              {activeTab === "dragAndDrop" && (
                <div className="drag-and-drop-section">
                  <Title level={3}>File Transfer</Title>
                  <DragAndDropScreen userRole="manager" />
                </div>
              )}
              {activeTab === "personnelSettings" && (
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
                        <Form.Item name="addressLine1" label="Address Line 1">
                          <Input />
                        </Form.Item>
                        <Form.Item name="addressLine2" label="Address Line 2">
                          <Input />
                        </Form.Item>
                        <Form.Item name="businessName" label="Business Name">
                          <Input />
                        </Form.Item>
                        <Form.Item name="businessPhone" label="Business Phone">
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
                        <Form.Item name="businessEmail" label="Business Email">
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
                        <Form.Item name="accountNumber" label="Account Number">
                          <Input />
                        </Form.Item>
                        <Form.Item name="accountType" label="Account Type">
                          <Select>
                            <Option value="checking">Checking</Option>
                            <Option value="savings">Savings</Option>
                            <Option value="business">Business</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item name="accountStatus" label="Account Status">
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
                            <Option value="selfEmployed">Self Employed</Option>
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
                            <Option value="conservative">Conservative</Option>
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
            </div>
          </Content>
        </Layout>
        <Drawer
          width={720}
          placement="right"
          closable={true}
          onClose={() => {
            setClientDrawerVisible(false);
            setSelectedClient(null);
          }}
          visible={clientDrawerVisible}
          closeIcon={<CloseOutlined style={{ fontSize: "18px" }} />}
          headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
          bodyStyle={{ padding: "24px" }}
        >
          {selectedClient && (
            <>
              <FinancialMetrics
                data={selectedClient.client}
                userId={selectedClient.client._id}
                isManager={true}
                onDataUpdate={(updatedData) => {
                  setSelectedClient((prev) => ({
                    ...prev,
                    client: {
                      ...prev.client,
                      ...updatedData,
                    },
                  }));
                }}
              />
              <ClientInfoDisplay
                clientData={selectedClient.client}
                handleFinancialDataUpdate={handleFinancialDataUpdate}
                loading={loading}
              />
            </>
          )}
        </Drawer>
      </Layout>
    </RoleChecker>
  );
};

export default ManagerDashboard;
