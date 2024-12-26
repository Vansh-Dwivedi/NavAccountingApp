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
  TrophyOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { jwtDecode } from "jwt-decode";
import FlipNumbers from "react-flip-numbers";
import api from "../utils/api";
import "./Home.css";
import { FrontHeader, FrontFooter } from './FrontPage';

import VirtualMeetingSection from './VirtualMeetingSection';

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
          if (decodedToken.user && decodedToken.user.role || decodedToken.role) {
            if (decodedToken.userId) {
              setUserRole(decodedToken.role); // To check if it is a Google user
            } else {
              setUserRole(decodedToken.user.role);
            }
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

  const accomplishments = [
    {
      image: '/uploads/a1.png',
      subtitle: 'Excellence in Service'
    },
    {
      image: '/uploads/a2.png',
      subtitle: 'Industry Recognition'
    },
    {
      image: '/uploads/a3.png',
      subtitle: 'Client Success'
    },
    {
      image: '/uploads/a4.png',
      subtitle: 'Innovation'
    },
    {
      image: '/uploads/a5.png',
      subtitle: 'Global Reach'
    }
  ];

  return (
    <Layout className="layout">
      <FrontHeader activeKey={location.pathname} />
      <Content>
        <div className="home-container">
          <div className="hero-section">
            <video 
              autoPlay 
              loop 
              muted 
              className="hero-video"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src="https://localhost:8443/uploads/nav-home-banner.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <section className="features-section">
            <h1 style={{ textAlign: "center", fontSize: "3.5rem", margin: "1rem 0" }}>Why Choose Us</h1>
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Our Accomplishments Section */}
          <section className="accomplishments-section">
            <div className="section-container">
              <div className="section-title">
                <TrophyOutlined />
                <h2>Our Accomplishments</h2>
              </div>
              <Row gutter={[48, 48]} justify="center">
                {accomplishments.map((item, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="accomplishment-card">
                        <div className="accomplishment-image">
                          <img src={item.image} alt={item.subtitle} />
                        </div>
                        <div className="accomplishment-subtitle">
                          {item.subtitle}
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          <VirtualMeetingSection />
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Home;