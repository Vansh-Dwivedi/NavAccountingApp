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
            defaultSelectedKeys={["home"]}
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
          defaultSelectedKeys={["home"]}
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
            Welcome to Nav Accounts | Chartered Accountants
          </motion.h1>
          <motion.p
            style={{
              maxWidth: "600px",
              margin: "0 auto 2rem",
              color: "#012e71",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            At Nav Accounts, we provide comprehensive accounting services that
            cater to your personal and business needs. Our experienced team is
            here to guide you every step of the way.
          </motion.p>
          <Row gutter={[16, 16]} style={{ margin: "0 0 2rem" }}>
            {[
              {
                title: "Tax Consultancy",
                description:
                  "Get expert advice on tax planning and management to save money and ensure compliance.",
              },
              {
                title: "Audit Services",
                description:
                  "We provide thorough and accurate auditing services to help maintain transparency in your business.",
              },
              {
                title: "Financial Planning",
                description:
                  "Our financial planning services help you secure your future with smart investment decisions.",
              },
              {
                title: "Bookkeeping",
                description:
                  "Keep your business finances in order with our professional bookkeeping services.",
              },
              {
                title: "Payroll Management",
                description:
                  "Manage employee payroll effortlessly with our easy and accurate payroll management solutions.",
              },
              {
                title: "Business Advisory",
                description:
                  "Get strategic advice for growing your business and improving financial performance.",
              },
            ].map((service, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  title={service.title}
                  style={{
                    height: "100%",
                    borderTop: `2px solid ${
                      index % 2 === 0 ? "#012e71" : "#ffffff"
                    }`,
                  }}
                >
                  <p>{service.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
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
              How Our App Works
            </h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/how-our-app-works.png`}
                alt="App Screenshot"
                style={{ width: "400px", height: "400px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "600px",
                    width: "200px",
                    borderLeft: "2px solid #012e71",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <input type="radio" disabled checked />
                    <p>Data Access</p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "25%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <input type="radio" disabled checked />
                    <p>Processing & Finalizing The Request</p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <input type="radio" disabled checked />
                    <p>Final Reporting</p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            style={{ margin: "0 0 2rem", textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <h2
              style={{
                color: "#012e71",
                fontSize: "2.5rem",
                margin: "0 0 1rem",
              }}
            >
              User Statistics
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Card
                title="Admins"
                bordered={false}
                style={{ width: 300, textAlign: "center" }}
              >
                <FlipNumbers
                  height={50}
                  width={40}
                  color="#012e71"
                  background="#ffffff"
                  play
                  perspective={1000}
                  numbers={adminsCount.toString()}
                />
              </Card>
              <Card
                title="Managers"
                bordered={false}
                style={{ width: 300, textAlign: "center" }}
              >
                <FlipNumbers
                  height={50}
                  width={40}
                  color="#012e71"
                  background="#ffffff"
                  play
                  perspective={1000}
                  numbers={managersCount.toString()}
                />
              </Card>
              <Card
                title="Clients"
                bordered={false}
                style={{ width: 300, textAlign: "center" }}
              >
                <FlipNumbers
                  height={50}
                  width={40}
                  color="#012e71"
                  background="#ffffff"
                  play
                  perspective={1000}
                  numbers={clientsCount.toString()}
                />
              </Card>
            </div>
          </motion.div>
          <motion.div
            style={{ margin: "2rem 0 0", textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <h2
              style={{
                color: "#012e71",
                fontSize: "2.5rem",
                margin: "0 0 1rem",
              }}
            >
              Testimonials
            </h2>
            <Carousel autoplay>
              {[
                {
                  quote:
                    "Nav Accounts helped us streamline our financial processes and gave us the confidence we needed to grow our business. Highly recommended!",
                  author: "A. Sharma, Business Owner",
                },
                {
                  quote:
                    "Their expertise in accounting and tax consultancy saved us a lot of money and hassle during tax season. Great team to work with!",
                  author: "R. Kumar, Entrepreneur",
                },
                {
                  quote:
                    "The financial planning services provided by Nav Accounts have been instrumental in securing our company's future. Excellent service!",
                  author: "S. Patel, CEO",
                },
              ].map((testimonial, index) => (
                <div key={index}>
                  <p
                    style={{
                      maxWidth: "800px",
                      color: "#012e71",
                      fontSize: "1.2rem",
                      margin: "1rem auto",
                      padding: "0 50px",
                    }}
                  >
                    "{testimonial.quote}" - {testimonial.author}
                  </p>
                </div>
              ))}
            </Carousel>
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
                About Nav Accounts
              </h4>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#e6e6e6",
                }}
              >
                Nav Accounts is a leading chartered accountancy firm dedicated
                to providing top-notch financial and accounting services to
                individuals and businesses. Our experienced team is committed to
                helping you achieve your financial goals and grow your business.
              </p>
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
