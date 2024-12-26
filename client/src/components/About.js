import React from "react";
import { Layout, Row, Col, Card, Typography, Space, Button } from "antd";
import { FrontHeader, FrontFooter } from "./FrontPage";
import {
  TeamOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import "./About.css";

import VirtualMeetingSection from './VirtualMeetingSection';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const About = () => {
  const values = [
    {
      icon: <TeamOutlined className="value-icon" />,
      title: "Teamwork",
      description:
        "We believe in the power of collaboration and working together to achieve exceptional results.",
    },
    {
      icon: <TrophyOutlined className="value-icon" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, maintaining the highest standards of quality.",
    },
    {
      icon: <CheckCircleOutlined className="value-icon" />,
      title: "Integrity",
      description:
        "We conduct our business with honesty, transparency, and ethical principles.",
    },
    {
      icon: <HeartOutlined className="value-icon" />,
      title: "Client Focus",
      description:
        "Our clients' success is our priority. We're dedicated to delivering value and exceeding expectations.",
    },
  ];

  const team = [
    {
      name: "John Smith",
      position: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      description:
        "With over 20 years of experience in accounting and finance, John leads our team with vision and expertise.",
    },
    {
      name: "Sarah Johnson",
      position: "Senior Accountant",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      description:
        "Sarah specializes in tax planning and compliance, helping clients navigate complex financial regulations.",
    },
    {
      name: "Michael Chen",
      position: "Financial Advisor",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      description:
        "Michael brings innovative solutions to help businesses grow and achieve their financial goals.",
    },
  ];

  return (
    <Layout className="layout">
      <FrontHeader activeKey="/about-us" />
      <Content>
        <div className="about-container">
          <section className="about-section">
            <Title level={2} className="section-title">About Us</Title>
            <Paragraph className="about-text">
              Nav Accounts is a leading accounting and financial services firm dedicated to helping businesses
              and individuals achieve their financial goals. With years of experience and a team of expert
              professionals, we provide comprehensive solutions tailored to your specific needs.
            </Paragraph>
          </section>

          <section className="values-section">
            <Title level={2} className="section-title">Our Values</Title>
            <Row gutter={[24, 24]}>
              {values.map((value, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card className="value-card">
                    <div className="value-icon-wrapper">{value.icon}</div>
                    <Title level={4} className="value-title">{value.title}</Title>
                    <Paragraph className="value-description">{value.description}</Paragraph>
                  </Card>
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

export default About;