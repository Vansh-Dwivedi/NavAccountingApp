import React from 'react';
import { Layout, Typography, Card, Row, Col, Space } from 'antd';
import { FrontFooter } from './HeaderFooter';
import { UserOutlined, FileSearchOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Hero from './Hero';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Employment = () => {
  const requirements = [
    {
      icon: <UserOutlined style={{ fontSize: '24px', color: '#002E6D' }} />,
      title: "Qualifications",
      content: "Graduate of Accounting, Tax, Economics with at least 2 years of front desk experience."
    },
    {
      icon: <FileSearchOutlined style={{ fontSize: '24px', color: '#002E6D' }} />,
      title: "Skills Required",
      content: "High level tax preparation skills, superior tax research and problem-solving abilities, broad software knowledge, and excellent written and oral communication skills."
    },
    {
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#002E6D' }} />,
      title: "Work Approach",
      content: "Team approach to providing high quality client service for tax compliance, planning, financial statements, and general business consulting."
    }
  ];

  return (
    <Layout>
      <Content>
      <Hero
        title="Employment Opportunities"
        description="Join Our Team of Financial Professionals"
        backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.jpg`}
      />
      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card 
            style={{ 
              marginBottom: '40px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '12px'
            }}
          >
            <Title level={3} style={{ color: '#002E6D', marginBottom: '20px' }}>
              We're Hiring!
            </Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Nav Accounts is seeking professional, hard-working individuals to join our team. The Firm demands independence, integrity, objectivity, competence and due care from all its personnel in the conduct of its engagements.
            </Paragraph>
          </Card>
        </motion.div>

        {/* Requirements Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          {requirements.map((item, index) => (
            <Col xs={24} md={8} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  style={{ 
                    height: '267.56px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '12px'
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                    {item.icon}
                    <Title level={4} style={{ color: '#002E6D', margin: '16px 0' }}>
                      {item.title}
                    </Title>
                    <Text style={{ fontSize: '16px' }}>
                      {item.content}
                    </Text>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card 
            style={{ 
              marginBottom: '40px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '12px'
            }}
          >
            <Title level={3} style={{ color: '#002E6D', marginBottom: '20px' }}>
              Our Professional Standards
            </Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Our Firm is structured to provide leadership in achieving high quality professional performance while maintaining the concept of individual responsibility. Policies and procedures have been established providing assurance that professional engagements are properly planned and executed. Decisions are based on the substance of issues, not on form.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Our policies and procedures designate Partners of the Firm for consultation on significant ethical, technical and industry questions. The policies and procedures are designed to ensure that clients receive the best professional services we can provide. We continually keep in mind the public interest. We expect our Partners and Associates to identify and resolve all important engagement issues.
            </Paragraph>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card 
            style={{ 
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '12px'
            }}
          >
            <MailOutlined style={{ fontSize: '36px', color: '#002E6D', marginBottom: '20px' }} />
            <Title level={3} style={{ color: '#002E6D', marginBottom: '20px' }}>
              Apply Now
            </Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Please mail your resume with the copy of degrees to:
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              <strong>Nav Accounts</strong><br />
              1469 Butte House Road Suite E,<br />
              Yuba City, CA 95993
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              <strong>Fax:</strong> 530-777-2201
            </Paragraph>
          </Card>
        </motion.div>
      </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Employment;
