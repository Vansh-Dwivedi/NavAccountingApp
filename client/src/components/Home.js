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
import { FrontHeader, FrontFooter } from './Header&Footer';

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
      title: 'Excellence in Service',
      subtitle: 'Setting new standards in accounting services'
    },
    {
      image: '/uploads/a2.png',
      title: 'Industry Recognition',
      subtitle: 'Award-winning financial solutions'
    },
    {
      image: '/uploads/a3.png',
      title: 'Client Success',
      subtitle: 'Helping businesses thrive'
    },
    {
      image: '/uploads/a4.png',
      title: 'Innovation',
      subtitle: 'Leading with cutting-edge technology'
    },
    {
      image: '/uploads/a5.png',
      title: 'Global Reach',
      subtitle: 'Serving clients worldwide'
    }
  ];

  const professionalValues = [
    {
      icon: <TrophyOutlined className="value-icon" />,
      title: "Excellence",
      description: "We strive for excellence in every service we provide, ensuring the highest quality of work for our clients."
    },
    {
      icon: <CheckCircleOutlined className="value-icon" />,
      title: "Integrity",
      description: "We maintain the highest standards of professional integrity and ethics in all our dealings."
    },
    {
      icon: <TeamOutlined className="value-icon" />,
      title: "Client Focus",
      description: "Our clients' success is our priority. We provide personalized attention and tailored solutions."
    },
    {
      icon: <SafetyOutlined className="value-icon" />,
      title: "Trust",
      description: "Building long-lasting relationships through transparency and reliability."
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

          <section className="reliability-section">
            <div className="section-header">
              <Title level={2}>What Makes us Reliable for You</Title>
            </div>
            <Row gutter={[24, 24]} className="content-row">
              <Col xs={24} md={8}>
                <Card className="info-card">
                  <h3>Passionate Professionals</h3>
                  <p>We love what we do which leads us to provide you with a service in terms of legit compliance with regulations, decision focus reporting, with interactions platform, and best practice in maintaining the data security and confidentiality.</p>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="info-card">
                  <h3>Honest & Dependable</h3>
                  <p>We offer transparent in the pricing quotes and services indeed. Our Focus with each individual client will be improving their business practices in efficient manner with value added solutions & upgrading systems with technology reforming.</p>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="info-card">
                  <h3>Keep Refining</h3>
                  <p>Our client showed trust in our services because they got the solutions for their concerns with long-term bonding. We are grateful for it, along with that we keep improving our understanding and practices with regulations updated annually in the context of tax, law, tech and security. We take our duties seriously.</p>
                </Card>
              </Col>
            </Row>
          </section>

          <section className="features-section">
            <div className="section-header">
              <h2>Why Choose Us</h2>
            </div>
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
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="accomplishments-section">
            <Row gutter={0}>
              {accomplishments.map((item, index) => (
                <Col xs={24} sm={24} md={12} lg={12} key={index}>
                  <div className="accomplishment-item">
                    <img src={item.image} alt={item.title} />
                    <div className="accomplishment-content">
                      <h3>{item.title}</h3>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          <section className="values-section">
            <Title level={2} className="section-title">Our Professional Values</Title>
            <Row gutter={[24, 24]} className="values-row">
              {professionalValues.map((value, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="value-card" hoverable>
                      <div className="value-icon-wrapper">
                        {value.icon}
                      </div>
                      <Title level={4}>{value.title}</Title>
                      <Text>{value.description}</Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>

          <VirtualMeetingSection />
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Home;