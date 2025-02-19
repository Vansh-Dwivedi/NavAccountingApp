import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import FancyLoader from '../common/FancyLoader';

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
  Popconfirm,
  Descriptions,
  Tag,
  Table,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  FileOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MoonOutlined as SleepOutlined,
  EditOutlined,
  UploadOutlined,
  TeamOutlined,
  InboxOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import AuditLogs from "../AuditLogs";
import Header from "../Header";
import FormSubmissionPage from "../FormSubmissionPage";
import MakeFormTab from "../MakeFormTab";
import FormsTab from "../FormsTab";
import CategoriesTab from "../CategoriesTab";
import UserManagement from "../Admin/UserManagement";
import io from "socket.io-client";
import AdminEmployeeDashboard from "./AdminEmployeeDashboard";
import DragAndDropScreen from "../DragAndDropScreen";
import { getProfilePicUrl } from "../../utils/profilePicHelper";
import moment from "moment";
import ProfileSettings from "../shared/ProfileSettings";
import DashboardManager from "../Admin/DashboardManager";
import LogoutConfirmModal from "../LogoutConfirmModal";
import SleepMode from "../SleepMode/SleepMode";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [savedForms, setSavedForms] = useState([]);
  const [activeFormsTab, setActiveFormsTab] = useState("forms");
  const [selectedClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [email, setEmail] = useState(adminData?.email || "");
  const [username, setUsername] = useState(adminData?.username || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [personnelForm] = Form.useForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

    const checkSleepMode = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setIsSleepMode(response.data.isInSleepMode);
      } catch (error) {
        console.error("Error checking sleep mode:", error);
      }
    };
    checkSleepMode();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (adminData) {
      // Pre-fill personnel form when client data is loaded
      personnelForm.setFieldsValue({
        createdAt: adminData.createdAt ? moment(adminData.createdAt) : null,
        lastLogin: adminData.lastLogin ? moment(adminData.lastLogin) : null,
        resetPasswordToken: adminData.resetPasswordToken,
        resetPasswordExpire: adminData.resetPasswordExpire
          ? moment(adminData.resetPasswordExpire)
          : null,
        assignedManager: adminData.assignedManager,
        assignedClients: adminData.assignedClients,
        firmId: adminData.firmId,
        revenue: adminData.revenue,
        expenses: adminData.expenses,
        employeeSalary: adminData.employeeSalary,
        adminData: adminData.adminData,
        taxCollected: adminData.taxCollected,
        projectCompletion: adminData.projectCompletion,
        complianceStatus: adminData.complianceStatus,
        dateRange: adminData.dateRange
          ? [moment(adminData.dateRange[0]), moment(adminData.dateRange[1])]
          : null,
        fullName: adminData.fullName,
        occupation: adminData.occupation,
        spouseName: adminData.spouseName,
        spouseOccupation: adminData.spouseOccupation,
        phoneNumber: adminData.phoneNumber,
        address: adminData.address,
        dateOfBirth: adminData.dateOfBirth
          ? moment(adminData.dateOfBirth)
          : null,
        cellNo: adminData.cellNo,
        ssn: adminData.ssn,
        spouseSSN: adminData.spouseSSN,
        dob: adminData.dob ? moment(adminData.dob) : null,
        spouseDOB: adminData.spouseDOB ? moment(adminData.spouseDOB) : null,
        addressLine1: adminData.addressLine1,
        addressLine2: adminData.addressLine2,
        howDidYouFindUs: adminData.howDidYouFindUs,
        referredName: adminData.referredName,
        filingStatus: adminData.filingStatus,
        totalDependents: adminData.totalDependents,
        dependents: adminData.dependents,
        accountNumber: adminData.accountNumber,
        accountType: adminData.accountType,
        accountOpeningDate: adminData.accountOpeningDate
          ? moment(adminData.accountOpeningDate)
          : null,
        accountStatus: adminData.accountStatus,
        businessName: adminData.businessName,
        businessPhone: adminData.businessPhone,
        businessAddressLine1: adminData.businessAddressLine1,
        businessAddressLine2: adminData.businessAddressLine2,
        businessEntityType: adminData.businessEntityType,
        businessTIN: adminData.businessTIN,
        businessSOS: adminData.businessSOS,
        businessEDD: adminData.businessEDD,
        businessAccountingMethod: adminData.businessAccountingMethod,
        businessYear: adminData.businessYear,
        businessEmail: adminData.businessEmail,
        contactPersonName: adminData.contactPersonName,
        noOfEmployeesActive: adminData.noOfEmployeesActive,
        businessReferredBy: adminData.businessReferredBy,
        members: adminData.members,
        totalBalance: adminData.totalBalance,
        availableBalance: adminData.availableBalance,
        pendingTransactions: adminData.pendingTransactions,
        creditScore: adminData.creditScore,
        annualIncome: adminData.annualIncome,
        incomeSources: adminData.incomeSources,
        employmentStatus: adminData.employmentStatus,
        taxFilingStatus: adminData.taxFilingStatus,
        lastTaxReturnDate: adminData.lastTaxReturnDate
          ? moment(adminData.lastTaxReturnDate)
          : null,
        outstandingTaxLiabilities: adminData.outstandingTaxLiabilities,
        investments: adminData.investments,
        loans: adminData.loans,
        insurances: adminData.insurances,
        documents: adminData.documents,
        financialGoals: adminData.financialGoals,
        riskToleranceLevel: adminData.riskToleranceLevel,
        investmentRiskProfile: adminData.investmentRiskProfile,
        kycStatus: adminData.kycStatus,
        amlStatus: adminData.amlStatus,
        relatedAccounts: adminData.relatedAccounts,
        serviceRequested: adminData.serviceRequested,
        department: adminData.department,
        position: adminData.position,
        hireDate: adminData.hireDate ? moment(adminData.hireDate) : null,
        company: adminData.company,
        industry: adminData.industry,
        googleId: adminData.googleId,
      });
    }
  }, [adminData]);

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
      const profilePicUrl = getProfilePicUrl(response.data.profilePic);
      setProfilePic(profilePicUrl);
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

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const toggleSleepMode = () => {
    setIsSleepMode(!isSleepMode);
    setPassword("");
  };

  const handlePersonnelSubmit = async (values) => {
    try {
      const response = await api.put(
        `/api/users/admin-personal-info/${adminData._id}`,
        values
      );
      setAdminData(response.data);
      message.success("Personnel information updated successfully");
    } catch (error) {
      console.error("Error updating personnel information:", error);
      message.error("Failed to update personnel information");
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

  if (loading) return <FancyLoader />;
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
    {
      key: "personnelSettings",
      icon: <UserOutlined />,
      label: "Personnel Settings",
    },
    {
      key: "dashboardManager",
      icon: <AppstoreOutlined />,
      label: "Dashboard Manager",
    },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    {
      key: "sleep",
      icon: <SleepOutlined />,
      label: "Sleep Mode",
      onClick: handleSleepMode,
    },
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
      message.success("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      message.error("Error uploading profile picture. Please try again.");
    }
  };

  const handleProfilePicDelete = async () => {
    try {
      await api.delete("/api/users/profile-pic");
      setProfilePic(null);
      message.success("Profile picture deleted successfully");
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      message.error("Error deleting profile picture. Please try again.");
    }
  };

  const renderUserDetails = (user) => {
    if (!user) return null;

    return (
      <Card title="User Details" style={{ marginTop: 16 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {user.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="SSN">{user.ssn}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {user.dateOfBirth &&
              new Date(user.dateOfBirth).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {user.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Cell Number">
            {user.cellNo}
          </Descriptions.Item>
          <Descriptions.Item label="Address Line 1">
            {user.addressLine1}
          </Descriptions.Item>
          <Descriptions.Item label="Address Line 2">
            {user.addressLine2}
          </Descriptions.Item>
          <Descriptions.Item label="Filing Status">
            {user.filingStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Total Dependents">
            {user.totalDependents}
          </Descriptions.Item>
          <Descriptions.Item label="How Did You Find Us">
            {user.howDidYouFindUs}
          </Descriptions.Item>
          <Descriptions.Item label="Referred By">
            {user.referredName}
          </Descriptions.Item>

          <Descriptions.Item label="Spouse Name">
            {user.spouseName}
          </Descriptions.Item>
          <Descriptions.Item label="Spouse SSN">
            {user.spouseSSN}
          </Descriptions.Item>
          <Descriptions.Item label="Spouse DOB">
            {user.spouseDOB && new Date(user.spouseDOB).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Spouse Occupation">
            {user.spouseOccupation}
          </Descriptions.Item>

          <Descriptions.Item label="Business Name">
            {user.businessName}
          </Descriptions.Item>
          <Descriptions.Item label="Business Phone">
            {user.businessPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Business Email">
            {user.businessEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Business Address 1">
            {user.businessAddressLine1}
          </Descriptions.Item>
          <Descriptions.Item label="Business Address 2">
            {user.businessAddressLine2}
          </Descriptions.Item>
          <Descriptions.Item label="Business Entity Type">
            {user.businessEntityType}
          </Descriptions.Item>
          <Descriptions.Item label="Business TIN">
            {user.businessTIN}
          </Descriptions.Item>
          <Descriptions.Item label="Business SOS">
            {user.businessSOS}
          </Descriptions.Item>
          <Descriptions.Item label="Business EDD">
            {user.businessEDD}
          </Descriptions.Item>
          <Descriptions.Item label="Business Year">
            {user.businessYear}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Person">
            {user.contactPersonName}
          </Descriptions.Item>
          <Descriptions.Item label="Active Employees">
            {user.noOfEmployeesActive}
          </Descriptions.Item>

          <Descriptions.Item label="Account Status">
            {user.accountStatus}
          </Descriptions.Item>
          <Descriptions.Item label="KYC Status">
            {user.kycStatus}
          </Descriptions.Item>
          <Descriptions.Item label="AML Status">
            {user.amlStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(user.createdAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>

        {user.dependents && user.dependents.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Dependents</Title>
            <Table
              dataSource={user.dependents}
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "SSN", dataIndex: "ssn", key: "ssn" },
                { title: "Relation", dataIndex: "relation", key: "relation" },
                {
                  title: "DOB",
                  dataIndex: "dob",
                  key: "dob",
                  render: (date) => new Date(date).toLocaleDateString(),
                },
              ]}
              pagination={false}
            />
          </div>
        )}

        {user.members && user.members.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Business Members</Title>
            <Table
              dataSource={user.members}
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "SSN", dataIndex: "ssn", key: "ssn" },
                {
                  title: "Cell Phone",
                  dataIndex: "cellPhone",
                  key: "cellPhone",
                },
                { title: "Position", dataIndex: "position", key: "position" },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Card>
    );
  };

  return (
    <>
      <Header profilePic={profilePic} />
      <Layout style={{ minHeight: "100vh" }}>
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
                  <ProfileSettings
                    userData={adminData}
                    onUpdate={(updatedData) => setAdminData(updatedData)}
                  />
                  <List
                    header={<Title level={4}>User List</Title>}
                    dataSource={users}
                    renderItem={(user) => (
                      <List.Item
                        onClick={() => setSelectedUser(user)}
                        style={{ cursor: "pointer" }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={<UserOutlined />}
                              src={user.profilePic}
                            />
                          }
                          title={user.username}
                          description={`${user.role} - ${user.email}`}
                        />
                      </List.Item>
                    )}
                  />
                  {selectedUser && renderUserDetails(selectedUser)}
                </div>
              )}
              {activeTab === "users" && (
                <UserManagement adminData={adminData} />
              )}
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
                          users.filter((user) => user.role === "employee")
                            .length
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
              {activeTab === "dashboardManager" && (
                <div className="dashboard-manager-section">
                  <Title level={3}>Dashboard Manager</Title>
                  <DashboardManager />
                </div>
              )}
              {activeTab === "dragAndDrop" && (
                <div className="drag-and-drop-section">
                  <Title level={3}>File Transfer</Title>
                  <DragAndDropScreen userRole="admin" />
                </div>
              )}
              {activeTab === "componentManager" && (
                <div className="component-manager-section">
                  <ComponentManager />
                </div>
              )}
              {activeTab === "forms" && (
                <div className="forms-tab">
                  <Tabs activeKey={activeFormsTab} onChange={setActiveFormsTab}>
                    <TabPane tab="Forms" key="forms">
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
    </>
  );
};

export default AdminDashboard;