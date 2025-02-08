import React from 'react';
import { Layout, Typography, Row, Col, Timeline, Card, Image } from 'antd';
import { 
  BankOutlined, 
  TeamOutlined, 
  RocketOutlined, 
  TrophyOutlined, 
  FlagOutlined, 
  StarOutlined, 
  CheckCircleOutlined, 
  BulbOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';
import { FrontFooter } from './HeaderFooter';
import { createUseStyles } from 'react-jss';
import GetStartedSteps from './GetStartedSteps';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Hero from './Hero';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const useStyles = createUseStyles({
  container: {
    paddingTop: 84,
    minHeight: '100vh',
    background: '#fff'
  },
  section: {
    padding: '60px 24px',
    maxWidth: 1200,
    margin: '0 auto',
    '& h2': {
      marginBottom: 40,
      textAlign: 'center',
      color: '#001529'
    },
    '& h3': {
      marginBottom: 24,
      color: '#001529'
    }
  },
  intro: {
    textAlign: 'center',
    marginBottom: 60,
    '& p': {
      fontSize: 18,
      lineHeight: 1.6,
      color: '#666',
      maxWidth: 800,
      margin: '0 auto'
    }
  },
  journey: {
    background: '#f8f9fa',
    '& .ant-timeline': {
      maxWidth: 800,
      margin: '0 auto'
    },
    '& .ant-timeline-item-content': {
      padding: '0 0 0 24px'
    }
  },
  timelineCard: {
    marginBottom: 24,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: 'none',
    '& .ant-card-head': {
      borderBottom: 'none',
      paddingBottom: 0
    },
    '& .ant-card-body': {
      padding: 24
    },
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    '& p': {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#4a4a4a',
      marginBottom: '1rem',
      '&:last-child': {
        marginBottom: 0
      }
    }
  },
  timelineIcon: {
    fontSize: 24,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    padding: 16,
    borderRadius: '50%',
    marginRight: 16,
    zIndex: 1000000000
  },
  timelineYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: 8
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001529',
    marginBottom: 8
  },
  timelineDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 1.6
  },
  aboutCard: {
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    background: '#fff',
    marginBottom: '2rem'
  },
  ownerName: {
    fontSize: '2rem',
    color: '#001529',
    marginBottom: '1.5rem',
    fontWeight: 'bold'
  },
  aboutText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#4a4a4a',
    marginBottom: '1.5rem'
  },
  timeline: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '6px',
      background: 'linear-gradient(to bottom, #1890ff, #00c6ff)',
      top: '0',
      bottom: '0',
      left: '50%',
      marginLeft: '-3px',
      borderRadius: '3px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
    }
  },
  timelineItem: {
    padding: '10px 40px',
    position: 'relative',
    backgroundColor: 'inherit',
    width: '50%',
    '&:nth-child(odd)': {
      left: '0',
      '&::before': {
        content: '""',
        height: '0',
        position: 'absolute',
        top: '22px',
        width: '0',
        zIndex: '1',
        right: '30px',
        border: 'medium solid #fff',
        borderWidth: '10px 0 10px 10px',
        borderColor: 'transparent transparent transparent #fff'
      }
    },
    '&:nth-child(even)': {
      left: '50%',
      '&::before': {
        content: '""',
        height: '0',
        position: 'absolute',
        top: '22px',
        width: '0',
        zIndex: '1',
        left: '30px',
        border: 'medium solid #fff',
        borderWidth: '10px 10px 10px 0',
        borderColor: 'transparent #fff transparent transparent'
      }
    }
  },
  timelineContent: {
    padding: '20px 30px',
    backgroundColor: '#fff',
    position: 'relative',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
    }
  },
  timelineIcon: {
    position: 'absolute',
    backgroundColor: '#1890ff',
    border: '4px solid #fff',
    borderRadius: '50%',
    height: '40px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    right: '-20px',
    top: '15px',
    zIndex: '999999999999999',
    boxShadow: '0 0 0 4px rgba(24, 144, 255, 0.2)'
  }
});

