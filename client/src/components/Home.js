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
  Image,
} from "antd";
import {
  EnvironmentOutlined,
  CalculatorOutlined,
  DollarOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  BankOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { jwtDecode } from "jwt-decode";
import FlipNumbers from "react-flip-numbers";
import api from "../utils/api";
import "./Home.css";
import { FrontHeader, FrontFooter } from './HeaderFooter';

import VirtualMeetingSection from './VirtualMeetingSection';
import GetStartedSteps from './GetStartedSteps';

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const AchievementsSection = () => {
    return (
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
                      <img src={item.image} />
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    );
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <Layout className="layout">
      <FrontHeader />
      {/* Hero Section */}
      <section style={{ position: 'relative', width: '100%', height: 'calc(100vh - 130px)', marginTop: '130px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#002E6D' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
          <source src={process.env.REACT_APP_API_URL + "/uploads/nav-home-banner.mp4"} type="video/mp4" />
        </video>
      </section>

      {/* What Makes Us Reliable Section */}
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

      {/* Image Section */}
      <div className="image-section">
        <Image
          src={process.env.REACT_APP_API_URL + "/uploads/tax-returns-50.png"}
          alt="Tax Returns"
          preview={false}
        />
        <Image
          src={process.env.REACT_APP_API_URL + "/uploads/virtual-clients-web.png"}
          alt="Virtual Clients"
          preview={false}
        />
      </div>

      <AchievementsSection />

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

      {/* Professional Values Section */}
      <section className="values-section">
        <Title level={2} className="section-title">Our Professional Values</Title>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card className="value-card" bordered={false}>
              <div className="value-icon-wrapper">
                <TrophyOutlined className="value-icon" />
              </div>
              <Title level={4}>Excellence</Title>
              <Text>We strive for excellence in every service we provide, ensuring the highest quality of work for our clients.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="value-card" bordered={false}>
              <div className="value-icon-wrapper">
                <CheckCircleOutlined className="value-icon" />
              </div>
              <Title level={4}>Integrity</Title>
              <Text>We maintain the highest standards of professional integrity and ethics in all our dealings.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="value-card" bordered={false}>
              <div className="value-icon-wrapper">
                <TeamOutlined className="value-icon" />
              </div>
              <Title level={4}>Client Focus</Title>
              <Text>Our clients' success is our priority. We provide personalized attention and tailored solutions.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="value-card" bordered={false}>
              <div className="value-icon-wrapper">
                <SafetyOutlined className="value-icon" />
              </div>
              <Title level={4}>Trust</Title>
              <Text>Building long-lasting relationships through transparency and reliability.</Text>
            </Card>
          </Col>
        </Row>
      </section>

      <VirtualMeetingSection />
      <GetStartedSteps />

      {/* CEO Quote Section */}
      <Row className="content-row" style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <Col xs={24}>
          <div style={{
            padding: '2rem',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            color: '#333'
          }}>
            <p style={{ marginBottom: '1rem' }}>"Doctors get paid when you're sick,<br />
              lawyers get paid when you're in trouble,<br />
              but accountants get paid when you're successful."</p>
            <p style={{
              marginTop: '1rem',
              fontWeight: 'bold',
              color: '#666'
            }}>-CEO Quote-</p>
          </div>
        </Col>
      </Row>
      <FrontFooter />
    </Layout>
  );
};

export default Home;