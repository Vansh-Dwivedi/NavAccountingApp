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
    <div ref={countRef} className="acc-number">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminsCount, setAdminsCount] = useState(0);
  const [managersCount, setManagersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [reviews, setReviews] = useState([]);
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
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await api.get('/api/google-reviews');
        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          setReviewsError('Failed to load reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError(error.response?.data?.message || 'Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

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

  const [currentReview, setCurrentReview] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reviewsData = [
    {
      name: "Jawad Bath",
      title: "Local Guide",
      content: "Nav Accounts was amazing. I had such a great experience. Made me feel at ease with great results. Professional, accurate, knowledgeable, and friendly. I would highly recommend to anyone that asks, knowing they would be in good hands.",
      rating: 5,
      relativeTime: "1 week ago"
    },
    {
      name: "Charanjit Sidhu",
      title: "Client",
      content: "She is Very Friendly Cooperative And responsible. She File My Yearly tax. She Is Good 👍 I Highly Recommend Her",
      rating: 5,
      relativeTime: "1 week ago"
    },
    {
      name: "Sofia Ahmed",
      title: "Local Guide",
      content: "I am extremely satisfied with the exceptional services provided by NAV accounts Yuba city. They handle my bookkeeping, payroll, and tax return with utmost professionalism and efficiency. Their punctuality is commendable.",
      rating: 5,
      relativeTime: "11 months ago"
    },
    {
      name: "Manpreet singh",
      title: "Client",
      content: "From the moment I walked in, I was greeted by the most humble and friendly team. Their language-friendly approach made me feel comfortable and valued as a customer.",
      rating: 5,
      relativeTime: "11 months ago"
    },
    {
      name: "Fateh Singh",
      title: "Client",
      content: "She is really Good doing all and she knows how to take care of all your tax stuff. So nice people, highly recommend.",
      rating: 5,
      relativeTime: "2 years ago"
    },
    {
      name: "Ramandeep Shergill",
      title: "Client",
      content: "She's good at her job. She takes care of all the work; you don't need to worry or stress about anything.",
      rating: 5,
      relativeTime: "2 years ago"
    },
    {
      name: "Robin Sharma",
      title: "Client",
      content: "Very professional and it's great working with her 👍🏻",
      rating: 5,
      relativeTime: "10 months ago"
    },
    {
      name: "J S",
      title: "Client",
      content: "NO.1 TAX SERVICES IN YUBA CITY. THEY ARE VERY PROFESSIONAL & GOOD ADVISORS TO FILE ALL TAXES.",
      rating: 5,
      relativeTime: "1 year ago"
    }
  ];

  useEffect(() => {
    setReviews(reviewsData);
  }, []);

  const nextReview = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentReview((prev) => (prev + 1) % reviewsData.length);
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection('');
      }, 300);
    }, 300);
  };

  const prevReview = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection('right');
    setTimeout(() => {
      setCurrentReview((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection('');
      }, 300);
    }, 300);
  };

  useEffect(() => {
    let slideInterval;
    const slideDelay = 5000; // Change slide every 5 seconds

    if (!isTransitioning) {
      slideInterval = setInterval(() => {
        nextReview();
      }, slideDelay);
    }

    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isTransitioning]);

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
              width: '80%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              imageRendering: 'crisp-edges',
              marginTop: '-50px',
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

        <section className="who-we-are-section">
          <div className="who-we-are-container">
            <Title level={2} className="section-title who-we-are-title">Who We are</Title>
            <div className="who-we-are-content">
              <Typography.Paragraph className="who-we-are-paragraph">
                Nav Accounts is owned by Navrisham Khaira as a solopreneur. She is passionate about helping individuals and businesses navigate the complexities of tax laws to maximize savings and ensure long-term financial success, along with sharing tech-associated compliance with small business owners for data protection.
              </Typography.Paragraph>
              <Typography.Paragraph className="who-we-are-paragraph-second">
                We talk only when we had achieved for real. That makes countable for your opportunities to assist you with our business solution with our commitment to serve as best of our understanding. These numbers are based on year 2022 to 2024.
              </Typography.Paragraph>
            </div>
          </div>
        </section>

        <section className="reliable-section">
          <div className="container">
            <h2 className="services-title">What Makes Us Reliable</h2>
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
        <section id="services" className="services-section">
          <div className="services-section-container">
            <h2 className="section-title">Our Services</h2>
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

        {/* Reviews Section */}
        <section className="review-section">
          <Title level={2} className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>What People Say About Us</Title>
          <div className="review-container">
            <button
              className="review-nav-button review-nav-prev"
              onClick={prevReview}
              style={{ display: reviewsData.length > 1 ? 'flex' : 'none' }}
            >
              ←
            </button>
            <div className={`review-content ${isTransitioning ? 'fade' : ''}`}>
              <div className="review-rating">
                {[...Array(reviewsData[currentReview].rating)].map((_, i) => (
                  <StarFilled key={i} style={{ color: '#FFD700' }} />
                ))}
              </div>
              <p className={`review-text ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                "{reviewsData[currentReview].content}"
              </p>
              <div className={`reviewer-info ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                <h3 className="reviewer-name">{reviewsData[currentReview].name}</h3>
                <p className="reviewer-title">{reviewsData[currentReview].title}</p>
                <p className="review-time">{reviewsData[currentReview].relativeTime}</p>
              </div>
              <div className="review-dots">
                {reviewsData.map((_, index) => (
                  <span 
                    key={index} 
                    className={`review-dot ${index === currentReview ? 'active' : ''}`}
                    onClick={() => {
                      if (index !== currentReview) {
                        setSlideDirection(index > currentReview ? 'left' : 'right');
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentReview(index);
                          setTimeout(() => {
                            setIsTransitioning(false);
                            setSlideDirection('');
                          }, 300);
                        }, 300);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              className="review-nav-button review-nav-next"
              onClick={nextReview}
              style={{ display: reviewsData.length > 1 ? 'flex' : 'none' }}
            >
              →
            </button>
          </div>
        </section>
        <GetStartedSteps style={{  }}/>
        <VirtualMeetingSection />

        {/* Accomplishments Section */}
        <div className="acc-section">
          <h2 className="acc-title">Our Accomplishments</h2>
          <div className="acc-grid">
            <div className="acc-item">
              <div className="acc-icon-circle">
                <CalculatorOutlined className="acc-icon" />
              </div>
              <div>
                <div className="acc-number">
                  <Counter start={0} end={200000} duration={2000} suffix="+" />
                </div>
                <div className="acc-label">Tax Saved</div>
              </div>
            </div>
            <div className="acc-item">
              <div className="acc-icon-circle">
                <TeamOutlined className="acc-icon" />
              </div>
              <div>
                <div className="acc-number">
                  <Counter start={0} end={200} duration={2000} suffix="+" />
                </div>
                <div className="acc-label">Of our clients recommend us</div>
              </div>
            </div>
            <div className="acc-item">
              <div className="acc-icon-circle">
                <StarFilled className="acc-icon" />
              </div>
              <div>
                <div className="acc-number">
                  <Counter start={0} end={3} duration={1500} suffix="+" />
                </div>
                <div className="acc-label">Year in operations</div>
              </div>
            </div>
            <div className="acc-item">
              <div className="acc-icon-circle">
                <TrophyOutlined className="acc-icon" />
              </div>
              <div>
                <div className="acc-number">
                  <Counter start={0} end={7} duration={1500} suffix="+" />
                </div>
                <div className="acc-label">Licensed as IRS Enrolled Agent</div>
              </div>
            </div>
          </div>
        </div>

        <FrontFooter />
      </Layout>
    </>
  );
};

export default Home;