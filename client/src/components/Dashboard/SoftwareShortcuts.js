import React, { useState } from 'react';
import { Button, List, Tooltip, Modal, TimePicker, Select, Space, Typography, message, InputNumber, Input } from 'antd';
import {
  FilePdfOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import moment from 'moment-timezone';
import EmployeeNotesSection from './EmployeeNotesSection'; // Import the EmployeeNotesSection component
import { useReducer } from 'react';

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

// Modal component for displaying and managing time clock functionality
const TimeClockModal = ({ visible, onClose }) => {
  // State to track selected timezone, defaults to user's local timezone
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
  
  return (
    <Modal
      title="Time Clock"
      visible={visible}
      onCancel={onClose}
      footer={null} // No footer buttons needed
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Timezone selector dropdown */}
        <Select
          style={{ width: '100%' }}
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        >
          {/* Map all available timezones to dropdown options */}
          {moment.tz.names().map(tz => (
            <Option key={tz} value={tz}>{tz}</Option>
          ))}
        </Select>
        
        {/* Clock display section */}
        <div className="clock-display" style={{ 
          textAlign: 'center',
          padding: '40px',
          background: '#f0f2f5',
          borderRadius: '10px',
          margin: '20px 0'
        }}>
          {/* Current time in selected timezone */}
          <Title level={1} style={{ fontFamily: 'monospace' }}>
            {moment().tz(selectedTimezone).format('HH:mm:ss')}
          </Title>
          {/* Current date in selected timezone */}
          <Text type="secondary">
            {moment().tz(selectedTimezone).format('MMMM Do YYYY')}
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

// Reducer for managing calculator state
const calculatorReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DISPLAY':
      return { ...state, display: action.value };
    case 'UPDATE_OPERAND':
      return { ...state, operand: action.value };
    case 'UPDATE_OPERATOR':
      return { ...state, operator: action.value };
    case 'CLEAR':
      return { display: '', operand: '', operator: '' };
    case 'SET_OPERAND':
      return { ...state, operand: action.value };
    case 'SET_OPERATOR':
      return { ...state, operator: action.value };
    case 'CALCULATE':
      const result = eval(`${state.operand} ${state.operator} ${state.display}`);
      return { display: result.toString(), operand: '', operator: '' };
    default:
      return state;
  }
};

const ScientificCalculator = () => {
  const [{ display, operand, operator }, dispatch] = useReducer(calculatorReducer, { display: '', operand: '', operator: '' });

  const handleNumberClick = (number) => {
    dispatch({ type: 'UPDATE_DISPLAY', value: display + number });
  };

  const handleOperatorClick = (op) => {
    dispatch({ type: 'SET_OPERATOR', value: op });
    dispatch({ type: 'SET_OPERAND', value: display });
    dispatch({ type: 'UPDATE_DISPLAY', value: '' });
  };

  const handleCalculate = () => {
    dispatch({ type: 'CALCULATE' });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const handleFunctionClick = (func) => {
    let result;
    switch (func) {
      case 'sqrt':
        result = Math.sqrt(parseFloat(display));
        break;
      case 'sin':
        result = Math.sin(parseFloat(display) * (Math.PI / 180));
        break;
      case 'cos':
        result = Math.cos(parseFloat(display) * (Math.PI / 180));
        break;
      case 'tan':
        result = Math.tan(parseFloat(display) * (Math.PI / 180));
        break;
      default:
        return;
    }
    dispatch({ type: 'UPDATE_DISPLAY', value: result.toString() });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#282c34', borderRadius: '10px' }}>
      <h2 style={{ color: 'white' }}>Scientific Calculator</h2>
      <input
        type="text"
        value={display}
        readOnly
        style={{ width: '100%', textAlign: 'right', padding: '10px', fontSize: '24px', borderRadius: '5px', border: 'none', color: 'black' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
        <Button onClick={handleClear}>C</Button>
        <Button onClick={() => handleFunctionClick('sqrt')}>√</Button>
        <Button onClick={() => handleFunctionClick('sin')}>sin</Button>
        <Button onClick={() => handleFunctionClick('cos')}>cos</Button>
        <Button onClick={() => handleFunctionClick('tan')}>tan</Button>
        <Button onClick={() => handleNumberClick('7')}>7</Button>
        <Button onClick={() => handleNumberClick('8')}>8</Button>
        <Button onClick={() => handleNumberClick('9')}>9</Button>
        <Button onClick={() => handleOperatorClick('/')}>/</Button>
        <Button onClick={() => handleNumberClick('4')}>4</Button>
        <Button onClick={() => handleNumberClick('5')}>5</Button>
        <Button onClick={() => handleNumberClick('6')}>6</Button>
        <Button onClick={() => handleOperatorClick('*')}>*</Button>
        <Button onClick={() => handleNumberClick('1')}>1</Button>
        <Button onClick={() => handleNumberClick('2')}>2</Button>
        <Button onClick={() => handleNumberClick('3')}>3</Button>
        <Button onClick={() => handleOperatorClick('-')}>-</Button>
        <Button onClick={() => handleNumberClick('0')}>0</Button>
        <Button onClick={handleCalculate}>=</Button>
        <Button onClick={() => handleOperatorClick('+')}>+</Button>
      </div>
    </div>
  );
};

const SoftwareShortcuts = () => {
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [calculatorModalVisible, setCalculatorModalVisible] = useState(false);
  const [timeClockVisible, setTimeClockVisible] = useState(false);

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
      action: () => setNotesModalVisible(true),
      description: "Open employee notes"
    },
    {
      name: "Calculator",
      icon: <CalculatorOutlined />,
      action: () => setCalculatorModalVisible(true),
      description: "Open calculator"
    },
    {
      name: "Music Detox",
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
              >
                <span>{item.name}</span>
              </Button>
            </Tooltip>
          </List.Item>
        )}
      />

      <Modal
        title="Employee Notes"
        visible={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={null}
        width={600}
      >
        <EmployeeNotesSection />
      </Modal>

      <Modal
        title="Scientific Calculator"
        visible={calculatorModalVisible}
        onCancel={() => setCalculatorModalVisible(false)}
        footer={null}
        width={400}
      >
        <ScientificCalculator />
      </Modal>

      <TimeClockModal 
        visible={timeClockVisible}
        onClose={() => setTimeClockVisible(false)}
      />
    </>
  );
};

export default SoftwareShortcuts; 