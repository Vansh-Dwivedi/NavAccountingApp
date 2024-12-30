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
  FileTextOutlined
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useMediaQuery } from 'react-responsive';
import { createUseStyles } from 'react-jss';

const { Header, Footer } = Layout;
const { Title, Text } = Typography;

const useStyles = createUseStyles({
  header: {
    background: '#fff',
    padding: '0 24px',
    position: 'fixed',
    width: '100%',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    marginTop: '0'
  },
  headerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80
  },
  logo: {
    height: '40px',
    marginRight: '24px'
  },
  menuItem: {
    fontSize: '16px',
    color: '#333',
    '&:hover': {
      color: '#1890ff'
    }
  },
  footer: {
    background: '#002e6d',
    padding: '60px 24px 24px',
    color: '#fff'
  },
  footerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    '& h3': {
      color: '#fff',
      marginBottom: 24
    }
  },
  footerSection: {
    marginBottom: 40
  },
  footerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 16
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      marginBottom: 12,
      color: '#fff'
    },
    '& a': {
      color: '#fff',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },
  socialLinks: {
    '& .anticon': {
      fontSize: 24,
      marginRight: 16,
      color: '#fff',
      '&:hover': {
        color: '#e6f7ff'
      }
    }
  },
  contactInfo: {
    '& .ant-space-item': {
      color: '#fff'
    },
    '& a': {
      color: '#fff',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },
  copyright: {
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
    marginTop: 24,
    color: '#fff'
  }
});

export const FrontHeader = ({ activeKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const getBaseMenuItems = () => [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/services', icon: <CustomerServiceOutlined />, label: 'Services' },
    { key: '/about', icon: <InfoCircleOutlined />, label: 'About' },
    { key: '/resources', icon: <FileTextOutlined />, label: 'Resources' },
    { key: '/contact', icon: <ContactsOutlined />, label: 'Contact' }
  ];

  const getMenuItems = () => {
    const items = getBaseMenuItems();
    
    if (userRole) {
      items.push({
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => {
          switch (userRole) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "manager":
              navigate("/manager-dashboard");
              break;
            case "client":
              navigate("/client-dashboard");
              break;
            case "employee":
              navigate("/employee-dashboard");
              break;
            default:
              navigate("/unauthorized");
          }
        }
      });
    } else {
      items.push(
        { key: '/login', icon: <LoginOutlined />, label: 'Login' },
        { key: '/register', icon: <UserAddOutlined />, label: 'Register' }
      );
    }
    
    return items;
  };

  return (
    <Header className={classes.header}>
      <div className={classes.headerContent}>
        <Link to="/">
          <img 
            src="/logo.png" 
            alt="Nav Accounts Logo" 
            className={classes.logo}
          />
        </Link>
        
        {isMobile ? (
          <>
            <Button type="text" icon={<MenuOutlined />} onClick={() => setVisible(true)} />
            <Drawer
              title="Menu"
              placement="right"
              onClose={() => setVisible(false)}
              visible={visible}
            >
              <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                items={getMenuItems()}
              />
            </Drawer>
          </>
        ) : (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            className={classes.menuItem}
          />
        )}
      </div>
    </Header>
  );
};

export const FrontFooter = () => {
  const classes = useStyles();

  return (
    <Footer className={classes.footer}>
      <div className={classes.footerContent}>
        <Row gutter={[48, 32]} justify="space-between">
          <Col xs={24} sm={12} md={8}>
            <div className={classes.footerSection}>
              <h3 className={classes.footerTitle}>Our Services</h3>
              <ul className={classes.footerList}>
                <li><Link to="/services#accounting">Accounting & Assurance</Link></li>
                <li><Link to="/services#payroll">Payroll Services</Link></li>
                <li><Link to="/services#tax">Taxation</Link></li>
                <li><Link to="/services#compliance">Business Compliance</Link></li>
                <li><Link to="/services#advisory">Business Advisory</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <div className={classes.footerSection}>
              <h3 className={classes.footerTitle}>Contact Us</h3>
              <Space direction="vertical" className={classes.contactInfo}>
                <Space>
                  <PhoneOutlined />
                  <a href="tel:+15307773265">+1 530-777-3265</a>
                </Space>
                <Space>
                  <MailOutlined />
                  <a href="mailto:info@navaccounts.com">info@navaccounts.com</a>
                </Space>
                <Space>
                  <EnvironmentOutlined />
                  <span>1469 Butte House Rd, Ste E, Yuba City, CA 95993</span>
                </Space>
              </Space>
            </div>
          </Col>

        </Row>

        <Divider style={{ margin: '24px 0' }} />
        
        <Row justify="space-between" align="middle">
          <Col>
            <Text> 2024 Nav Accounts. All rights reserved.</Text>
          </Col>
          <Col>
            <Text>
              Developed by{' '}
              <a href="https://kalakaar.co.in" target="_blank" rel="noopener noreferrer">
                Kalakaar Studios
              </a>
              ,{' '}
              <a href="https://kalakaar.co.in" target="_blank" rel="noopener noreferrer">
                Vansh Dwivedi
              </a>
            </Text>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default { FrontHeader, FrontFooter };
