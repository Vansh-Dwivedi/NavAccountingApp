import React from 'react';
import { Layout, Typography, Space, Card } from 'antd';
import styled from 'styled-components';
import { FrontHeader, FrontFooter } from './HeaderFooter';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const StyledContent = styled(Content)`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 180px;
`;

const StyledCard = styled(Card)`
  background: linear-gradient(145deg, #f3f4f6, #ffffff);
  border-radius: 20px;
  box-shadow: 20px 20px 60px #d1d3d5, -20px -20px 60px #ffffff;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 25px 25px 75px #c1c3c5, -25px -25px 75px #ffffff;
  }
`;

const Section = styled.section`
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.02);
  }
`;

const StyledTitle = styled(Title)`
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PrivacyPolicy = () => {
  return (
    <Layout>
      <FrontHeader activeKey="/privacy" />
      <StyledContent>
        <StyledCard>
          <StyledTitle level={1}>Privacy Policy</StyledTitle>
          <Paragraph>
            <Text strong>Effective Date: 30th January, 2025</Text>
          </Paragraph>
          <Paragraph>
            Nav Accounts ("we," "our," or "us") is committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. This Privacy Policy describes how we collect, use, disclose, and protect your information when you visit our website, use our services, or otherwise interact with us.
          </Paragraph>

          <Section>
            <StyledTitle level={2}>1. Information We Collect</StyledTitle>
            <Paragraph>We collect various types of information, including but not limited to:</Paragraph>
            
            <StyledTitle level={3}>A. Personal Information:</StyledTitle>
            <ul>
              <li>Name, address, phone number, email address</li>
              <li>Business information, including entity type and financial details</li>
              <li>Tax identification numbers and other compliance-related data</li>
              <li>Payment information for invoicing and service payments</li>
            </ul>

            <StyledTitle level={3}>B. Non-Personal Information:</StyledTitle>
            <ul>
              <li>IP address, browser type, operating system, and device information</li>
              <li>Website usage data, such as pages visited and time spent on our website</li>
            </ul>

            <StyledTitle level={3}>C. Sensitive Information:</StyledTitle>
            <Paragraph>
              We may collect sensitive financial and tax-related information necessary for our services, ensuring strict compliance with relevant security regulations.
            </Paragraph>
          </Section>

          <Section>
            <StyledTitle level={2}>2. How We Use Your Information</StyledTitle>
            <ul>
              <li>To provide accounting, bookkeeping, payroll, and compliance-related services</li>
              <li>To process payments and send invoices</li>
              <li>To comply with legal and regulatory obligations (IRS, SOC 2, CCPA, etc.)</li>
              <li>To improve our website functionality and enhance user experience</li>
              <li>To communicate with you regarding service updates, compliance reminders, and offers</li>
              <li>To prevent fraud, unauthorized access, or security breaches</li>
            </ul>
          </Section>

          <Section>
            <StyledTitle level={2}>3. Data Protection and Security</StyledTitle>
            <Paragraph>We implement industry-standard security measures, including but not limited to:</Paragraph>
            <ul>
              <li>PDPA Compliance: Ensuring personal data protection under applicable laws</li>
              <li>ECPA Compliance: Protecting electronic communication access and disclosure</li>
              <li>NIST Framework: Adhering to cybersecurity best practices</li>
              <li>CCPA Compliance: Providing rights to California consumers regarding data privacy</li>
              <li>IRS Data Security Regulations: Safeguarding sensitive tax-related information</li>
              <li>SOC 2 Compliance: Ensuring security, availability, and confidentiality of client data</li>
              <li>CSA Guidelines: Adopting cloud security best practices to protect stored information</li>
            </ul>
          </Section>

          <Section>
            <StyledTitle level={2}>4. Sharing of Information</StyledTitle>
            <Paragraph>
              We do not sell or rent your personal information to third parties. However, we may share your information in the following situations:
            </Paragraph>
            <ul>
              <li>Service Providers & Partners: We may share data with trusted service providers who assist in delivering our services</li>
              <li>Legal Compliance: We may disclose information if required by law, government authorities, or regulatory bodies</li>
              <li>Business Transfers: In case of a merger, acquisition, or sale of assets, your information may be transferred to the new entity</li>
            </ul>
          </Section>

          <Section>
            <StyledTitle level={2}>10. Contact Us</StyledTitle>
            <Paragraph>
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </Paragraph>
            <Space direction="vertical">
              <Text strong>Nav Accounts</Text>
              <Text>1469 Butte House Road, Suite E, Yuba City, CA 95993</Text>
              <Text>Email: navaccounts@yahoo.com</Text>
              <Text>Phone: 530-777-3265</Text>
            </Space>
          </Section>
        </StyledCard>
      </StyledContent>
      <FrontFooter />
    </Layout>
  );
};

export default PrivacyPolicy;
