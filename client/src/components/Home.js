import React, { useEffect, useState, useRef } from "react";
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
  Spin
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
  MoneyCollectOutlined,
  ProfileFilled,
  UserOutlined,
  ArrowRightOutlined,
  StarFilled,
  GoogleOutlined
} from "@ant-design/icons";

import { jwtDecode } from "jwt-decode";
import FlipNumbers from "react-flip-numbers";
import api from "../utils/api";
import axios from 'axios';
import "./Home.css";
import { FrontHeader, FrontFooter } from './HeaderFooter';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Hero from './Hero';
import AnimatedGraphic from './AnimatedGraphic';

import VirtualMeetingSection from './VirtualMeetingSection';
import GetStartedSteps from './GetStartedSteps';
import FAQSection from './FAQSection';
import PaymentHeader from './PaymentHeader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { Header, Footer, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminsCount, setAdminsCount] = useState(0);
  const [managersCount, setManagersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/google-reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to static reviews if API fails
      setReviews([
        {
          name: "Sarah Johnson",
          initial: "SJ",
          date: "2 weeks ago",
          rating: 5,
          content: "Nav Accounting has been instrumental in helping our business grow. Their expertise in tax planning saved us thousands of dollars. Highly recommend their services!",
        },
        {
          name: "Michael Chen",
          initial: "MC",
          date: "1 month ago",
          rating: 5,
          content: "Professional, knowledgeable, and always available when we need them. They've made our tax season stress-free for the past 2 years.",
        },
        {
          name: "Emily Rodriguez",
          initial: "ER",
          date: "3 weeks ago",
          rating: 5,
          content: "The team at Nav Accounting goes above and beyond. Their attention to detail and proactive approach to financial planning has been invaluable for our business.",
        }
      ]);
    } finally {
      setLoading(false);
    }
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

  const isMobile = window.innerWidth <= 768;

  const Counter = ({ start, end, duration, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => {
        if (countRef.current) {
          observer.unobserve(countRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (!isVisible) return;

      const steps = 60;
      const stepDuration = duration / steps;
      const stepValue = (end - start) / steps;
      let current = start;
      let step = 0;

      const timer = setInterval(() => {
        current += stepValue;
        step += 1;

        if (step === steps) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [start, end, duration, isVisible]);

    return (
      <div ref={countRef} className="counter-value">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <AnimatedGraphic />
      <Layout className="layout">
        <PaymentHeader />
        <FrontHeader />
        {/* Hero Section */}
        <section className="starting-video-section">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/home-banner.svg`}
            alt="Hero Banner"
            style={{
              width: '70%',
              height: 'auto',
              objectFit: 'cover',
              marginTop: '85px'
            }}
          />
          <div className="banner-button-container">
            <button className="animated-button" onClick={() => navigate('/contact')}>
              <svg className="arr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
              </svg>
              <span className="text">Let's Begin</span>
              <span className="circle"></span>
              <svg className="arr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
              </svg>
            </button>
          </div>
        </section>
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 className="section-title">
              Our Accomplishments
            </h2>
            <Row gutter={[48, 48]}>
              <Col xs={24} md={12}>
                <div style={{
                  height: '786.41px',
                  backgroundColor: '#002E6D',
                  color: 'white',
                  padding: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Typography.Paragraph style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.8',
                    margin: '0 0 20px 0',
                    color: 'white'
                  }}>
                    We talk only when we had achieved for real. That makes our success countable and meaningful. Our commitment to excellence has led to significant achievements in serving our clients:
                  </Typography.Paragraph>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '20px 0',
                    color: 'white',
                    fontSize: '1.25rem',
                  }}>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <ArrowRightOutlined style={{ marginRight: '10px', color: '#4096ff' }} />
                      Over $50,000 in total tax savings for our clients
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <ArrowRightOutlined style={{ marginRight: '10px', color: '#4096ff' }} />
                      Successfully processed 200+ tax returns with 100% accuracy
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <ArrowRightOutlined style={{ marginRight: '10px', color: '#4096ff' }} />
                      Helped 50+ businesses optimize their accounting processes
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <ArrowRightOutlined style={{ marginRight: '10px', color: '#4096ff' }} />
                      Achieved 98% client satisfaction rate
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <ArrowRightOutlined style={{ marginRight: '10px', color: '#4096ff' }} />
                      Provided 1000+ hours of professional consultation
                    </li>
                  </ul>
                  <Typography.Paragraph style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.8',
                    margin: '20px 0 0 0',
                    color: 'white'
                  }}>
                    These numbers are based on our performance in 2022 & 2023, and we continue to grow and excel in serving our clients with dedication and expertise.
                  </Typography.Paragraph>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ position: 'relative' }}>
                  <img src="https://localhost:8443/uploads/acc.png" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '32%', right: '5%', display: 'flex', alignItems: 'center', fontSize: '85.3px' }}>
                      <span style={{ fontSize: '85.3px', color: '#1A1B1E', fontFamily: 'Montserrat' }}>$</span>
                      <Counter start={10} end={200} duration={2000} suffix="k" />
                    </div>
                    <div style={{ position: 'absolute', top: '50%', right: '-3.0%', display: 'flex', alignItems: 'center', fontSize: '80.3px' }}>
                      <Counter start={10} end={200} duration={2000} suffix="+" />
                    </div>
                    <div style={{ position: 'absolute', top: '68%', right: '-2%', display: 'flex', alignItems: 'center', fontSize: '85.3px' }}>
                      <Counter start={1} end={3} duration={2000} suffix=" yrs" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        {/* What Makes Us Reliable Section */}
        <section style={{ background: 'transparent', padding: '64px 24px', zIndex: 9 }}>
          <Title level={2} className="section-title">What Makes us Reliable for You</Title>
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

        {/* Our Services Section */}
        <section className="services-section" style={{ background: 'transparent' }}>
          <Title level={2} className="section-title">Our Services</Title>
          <Paragraph className="section-description">
            Nav Accounts offers a wide range of services to our clients. We Look to us to help you with
            financial reporting, tax planning, business best practices, transaction advisory assistance
            and understanding of your industry.
          </Paragraph>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card className="service-card-xyz">
                <a href="/services">
                  <Title level={1} style={{ color: '#ffffff' }}>Accounting & Payroll</Title>
                </a>
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="service-card-xyz">
                <a href="/services">
                  <Title level={1} style={{ color: '#ffffff' }}>Taxation</Title>
                </a>
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="service-card-xyz">
                <a href="/services">
                  <Title level={1} style={{ color: '#ffffff' }}>Compliance</Title>
                </a>
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="service-card-xyz">
                <a href="/services">
                  <Title level={1} style={{ color: '#ffffff' }}>Business Insight & Advisory</Title>
                </a>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Features Section */}
        <section className="values-section">
          <Title level={2} className="section-title">Why Choose Us</Title>
          <Row gutter={[32, 32]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="value-card" bordered={false} style={{ backgroundColor: '#ffffff !important' }}>
                  <div className="value-icon-wrapper">
                    {index === 0 && <BankOutlined className="value-icon" />}
                    {index === 1 && <TeamOutlined className="value-icon" />}
                    {index === 2 && <RocketOutlined className="value-icon" />}
                  </div>
                  <Title level={4}>{feature.title}</Title>
                  <Text style={{ color: '#000000 !important' }}>{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Professional Values Section */}
        <section className="values-section" style={{ backgroundColor: '#ffffff !important' }}>
          <Title level={2} className="section-title">Our Professional Values</Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <Card className="value-card" bordered={false} style={{ backgroundColor: '#ffffff !important' }}>
                <div className="value-icon-wrapper">
                  <TrophyOutlined className="value-icon" />
                </div>
                <Title level={4}>Excellence</Title>
                <Text style={{ color: '#000000 !important' }}>We strive for excellence in every service we provide, ensuring the highest quality of work for our clients.</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="value-card" bordered={false} style={{ backgroundColor: '#ffffff !important' }}>
                <div className="value-icon-wrapper">
                  <CheckCircleOutlined className="value-icon" />
                </div>
                <Title level={4}>Integrity</Title>
                <Text style={{ color: '#000000 !important' }}>We maintain the highest standards of professional integrity and ethics in all our dealings.</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="value-card" bordered={false} style={{ backgroundColor: '#ffffff !important' }}>
                <div className="value-icon-wrapper">
                  <UserOutlined className="value-icon" />
                </div>
                <Title level={4}>Client Focus</Title>
                <Text style={{ color: '#000000 !important' }}>Our clients' success is our priority. We provide personalized attention and tailored solutions.</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="value-card" bordered={false} style={{ backgroundColor: '#ffffff !important' }}>
                <div className="value-icon-wrapper">
                  <SafetyOutlined className="value-icon" />
                </div>
                <Title level={4}>Trust</Title>
                <Text style={{ color: '#000000 !important' }}>Building long-lasting relationships through transparency and reliability.</Text>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Google Reviews Section */}
        <section className="reviews-section">
          <Title level={2} className="section-title">What People Say About Us</Title>
          <div className="review-slider">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {reviews.map((review, index) => (
                  <div key={index}>
                    <div className="review-card">
                      <div className="review-header">
                        <div className="reviewer-avatar">
                          {review.initial}
                        </div>
                        <div className="reviewer-info">
                          <div className="reviewer-name">{review.name}</div>
                          <div className="review-date">{review.date}</div>
                        </div>
                      </div>
                      <div className="star-rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarFilled key={i} style={{ fontSize: '16px' }} />
                        ))}
                      </div>
                      <div className="review-content">
                        "{review.content}"
                      </div>
                      <div className="google-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '12px' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        </svg>
                        <span className="verified-text">Verified Google Review</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </section>

        <GetStartedSteps />
        <VirtualMeetingSection />

        {/* CEO Quote Section */}
        <Row className="content-row" style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '2rem', zIndex: 9 }}>
          <Col xs={24}>
            <Card style={{
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              maxWidth: '800px',
              margin: '0 auto', // Center the card
              background: 'url("https://localhost:8443/uploads/quote-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div style={{
                fontStyle: 'italic',
                fontSize: '2rem',
                lineHeight: '1.6',
                color: '#000000 !important',
                fontWeight: 'bold',
              }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#000000' }}>"Doctors get paid when you're sick,
                  lawyers get paid when you're in trouble,
                  but accountants get paid when you're successful."</p>
                <p style={{
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '-0.1rem'
                }}>-Navrisham Khaira CEO-</p>
              </div>
            </Card>
          </Col>
        </Row>
        <FrontFooter />
      </Layout>
    </>
  );
};

export default Home;