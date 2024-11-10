import React, { useState } from 'react';
import { Button, List, Tooltip, Modal, TimePicker, Select, Space, Typography, message } from 'antd';
import {
  FilePdfOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import moment from 'moment-timezone';

const Title = Typography;
const Text = Typography;
const Option = Select;

// Replace window.require with a safe electron import
const electron = window?.electron || {
  ipcRenderer: {
    on: () => {},
    send: () => {},
    removeAllListeners: () => {}
  }
};

const { ipcRenderer } = electron;

const TimeClockModal = ({ visible, onClose }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
  
  return (
    <Modal
      title="Time Clock"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Select
          style={{ width: '100%' }}
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        >
          {moment.tz.names().map(tz => (
            <Option key={tz} value={tz}>{tz}</Option>
          ))}
        </Select>
        
        <div className="clock-display" style={{ 
          textAlign: 'center',
          padding: '40px',
          background: '#f0f2f5',
          borderRadius: '10px',
          margin: '20px 0'
        }}>
          <Title level={1} style={{ fontFamily: 'monospace' }}>
            {moment().tz(selectedTimezone).format('HH:mm:ss')}
          </Title>
          <Text type="secondary">
            {moment().tz(selectedTimezone).format('MMMM Do YYYY')}
          </Text>
        </div>
        
        <TimePicker.RangePicker 
          style={{ width: '100%' }}
          format="HH:mm"
        />
      </Space>
    </Modal>
  );
};

const SoftwareShortcuts = () => {
  const [timeClockVisible, setTimeClockVisible] = useState(false);

  // Listen for native app errors
  React.useEffect(() => {
    ipcRenderer.on('native-app-error', (event, { appName, error }) => {
      message.error(`Failed to open ${appName}: ${error}`);
    });

    return () => {
      ipcRenderer.removeAllListeners('native-app-error');
    };
  }, []);

  const openNativeApp = (appName) => {
    try {
      ipcRenderer.send('open-native-app', appName);
    } catch (error) {
      message.error(`Failed to open ${appName}`);
    }
  };

  const shortcuts = [
    {
      name: "Office 365",
      icon: <FilePdfOutlined />,
      url: "https://www.office.com",
      description: "Access Office 365 suite"
    },
    {
      name: "Adobe PDF",
      icon: <FilePdfOutlined />,
      url: "https://acrobat.adobe.com",
      description: "Open Adobe PDF editor"
    },
    {
      name: "Timeclock",
      icon: <ClockCircleOutlined />,
      action: () => setTimeClockVisible(true),
      description: "Track your work hours"
    },
    {
      name: "Notepad",
      icon: <FileTextOutlined />,
      action: () => openNativeApp('notepad'),
      description: "Open system notepad"
    },
    {
      name: "Calculator",
      icon: <CalculatorOutlined />,
      action: () => openNativeApp('calculator'),
      description: "Open system calculator"
    },
    {
      name: "Music Stress Detox",
      icon: <CustomerServiceOutlined />,
      url: "https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP",
      description: "Listen to relaxing music"
    },
  ];

  return (
    <>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={shortcuts}
        renderItem={(item) => (
          <List.Item>
            <Tooltip title={item.description}>
              <Button
                icon={item.icon}
                onClick={() => item.url ? window.open(item.url, '_blank') : item.action()}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s'
                }}
                className="shortcut-button"
              >
                <span>{item.name}</span>
              </Button>
            </Tooltip>
          </List.Item>
        )}
      />
      
      <TimeClockModal 
        visible={timeClockVisible}
        onClose={() => setTimeClockVisible(false)}
      />
    </>
  );
};

export default SoftwareShortcuts; 