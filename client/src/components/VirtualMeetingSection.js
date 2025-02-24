import React from 'react';
import { Button, Typography } from 'antd';
import { VideoCameraOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './VirtualMeetingSection.css';

const { Title } = Typography;

const VirtualMeetingSection = () => {
  return (
    <div className="virtual-meeting-section" style={{ backgroundColor: '#1677ff', width: '800px', margin: '0 auto', padding: '60px 20px' }}>
      <div className="meeting-content">
        <Title level={2} style={{ color: "#000080" }}>Schedule a Meeting</Title>
        <p style={{ color: "#000080 !important" }}>Book a virtual consultation with our experts to discuss your needs</p>
        <div className="meeting-buttons">
          <Button 
            type="primary" 
            size="large" 
            icon={<VideoCameraOutlined />}
            onClick={() => window.open('https://calendly.com/khairanavbuz/30min', '_blank')}
          >
            Schedule Virtual Meeting
          </Button>
          <Button 
            size="large" 
            icon={<EnvironmentOutlined />}
            onClick={() => window.open('https://www.google.com/maps/place/Nav+Accounts/@39.1473763,-121.6405844,17z/data=!3m1!4b1!4m6!3m5!1s0x8084ab8555da51cf:0x7aa0c4ef0385ea95!8m2!3d39.1473763!4d-121.6405844!16s%2Fg%2F11py9_4tpc?entry=ttu', '_blank')}
          >
            View on Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualMeetingSection;
