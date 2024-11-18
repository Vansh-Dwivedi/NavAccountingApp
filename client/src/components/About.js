import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Layout,
  Menu,
  Button,
  Card,
  Row,
  Col,
  Carousel,
  Drawer,
  Typography,
  Space,
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
  CalculatorOutlined,
  AuditOutlined,
  FundProjectionScreenOutlined,
  BookOutlined,
  PayCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { jwtDecode } from "jwt-decode";
import FlipNumbers from "react-flip-numbers";
import api from "../utils/api";

const { Header, Footer, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminsCount, setAdminsCount] = useState(0);
  const [managersCount, setManagersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          if (decodedToken.user && decodedToken.user.role) {
            setUserRole(decodedToken.user.role);
          }
        } else {
          console.error("Token has expired");
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setUserRole(null);
      }
    }
    fetchManagersCount();
    fetchClientsCount();
    fetchAdminsCount();
  }, []);

  const handleDashboardClick = () => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else if (userRole === "manager") {
      navigate("/manager-dashboard");
    } else if (userRole === "client") {
      navigate("/client-dashboard");
    } else if (userRole === "employee") {
      navigate("/employee-dashboard");
    } else {
      navigate("/unauthorized");
    }
  };

  const fetchManagersCount = async () => {
    const response = await api.get("/api/users/managers/count");
    setManagersCount(response.data.count);
  };

  const fetchClientsCount = async () => {
    const response = await api.get("/api/users/clients/count");
    setClientsCount(response.data.count);
  };

  const fetchAdminsCount = async () => {
    const response = await api.get("/api/users/admins/count");
    setAdminsCount(response.data.count);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const menuItems = (
    <>
      {["Home", "About Us", "Services"].map((item) => (
        <Menu.Item key={item.toLowerCase().replace(" ", "-")}>
          <Link to={`/${item.toLowerCase().replace(" ", "-")}`}>{item}</Link>
        </Menu.Item>
      ))}
      {userRole ? (
        <Menu.Item key="dashboard">
          <Button
            onClick={handleDashboardClick}
            type="primary"
            className="dashboard-btn"
          >
            Dashboard
          </Button>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="login">
            <Link to="/login">
              <Button type="primary" className="login-btn">
                Login
              </Button>
            </Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">
              <Button className="register-btn">Register</Button>
            </Link>
          </Menu.Item>
        </>
      )}
    </>
  );

  return (
    <Layout className="layout">
      <style>
        {`
          .layout {
            min-height: 100vh;
            font-family: 'Roboto', sans-serif;
          }
          .header {
            position: fixed;
            z-index: 1;
            width: 100%;
            padding: 0 20px;
            background-color: #012e71;
          }
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            height: 50px;
            margin: 7px 0;
          }
          .menu-button {
            display: none;
            background-color: transparent;
            border: none;
            color: #ffffff;
          }
          .menu {
            background-color: #012e71;
          }
          .content {
            padding: 0 50px;
            margin-top: 64px;
          }
          .content-inner {
            background: #ffffff;
            padding: 24px;
            min-height: 380px;
          }
          .dashboard-btn, .login-btn {
            background-color: #012e71;
            border-color: #012e71;
            color: #ffffff;
            font-weight: bold;
            font-size: 14px;
            border-radius: 4px;
            transition: background-color 0.3s ease, transform 0.3s ease;
            height: 32px;
            padding: 4px 15px;
          }
          .register-btn {
            border-color: #012e71;
            color: #012e71;
            font-weight: bold;
            font-size: 14px;
            border-radius: 4px;
            transition: background-color 0.3s ease, transform 0.3s ease;
            height: 32px;
            padding: 4px 15px;
          }
          .footer {
            background-color: #012e71;
            color: #ffffff;
            padding: 40px 0;
          }
          .footer-section {
            margin-bottom: 20px;
          }
          .footer-title {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .footer-content {
            color: #ffffff;
            font-size: 14px;
          }
          .footer-links a {
            color: #ffffff;
            margin-right: 10px;
          }
          .footer-bottom {
            margin-top: 20px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 20px;
          }
          .counter {
            font-size: "5rem";
            font-family: "Courier New", Courier, monospace;
            color: "#fff";
            display: "flex";
          }
          @media (max-width: 768px) {
            .menu-button {
              display: block;
            }
            .menu {
              display: none;
            }
            .content {
              padding: 0 20px;
            }
          }
        `}
      </style>
      <Header className="header">
        <div className="header-content">
          <img
            src="http://localhost:5000/uploads/app-logo.png"
            alt="App Logo"
            className="logo"
          />
          <Button
            icon={<MenuOutlined />}
            onClick={toggleMenu}
            className="menu-button"
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["about-us"]}
            className="menu"
          >
            {menuItems}
          </Menu>
        </div>
      </Header>
      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleMenu}
        visible={menuVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          theme="light"
          mode="vertical"
          defaultSelectedKeys={["about-us"]}
          style={{ borderRight: 0 }}
        >
          {menuItems}
        </Menu>
      </Drawer>
      <Content className="content">
        <div className="content-inner">
          <motion.h1
            style={{
              fontSize: "3.5rem",
              margin: "2rem 0",
              color: "#012e71",
              textAlign: "center",
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            About Nav Accounts
          </motion.h1>
          <motion.p
            style={{
              maxWidth: "10000px",
              margin: "0 auto 2rem",
              color: "#012e71",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card title="Our Mission" style={{ height: "100%" }}>
                  <p>We're dedicated to providing expert accounting services that cater to your unique needs. Our goal is to empower you with the knowledge and tools necessary to make informed financial decisions.</p>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card title="Our Vision" style={{ height: "100%" }}>
                  <p>We envision a future where financial management is simplified, and our clients can focus on what matters most – growing their business and achieving their goals.</p>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card title="Our Values" style={{ height: "100%" }}>
                  <p>We operate with integrity, expertise, and a customer-centric approach. We're committed to innovation, collaboration, and delivering exceptional results.</p>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card title="Our Team" style={{ height: "100%" }}>
                  <p>Our team of experienced professionals is dedicated to providing personalized services that address your unique challenges. We're passionate about helping you achieve your financial goals.</p>
                </Card>
              </Col>
            </Row>
          </motion.p>
          <motion.div
            style={{ margin: "0 0 2rem", textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <h2
              style={{
                color: "#012e71",
                fontSize: "2.5rem",
                margin: "0 0 1rem",
              }}
            >
              Why Choose Us?
            </h2>
            <motion.p
              style={{
                maxWidth: "1000px",
                margin: "0 auto 2rem",
                color: "#012e71",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              At Nav Accounts, we pride ourselves on our commitment to excellence, integrity, and customer satisfaction. Our team of experienced professionals is dedicated to providing personalized services that address your unique challenges. We're passionate about helping you achieve your financial goals.

              <Row gutter={[16, 16]} style={{ margin: "2rem", paddingLeft: "50px" }}>
                <Col xs={24} sm={12} md={6}>
                  <Card title={<><CalculatorOutlined /> Expertise</>} style={{ height: "100%" }}>
                    <p>Our team has extensive experience in various accounting services.</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card title={<><AuditOutlined /> Transparency</>} style={{ height: "100%" }}>
                    <p>We maintain transparency in all our dealings and services.</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card title={<><FundProjectionScreenOutlined /> Tailored Solutions</>} style={{ height: "100%" }}>
                    <p>We provide customized solutions to meet your specific needs.</p>
                  </Card>
                </Col>
              </Row>
            </motion.p>
          </motion.div>
        </div>
      </Content>
      <Footer
        style={{
          backgroundColor: "#012e71",
          color: "#ffffff",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
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
                  "Tax Consultancy",
                  "Audit Services",
                  "Financial Planning",
                  "Bookkeeping",
                  "Payroll Management",
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
            <div style={{ marginBottom: "30px" }}>
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
              <Space direction="vertical" style={{ color: "#e6e6e6" }}>
                {[
                  {
                    icon: <MailOutlined style={{ marginRight: "10px" }} />,
                    text: "info@navaccounts.com",
                  },
                  {
                    icon: <PhoneOutlined style={{ marginRight: "10px" }} />,
                    text: "(123) 456-7890",
                  },
                  {
                    icon: (
                      <EnvironmentOutlined style={{ marginRight: "10px" }} />
                    ),
                    text: "123 Financial Street, Business District, City, Country",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      fontSize: "1rem",
                    }}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "20px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <h4
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#ffffff",
            }}
          >
            Follow Us
          </h4>
          <Space size="large">
            {[
              FacebookOutlined,
              TwitterOutlined,
              InstagramOutlined,
              LinkedinOutlined,
            ].map((Icon, index) => (
              <a
                key={index}
                href="#"
                style={{
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#4a90e2")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#ffffff")}
              >
                <Icon />
              </a>
            ))}
          </Space>
        </div>
        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#b3b3b3",
          }}
        >
          © 2023 Nav Accounts. All rights reserved.
        </p>
      </Footer>
    </Layout>
  );
};

export default Home;