const About = () => {
  const classes = useStyles();

  const coreValues = [
    {
      icon: <CheckCircleOutlined />,
      title: "Integrity",
      description: "We maintain the highest standards of professional ethics and transparency."
    },
    {
      icon: <TeamOutlined />,
      title: "Community",
      description: "Committed to uplifting our local community and empowering youth."
    },
    {
      icon: <StarOutlined />,
      title: "Excellence",
      description: "Delivering exceptional service and results for every client."
    },
    {
      icon: <BulbOutlined />,
      title: "Innovation",
      description: "Embracing modern solutions while maintaining traditional expertise."
    }
  ];

  return (
    <Layout>
      <Content className={classes.container}>
        <Hero
          title="About Us"
          description="Learn more about our mission, values, and the team behind Nav Accounts."
          backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.jpg`}
          style={{
            marginTop: '130px'
          }}
        />
        <div className={classes.container}>
          <section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {/* Slider Section */}
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <Slider
                dots={true}
                infinite={true}
                speed={800}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={4000}
                pauseOnHover={true}
                fade={true}
                cssEase="linear"
              >
                {['new-clients-about.png', 'open-for-virtual-about.png', 'stress-free-about.png'].map((img, index) => (
                  <div key={index} style={{ height: '600px' }}>
                    <Image
                      src={`${process.env.REACT_APP_API_URL}/uploads/${img}`} 
                      alt={img.split('-')[0]}
                      style={{
                        width: '600px',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5'
                      }}
                      preview={false}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Profile Section */}
            <div style={{ 
              width: '100%',
              maxWidth: '1200px',
              margin: '2rem auto',
              padding: '2rem',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <img 
                  src={`${process.env.REACT_APP_API_URL}/uploads/navrisham.png`}
                  alt="Navrisham Khaira"
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <h2 style={{ 
                  fontSize: '2rem',
                  color: '#002E6D',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  Meet Navrisham Khaira, IRS Enrolled Agent
                </h2>
              </div>
              <Paragraph className={classes.aboutText}>
                Navrisham Khaira is the proud owner of Nav Accounts as solopreneur, bringing in over 7 years of expertise in tax preparation, accounting, and financial planning. She's an IRS Enrolled Agent, active since 2018, with a Graduation in Commerce and hands-on experience in both traditional and modern accounting practices.
              </Paragraph>
              <Paragraph className={classes.aboutText}>
                She is passionate about helping individuals and businesses navigate the complexities of tax laws to maximize savings and ensure long-term financial success, along with sharing tech associated compliance with small business owners data protection.
              </Paragraph>
              <Paragraph className={classes.aboutText}>
                Specializing in personal and business taxes, payroll reporting, sales taxes, and tax resolution, Nav has successfully saved her clients up to $50,000 in tax letters over the past two years. She works closely with local clients, focusing on uplifting the community, especially empowering the youth.
              </Paragraph>
              <Paragraph className={classes.aboutText}>
                Since 2020 Due to her passion and devotion to her profession, Navrisham Khaira has been handing in everything by herself. We're a relatively young firm, founded in 2022, and have become a member of Yuba City Chamber of Commerce. We're excited to see what the future awaits.
              </Paragraph>
            </div>
          </section>

          {/* Achievements Section */}
          <section style={{
            padding: '60px 0',
            backgroundColor: '#f8f9fa',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: '#002E6D',
                marginBottom: '40px',
                fontWeight: 'bold'
              }}>Our Achievements</h2>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '30px'
              }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Image
                    key={num}
                    src={`${process.env.REACT_APP_API_URL}/uploads/${num}aa.png`}
                    alt={`${num}`}
                    style={{
                      width: '250px',
                      height: 'auto',
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                marginTop: '30px',
                maxWidth: '800px',
                margin: '30px auto 0'
              }}>
                Our commitment to excellence has earned us prestigious recognitions, showcasing our dedication to providing top-tier financial services.
              </p>
            </div>
          </section>

          <div style={{
            fontSize: '2.5rem',
            color: '#002E6D',
            marginBottom: '40px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Our Journey</div>
          <Timeline className={classes.timeline} mode="alternate">
            <Timeline.Item dot={<RocketOutlined className={classes.timelineIcon} style={{ zIndex: 999999999999999 }}/>}>
              <Card
                title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>2020 – The year we initiated</span>}
                bordered={false}
                className={classes.timelineCard}
              >
                <p>Nav used to prepare taxes from her apartment, she used to meet at Starbucks for Client interactions. The firm's name was her full name Navrisham K Khaira E.A. This journey starts same till 2022.</p>
              </Card>
            </Timeline.Item>

            <Timeline.Item dot={<BankOutlined className={classes.timelineIcon} style={{ zIndex: 999999999999999 }}/>}>
              <Card
                title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>2022 – Official Registered</span>}
                bordered={false}
                className={classes.timelineCard}
              >
                <p>From this year Our Practice got officially registered with City as Sole Proprietorship as Navrisham Khaira E.A. DBA with Nav Accounts. We become part of Yuba city Chamber of Commerce.</p>
                <p>Able to offer more services associated with Sales Tax Reporting, Accounting, preparation for Financial Statements. Grateful for yuba city community to showing trust in our work style and opportunities to serve with best of our understanding in the matter of tax and accounting; referring us clients.</p>
              </Card>
            </Timeline.Item>

            <Timeline.Item dot={<TrophyOutlined className={classes.timelineIcon} style={{ zIndex: 999999999999999 }}/>}>
              <Card
                title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>2024 – Advancing with Compliance</span>}
                bordered={false}
                className={classes.timelineCard}
              >
                <p>We added more services in the form Business Compliance, which is not limited to Business formation, obtaining city licenses, Renewals, updating the licenses, assistance with Worker Comp Audit, Payroll Representation, Wholesale, Retail for Product line & food Focus along with Transportation Industry compliance from Licensing to reporting other than IRP Plates are now available.</p>
              </Card>
            </Timeline.Item>

            <Timeline.Item dot={<GlobalOutlined className={classes.timelineIcon} style={{ zIndex: 999999999999999 }}/>}>
              <Card
                title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>2025 – Location freedom</span>}
                bordered={false}
                className={classes.timelineCard}
              >
                <p>This year onward, we are open for virtual meetings for clients who want to work with us but are unable to connect with us due to traffic distance, Time zone concerns, we would like to work with your concerns, at your space with our services. Let's Connect and address your financial concerns together.</p>
              </Card>
            </Timeline.Item>
          </Timeline>
          <GetStartedSteps />
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default About;