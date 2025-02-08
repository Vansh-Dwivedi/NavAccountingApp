import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Space,
  Image,
  Drawer,
  Typography,
  List,
  Divider
} from "antd";
import {
  MenuOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CustomerServiceOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  DashboardOutlined,
  LoginOutlined,
  UserAddOutlined,
  FileOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ReadOutlined
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useMediaQuery } from 'react-responsive';
import PaymentHeader from './PaymentHeader';

const { Header, Footer } = Layout;
const { Title, Text } = Typography;

const navigationItems = {
  base: [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/services', icon: <CustomerServiceOutlined />, label: 'Services' },
    { key: '/about', icon: <InfoCircleOutlined />, label: 'About' },
    { key: '/resources', icon: <FileTextOutlined />, label: 'Resources' },
    { key: '/employment', icon: <ReadOutlined />, label: 'Employment' },
  ],
  auth: [
    { key: '/login', icon: <LoginOutlined />, label: 'Login' },
    { key: '/register', icon: <UserAddOutlined />, label: 'Register' }
  ]
};

const servicesList = [
  { path: '', label: 'Accounting & Assurance' },
  { path: '', label: 'Payroll Services' },
  { path: '', label: 'Taxation' },
  { path: '', label: 'Business Compliance' },
  { path: '', label: 'Business Advisory' }
];

const contactInfo = {
  phone: '+1 530-777-3265',
  email: 'navaccounts@yahoo.com',
  address: '1469 Butte House Rd, Ste E, Yuba City, CA 95993'
};

const FrontHeader = ({ activeKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin-dashboard";
      case "manager":
        return "/manager-dashboard";
      case "client":
        return "/client-dashboard";
      case "employee":
        return "/employee-dashboard";
      default:
        return "/unauthorized";
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/',
        label: <Link to="/">Home</Link>,
        icon: <HomeOutlined />
      },
      {
        key: '/services',
        label: <Link to="/services">Services</Link>,
        icon: <AppstoreOutlined />
      },
      {
        key: '/about-us',
        label: <Link to="/about-us">About us</Link>,
        icon: <InfoCircleOutlined />
      },
      {
        key: '/resources',
        label: <Link to="/resources">Resources</Link>,
        icon: <FileOutlined />
      },
      {
        key: '/employment',
        label: <Link to="/employment">Employment</Link>,
        icon: <ReadOutlined />
      }
    ];

    // Add login/register or dashboard based on user role
    if (!userRole) {
      baseItems.push(
        {
          key: '/login',
          label: <Link to="/login">Login</Link>,
          icon: <LoginOutlined />
        },
        {
          key: '/register',
          label: <Link to="/register">Register</Link>,
          icon: <UserAddOutlined />
        }
      );
    } else {
      const dashboardPath = getDashboardPath();
      baseItems.push({
        key: dashboardPath,
        label: <Link to={dashboardPath}>Dashboard</Link>,
        icon: <DashboardOutlined />
      });
    }

    return baseItems;
  };

  const handleMenuClick = (key) => {
    setDrawerVisible(false);
    navigate(key);
  };

  return (
    <Layout>
      <Header className={`front-header ${isScrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed',
        width: '100%',
        zIndex: 999,
        top: 50,
        padding: '15px 50px',
        background: isScrolled ? 'transparent' : 'transparent',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        height: '130px'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}>
          <Link to="/">
            <img
              src={process.env.REACT_APP_API_URL + "/uploads/nav-n-symbol-logo.png"}
              alt="Nav Accounts Logo"
              style={{
                height: '130px',
                width: 'auto'
              }}
            />
          </Link>

          {isMobile ? (
            <>
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '24px' }} />}
                onClick={() => setDrawerVisible(true)}
                style={{ border: 'none' }}
              />
              <Drawer
                title="Menu"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
              >
                <Menu
                  mode="vertical"
                  selectedKeys={[location.pathname]}
                  items={getMenuItems()}
                  onClick={({ key }) => handleMenuClick(key)}
                  style={{
                    fontSize: '18px'
                  }}
                />
                <Button
                  type="primary"
                  icon={<PhoneOutlined />}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    height: '48px',
                    fontSize: '18px',
                    backgroundColor: '#002E6D'
                  }}
                  onClick={() => handleMenuClick('/contact')}
                >
                  Contact Us
                </Button>
              </Drawer>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={getMenuItems()}
                onClick={({ key }) => handleMenuClick(key)}
                style={{
                  background: 'transparent',
                  borderBottom: 'none',
                  fontSize: '18px'
                }}
                className="header-menu"
                overflowedIndicator={null}
              />
              <Button
                type="primary"
                icon={<PhoneOutlined />}
                size="large"
                onClick={() => handleMenuClick('/contact')}
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '18px'
                }}
              >
                Contact Us
              </Button>
            </div>
          )}
        </div>
      </Header>
    </Layout>
  );
};

const FrontFooter = () => {
  return (
    <Footer style={{
      textAlign: 'center',
      backgroundColor: '#002E6D',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        <Row gutter={[24, 24]} justify="space-between">
          <Col xs={24} sm={8}>
            <Title level={4} style={{ color: '#fff' }}>Quick Links</Title>
            <Space direction="vertical">
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
              <Link to="/services" style={{ color: '#fff', textDecoration: 'none' }}>Services</Link>
              <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>
              <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link>
              <Link to="/resources" style={{ color: '#fff', textDecoration: 'none' }}>Resources</Link>
              <Link to="/employment" style={{ color: '#fff', textDecoration: 'none' }}>Employment</Link>
              <Link to="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
            </Space>
          </Col>

          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 40 }}>
              <h3 style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16
              }}>Our Services</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {servicesList.map(service => (
                  <li key={service.path} style={{ marginBottom: 12 }}>
                    <Link to={service.path} style={{ color: '#fff', textDecoration: 'none' }}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 40 }}>
              <h3 style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16
              }}>Contact Us</h3>
              <Space direction="vertical" style={{ color: '#fff' }}>
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${contactInfo.phone}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {contactInfo.phone}
                  </a>
                </Space>
                <Space>
                  <MailOutlined />
                  <a href={`mailto:${contactInfo.email}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {contactInfo.email}
                  </a>
                </Space>
                <Space>
                  <EnvironmentOutlined />
                  <span>{contactInfo.address}</span>
                </Space>
              </Space>
            </div>
          </Col>
        </Row>
        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '40px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#fff' }}> 2024 Nav Accounts. All rights reserved.</p>
          <p style={{ textAlign: 'right', color: '#fff' }}>Developed by <a href="https://kalakaar.co.in" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Kalakaar Studios</a></p>
        </div>
      </div>
    </Footer>
  );
};

export { FrontHeader, FrontFooter };