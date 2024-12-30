import React from 'react';
import { Layout, Typography, Row, Col, Timeline, Card } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  RocketOutlined,
  TrophyOutlined,
  FlagOutlined,
  StarOutlined
} from '@ant-design/icons';
import { FrontHeader, FrontFooter } from './Header&Footer';
import { createUseStyles } from 'react-jss';

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
    }
  },
  timelineIcon: {
    fontSize: 24,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    padding: 16,
    borderRadius: '50%',
    marginRight: 16
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
  }
});

const About = () => {
  const classes = useStyles();

  const journeyMilestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started as a personal practice, meeting clients at Starbucks and working from an apartment. Operating under Navrisham K Khaira E.A.',
      icon: <RocketOutlined />
    },
    {
      year: '2022',
      title: 'Official Registration',
      description: 'Registered as Nav Accounts, joined Yuba City Chamber of Commerce. Expanded services to include Sales Tax Reporting and Financial Statement preparation.',
      icon: <TrophyOutlined />
    },
    {
      year: '2024',
      title: 'Service Expansion',
      description: 'Added comprehensive Business Compliance services, including business formation, licensing, and industry-specific compliance solutions. Became a member of NFIB.',
      icon: <BankOutlined />
    },
    {
      year: '2025',
      title: 'Virtual Evolution',
      description: 'Launching virtual meeting capabilities to serve clients across different time zones and locations, making our services more accessible than ever.',
      icon: <StarOutlined />
    }
  ];

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
      <FrontHeader activeKey="/about-us" />
      <Content>
        <div className={classes.container}>
          <section className={classes.section}>
            <div className={classes.intro}>
              <Title level={2}>About Nav Accounts</Title>
              <Paragraph>
                Your trusted partner in financial success since 2020. We're committed to providing exceptional accounting and tax services with integrity and expertise.
              </Paragraph>
            </div>
          </section>

          <section className={classes.section}>
            <Title level={2}>Our Core Values</Title>
            <Row gutter={[24, 24]}>
              {coreValues.map((value, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card>
                    {value.icon}
                    <Title level={4}>{value.title}</Title>
                    <Paragraph>
                      {value.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          <section className={`${classes.section} ${classes.journey}`}>
            <Title level={2}>Our Journey</Title>
            <Timeline mode="alternate">
              {journeyMilestones.map((milestone, index) => (
                <Timeline.Item 
                  key={index}
                  dot={<span className={classes.timelineIcon}>{milestone.icon}</span>}
                >
                  <Card className={classes.timelineCard}>
                    <div className={classes.timelineYear}>{milestone.year}</div>
                    <div className={classes.timelineTitle}>{milestone.title}</div>
                    <div className={classes.timelineDescription}>{milestone.description}</div>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </section>
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default About;