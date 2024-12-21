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

  const bannerImages = [
    'https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/banner-slide-blue1.jpg',
    'https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/banner-slide-blue2.jpg',
    'https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/banner-slide-blue3.jpg'
  ];

  return (
    <Layout className="layout">
      <FrontHeader activeKey={location.pathname} />
      <Content>
        <div className="home-container">
          {/* Home Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="home-title-section"
          >
            <img 
              src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/hometittle.png" 
              alt="Nav Accounts Home Title"
              style={{ 
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                margin: '80px auto 20px',
                display: 'block'
              }} 
            />
          </motion.div>

          {/* Banner Slider Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="banner-slider-section"
          >
            <Carousel autoplay>
              {bannerImages.map((image, index) => (
                <div key={index}>
                  <div 
                    style={{
                      height: '400px',
                      background: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '12px',
                      margin: '0 20px'
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="why-choose-us-section"
            style={{ padding: '60px 20px' }}
          >
            <h2 className="section-title">Why Choose Us</h2>
            <Row gutter={[24, 24]} justify="center">
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card className="feature-card">
                    {feature.icon}
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Home;