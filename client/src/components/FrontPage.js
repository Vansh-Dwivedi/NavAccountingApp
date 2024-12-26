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
  Drawer
} from "antd";
import {
  MenuOutlined,
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

const { Header, Footer } = Layout;

// Header Component
export const FrontHeader = ({ activeKey }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobileOrTablet = useMediaQuery({ maxWidth: 768 });

  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerVisible(false);
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home"
    },
    {
      key: "/services",
      icon: <CustomerServiceOutlined />,
      label: "Services"
    },
    {
      key: "/about-us",
      icon: <InfoCircleOutlined />,
      label: "About"
    },
    {
      key: "/resources",
      icon: <FileOutlined />,
      label: "Resources"
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: "Contact"
    }
  ];

  // Add login/register or dashboard based on user role
  if (userRole) {
    menuItems.push({
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
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
    menuItems.push(
      {
        key: "/login",
        icon: <LoginOutlined />,
        label: "Login"
      },
      {
        key: "/register",
        icon: <UserAddOutlined />,
        label: "Register"
      }
    );
  }

  const menuStyle = {
    background: '#ffffff',
    color: '#002e6d'
  };

  const headerStyle = {
    background: '#ffffff',
    padding: 0,
    position: 'fixed',
    zIndex: 1000,
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <Header className="front-header" style={headerStyle}>
      <div className="header-content">
        <div className="logo-container">
          <Link to="/">
            <img
              src="https://localhost:8443/uploads/nav-n-symbol-logo.png"
              alt="Nav Accounts Logo"
              style={{ width: "60px", height: "60px", marginRight: "20px", marginTop: "-20px" }}
            />
          </Link>
        </div>

        {isMobileOrTablet ? (
          <>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="menu-button"
            />
            <Drawer
              title="Menu"
              placement="right"
              onClose={() => setDrawerVisible(false)}
              visible={drawerVisible}
              className="mobile-drawer"
              style={{ background: '#ffffff' }}
            >
              <Menu
                mode="vertical"
                selectedKeys={[activeKey]}
                className="drawer-menu"
                style={menuStyle}
              >
                {menuItems.map(item => (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={() => handleMenuClick(item.key)}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            </Drawer>
          </>
        ) : (
          <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            className="desktop-menu"
            style={menuStyle}
          >
            {menuItems.map(item => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleMenuClick(item.key)}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        )}
      </div>
    </Header>
  );
};

// Footer Component
export const FrontFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#012e71",
        color: "#ffffff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      <div>
        <Row gutter={[32, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Col xs={24} sm={12} md={8}>
            <div style={{ marginBottom: "30px" }}>
              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "15px",
                  color: "#ffffff",
                }}
              >
                Our Services
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  color: "#e6e6e6",
                }}
              >
                {[
                  "Accounting & Assurance",
                  "Payroll Services",
                  "Taxation",
                  "Business Compliance",
                  "Business Advisory",
                ].map((service, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "10px", fontSize: "1rem" }}
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="footer-section">
              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "15px",
                  color: "#ffffff",
                }}
              >
                Contact Us
              </h4>
              <div className="contact-info">
                <p>
                  <PhoneOutlined /> +1 530-777-3265
                </p>
                <p>
                  <MailOutlined /> info@navaccounts.com
                </p>
                <p>
                  <EnvironmentOutlined /> 1469 Butte House Rd, Ste E,
                  Yuba City, CA 95993
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <img src="https://localhost:8443/uploads/app-logo.png" style={{ maxWidth: '100%' }} />
          </Col>
        </Row>
        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#b3b3b3",
          }}
        >
          2024 Nav Accounts. All rights reserved.
        </p>
      </div>
    </Footer>
  );
};

export default { FrontHeader, FrontFooter };
