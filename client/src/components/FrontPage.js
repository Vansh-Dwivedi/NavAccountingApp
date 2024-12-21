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
  Image
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
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const { Header, Footer } = Layout;

// Header Component
export const FrontHeader = ({ activeKey }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const onClick = (e) => {
    navigate(e.key);
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

  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        padding: "0 20px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="logo">
          <Link to="/">
            <img
              src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/app-logo.png"
              alt="App Logo"
              style={{ width: "60px", height: "60px", marginRight: "20px", marginTop: "-20px" }}
            />
          </Link>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[activeKey]}
          mode="horizontal"
          items={menuItems}
          style={{ border: "none", flex: 1, justifyContent: "flex-end" }}
        />
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
              <img 
                src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/app-logo.png"
                alt="Nav Accounting App Logo"
                style={{
                  width: "80px",
                  height: "auto",
                  marginBottom: "15px"
                }}
              />
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
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Image src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/nav-overview.png" style={{ maxWidth: '100%' }} />
          </Col>
        </Row>
        <Row gutter={[32, 32]} style={{ maxWidth: "1200px", margin: "0 auto", display: "none" }}>
          <Col xs={24} sm={12} md={8}>
            <Image src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/Brochure1.png" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Image src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/Brochure2.png" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Image src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/Brochure3.png" style={{ maxWidth: '100%', maxHeight: '300px' }} />
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
          2023 Nav Accounts. All rights reserved.
        </p>
      </div>
    </Footer>
  );
};

export default { FrontHeader, FrontFooter };
