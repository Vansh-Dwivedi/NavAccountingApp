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
  const [currentReview, setCurrentReview] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
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
  }, []);

  useEffect(() => {
    const staticReviews = [
      {
        content: "Exceptional service! Their expertise in accounting has helped our business grow tremendously.",
        name: "Sarah Johnson",
        rating: 5,
        profileUrl: "https://xsgames.co/randomusers/avatar.php?g=female",
        relativeTime: "2 weeks ago"
      },
      {
        content: "Great experience working with this team. They've streamlined our financial processes.",
        name: "Michael Chen",
        rating: 5,
        profileUrl: "https://xsgames.co/randomusers/avatar.php?g=male",
        relativeTime: "1 month ago"
      },
      {
        content: "Professional and knowledgeable staff. Always responsive to our needs.",
        name: "Emily Rodriguez",
        rating: 5,
        profileUrl: "https://xsgames.co/randomusers/avatar.php?g=female",
        relativeTime: "3 weeks ago"
      }
    ];

    setReviews(staticReviews);
    setReviewsLoading(false);
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

  const reliablePoints = [
    {
      icon: <TeamOutlined />,
      title: "Passionate Professionals",
      description: "We love what we do which leads us to provide you with a service in terms of legit compliance with regulations, decision focus reporting, with interactions platform, and best practice in maintaining the data security and confidentiality."
    },
    {
      icon: <CheckCircleOutlined />,
      title: "Honest & Dependable",
      description: "We offer transparent in the pricing quotes and services indeed. Our Focus with each individual client will be improving their business practices in efficient manner with value added solutions & upgrading systems with technology reforming."
    },
    {
      icon: <SafetyOutlined />,
      title: "Keep Refining",
      description: "Our client showed trust in our services because they got the solutions for their concerns with long-term bonding. We are grateful for it, along with that we keep improving our understanding and practices with regulations updated annually in the context of tax, law, tech and security. We take our duties seriously."
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

  useEffect(() => {
    let interval;
    if (autoSlide && reviews.length > 1) {
      interval = setInterval(() => {
        if (!isTransitioning) {
          nextReview();
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoSlide, isTransitioning]);

  const changeSlide = (direction) => {
    if (isTransitioning) return;

    setAutoSlide(false); // Pause auto-slide on manual navigation
    setIsTransitioning(true);
    setSlideDirection(direction);

    setTimeout(() => {
      if (direction === 'left') {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      } else {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
      }

      setTimeout(() => {
        setSlideDirection('');
        setIsTransitioning(false);
        setAutoSlide(true); // Resume auto-slide after transition
      }, 50);
    }, 500);
  };

  const prevReview = () => changeSlide('right');
  const nextReview = () => changeSlide('left');

  return (
    <>
      <AnimatedGraphic />
      <Layout className="layout">
        <PaymentHeader />
        <FrontHeader />
        {/* Hero Section */}
        <section className="starting-video-section">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '70%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              imageRendering: 'crisp-edges'
            }}
          >
            <source src={`${process.env.REACT_APP_API_URL}/uploads/home-banner.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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

        <section className="values-section">
          <Title level={2} className="section-title" style={{ textAlign: 'center' }}>Why To Choose Us</Title>
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

        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0', padding: '0 20px' }}>
            <Row gutter={[48, 48]}>
              <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  height: '786.41px',
                  backgroundColor: '#002E6D',
                  color: 'white',
                  padding: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Typography.Paragraph style={{
                    fontSize: '1.50rem',
                    lineHeight: '1.8',
                    margin: '0 0 20px 0',
                    color: 'white'
                  }}>
                    Nav Accounts is owned by Navrisham Khaira as a solopreneur. She is passionate about helping individuals and businesses navigate the complexities of tax laws to maximize savings and ensure long-term financial success, along with sharing tech-associated compliance with small business owners for data protection.
                  </Typography.Paragraph>
                  <Typography.Paragraph style={{
                    fontSize: '1.50rem',
                    lineHeight: '1.8',
                    margin: '20px 0 0 0',
                    color: 'white'
                  }}>
                    We talk only when we had achieved for real. That makes countable for your opportunities to assist you with our business solution with our commitment to serve as best of our understanding. These numbers are based on year 2022 to 2024.
                  </Typography.Paragraph>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ position: 'relative' }}>
                  <img src="https://localhost:8443/uploads/acc.png" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '32%', right: '-1%', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '46.5px', color: '#1A1B1E', fontFamily: 'Magnolia Script' }}>$</span>
                      <Counter start={10000} end={200000} duration={2000} suffix="+" style={{ fontSize: '46.5px', fontFamily: 'Magnolia Script' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '48.5%', right: '1.5%', display: 'flex', alignItems: 'center' }}>
                      <Counter start={10} end={200} duration={2000} suffix="+" style={{ fontSize: '46.5px', fontFamily: 'Magnolia Script' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '65.2%', right: '-2%', display: 'flex', alignItems: 'center' }}>
                      <Counter start={1} end={3} duration={2000} suffix=" yrs" style={{ fontSize: '46.5px', fontFamily: 'Magnolia Script' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '83%', right: '-2.8%', display: 'flex', alignItems: 'center' }}>
                      <Counter start={1} end={7} duration={2000} suffix=" yrs" style={{ fontSize: '46.5px', fontFamily: 'Magnolia Script' }} />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="reliable-section">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px', width: '60%' }}>What Makes Us Reliable</h2>
            <div className="reliable-container">
              {reliablePoints.map((point, index) => (
                <div className="reliable-item" key={index}>
                  <div className="reliable-icon">
                    {point.icon}
                  </div>
                  <div className="reliable-content">
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" style={{ padding: '80px 0', zIndex: 1 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 className="services-title" style={{ textAlign: 'center' }}>Our Services</h2>
            <div className="services-tabs-container">
              <div className="services-tabs">
                <div className="service-tab-row">
                  <button
                    className="service-tab wide"
                    onClick={() => navigate('/services#accounting-&-payroll')}
                  >
                    Accounting & Payroll
                  </button>
                </div>
                <div className="service-tab-row">
                  <button
                    className="service-tab"
                    onClick={() => navigate('/services#taxation')}
                  >
                    Taxation
                  </button>
                  <button
                    className="service-tab"
                    onClick={() => navigate('/services#compliance')}
                  >
                    Compliance
                  </button>
                </div>
                <div className="service-tab-row">
                  <button
                    className="service-tab wide"
                    onClick={() => navigate('/services#business-insight-&-advisory')}
                  >
                    Business Insight & Advisory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Values Section */}
        <section className="values-section" style={{ backgroundColor: '#ffffff !important' }}>
          <Title level={2} className="section-title" style={{ textAlign: 'center' }}>Our Professional Values</Title>
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
        <section className="review-section">
          <Title level={2} className="section-title" style={{ textAlign: 'center' }}>What people say about us</Title>
          {reviewsLoading ? (
            <div className="review-loading">
              <Spin size="large" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="review-container">
              <button
                className="review-nav-button review-nav-prev"
                onClick={prevReview}
                style={{ display: reviews.length > 1 ? 'flex' : 'none' }}
              >
                ←
              </button>
              <div className={`review-content ${isTransitioning ? 'fade' : ''}`}>
                <div className="review-rating">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <StarFilled key={i} style={{ color: '#FFD700' }} />
                  ))}
                </div>
                <p className={`review-text ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                  {reviews[currentReview].content}
                </p>
                <div className={`reviewer-info ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                  <img
                    src={reviews[currentReview].profileUrl}
                    alt={reviews[currentReview].name}
                    className="reviewer-image"
                    onError={(e) => {
                      e.target.src = `${process.env.REACT_APP_API_URL}/uploads/default-avatar.jpg`;
                    }}
                  />
                  <h3 className="reviewer-name">{reviews[currentReview].name}</h3>
                  <p className="reviewer-title">{reviews[currentReview].relativeTime}</p>
                </div>
              </div>
              <button
                className="review-nav-button review-nav-next"
                onClick={nextReview}
                style={{ display: reviews.length > 1 ? 'flex' : 'none' }}
              >
                →
              </button>
            </div>
          ) : (
            <div className="no-reviews">
              <p>{reviewsError || 'No reviews available at the moment.'}</p>
            </div>
          )}
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
              maxWidth: '80%',
              margin: '0 auto', // Center the card
              background: '#36a6e6',
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