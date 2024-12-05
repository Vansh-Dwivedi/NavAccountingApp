import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  DollarOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  BankOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { jwtDecode } from "jwt-decode";
import FlipNumbers from "react-flip-numbers";
import api from "../utils/api";
import "./Home.css";
import { FrontHeader, FrontFooter } from './FrontPage';

const { Header, Footer, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminsCount, setAdminsCount] = useState(0);
  const [managersCount, setManagersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

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

  const features = [
    {
      icon: <DollarOutlined className="feature-icon" />,
      title: "Transparent Prices",
      description: "Clear and competitive pricing for all our services"
    },
    {
      icon: <TeamOutlined className="feature-icon" />,
      title: "Tech Savvy Professional Team",
      description: "Expert team equipped with the latest technology"
    },
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: "Free Initial Consultation",
      description: "Get started with a no-obligation consultation"
    }
  ];

  const servicePackages = [
    {
      icon: <BankOutlined className="package-icon" />,
      title: "Essential",
      features: [
        "Payroll Services",
        "Basic Tax Filing",
        "Monthly Bookkeeping",
        "Financial Statements"
      ]
    },
    {
      icon: <CalculatorOutlined className="package-icon" />,
      title: "Core",
      features: [
        "Essential Package +",
        "Tax Planning",
        "Business Compliance",
        "Advisory Services"
      ]
    },
    {
      icon: <SafetyOutlined className="package-icon" />,
      title: "Operational",
      features: [
        "Core Package +",
        "Full Business Compliance",
        "Industry-Specific Solutions",
        "Dedicated Support"
      ]
    }
  ];

  return (
    <Layout className="layout">
      <FrontHeader activeKey={location.pathname} />
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <div className="home-container">
          <motion.div
            className="hero-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="http://54.193.201.23:5000/api/uploads/hometittle.png" alt="Nav Accounts" style={{ padding: '50px' }} />
            <p>At Nav Accounts, we provide comprehensive accounting services that cater to your personal and business needs.
              Our experienced team is here to guide you every step of the way.</p>
            <Button type="primary" size="large" className="cta-button">
              Get Started
            </Button>
          </motion.div>

          <motion.div
            className="why-choose-us"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Why Choose Us?</h2>
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card className="feature-card">
                    <div className="feature-icon-wrapper">
                      {feature.icon}
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>

          <motion.div
            className="cta-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="cta-card">
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={16}>
                  <h2>Ready to Get Started?</h2>
                </Col>
                <Col xs={24} md={8} className="cta-buttons">
                  <Button type="primary" size="large" className="contact-button">
                    Contact Us
                  </Button>
                  <Button size="large" className="learn-button">
                    Learn More
                  </Button>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Home;