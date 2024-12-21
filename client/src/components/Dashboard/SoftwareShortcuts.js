import React, { useState, useReducer } from 'react';
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
import './calc.scss';

const Title = Typography;
const Text = Typography;
const Option = Select;

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

class CustomCalculator extends React.Component {
  state = {
    display: '0',
    firstVal: '',
    secondVal: '',
    operator: ''
  };

  componentDidMount() {
    document.addEventListener('keyup', this.keypressHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keypressHandler);
  }

  keypressHandler = (ev) => {
    const { setNumberValue, setOperatorValue, equalHandler, allClear, deleteChar } = this;
    const key = ev.key;

    // Handle numpad and regular number keys
    if (/^[0-9.]$/.test(key) || /^Numpad[0-9]$/.test(key)) {
      const numValue = key.replace('Numpad', '');
      setNumberValue(numValue);
    }
    
    // Handle operators
    if (['+', '-', '*', '/', ':'].includes(key) || 
        ['NumpadAdd', 'NumpadSubtract', 'NumpadMultiply', 'NumpadDivide'].includes(key)) {
      const opMap = {
        'NumpadAdd': '+',
        'NumpadSubtract': '-',
        'NumpadMultiply': '*',
        'NumpadDivide': ':',
        '/': ':'
      };
      const operator = opMap[key] || key;
      setOperatorValue(operator);
    }

    // Handle equals
    if (key === 'Enter' || key === '=' || key === 'NumpadEnter') {
      equalHandler();
    }

    // Handle delete/backspace
    if (key === 'Delete' || key === 'Backspace') {
      deleteChar();
    }

    // Handle escape (clear)
    if (key === 'Escape') {
      allClear();
    }
  }

  resetState = (resetAll) => {
    if (resetAll) {
      this.setState({
        display: '0',
        firstVal: '',
        secondVal: '',
        operator: ''
      });
    } else {
      this.setState({
        display: '0',
        firstVal: '',
        secondVal: '',
        operator: ''
      });
    }
  }

  hasPoint = (value) => {
    return value.indexOf('.') > -1;
  }

  setNumberValue = (value) => {
    const { firstVal, secondVal, operator } = this.state;
    const { fixNumberString, setDisplay } = this;
    let total;

    // if point is pressed, check if we already have it in current states
    if (value === '.') {
      if (!operator && !this.hasPoint(firstVal)) {
        total = fixNumberString(firstVal + value);
        this.setState({
          firstVal: total
        });
      }
      if (!!operator && !this.hasPoint(secondVal)) {
        total = fixNumberString(secondVal + value);
        this.setState({
          secondVal: total
        });
      }
      if (total) {
        setDisplay(total + '');
      }
      return;
    }

    // if input is a number, check if it's first or second number
    if (!operator) {
      total = fixNumberString(firstVal + value);
      this.setState({
        firstVal: total
      });
    } else {
      total = fixNumberString(secondVal + value);
      this.setState({
        secondVal: total
      });
    }
    setDisplay(total + '');
  }

  getOverall = () => {
    const { firstVal, secondVal, operator } = this.state;
    return firstVal + ' ' + operator + ' ' + secondVal;
  }

  setDisplay = (value) => {
    const { firstVal, secondVal } = this.state;

    this.setState({
      display: value
    });
  }

  getCurrentTargetValue = () => {
    const { firstVal, secondVal, operator } = this.state;
    return !operator ? firstVal : secondVal;
  }

  numberClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.dataset.value;
    if (value) {
      this.setNumberValue(value);
    }
  }

  setOperatorValue = (operatorInput) => {
    const { firstVal, secondVal, operator, display } = this.state;
    const { fixNumberString, calculate, setDisplay } = this;
    const fixedNumber = fixNumberString(firstVal, false);

    if (firstVal && !secondVal) {
      this.setState({
        operator: operatorInput,
        display: fixedNumber
      });
    } else if (firstVal && operator && secondVal) {
      const total = calculate();
      this.setState({
        operator: operatorInput,
        firstVal: total + '',
        secondVal: ''
      });
      setDisplay(total + '');
    } else {
      this.setState({
        operator: operatorInput,
        firstVal: fixNumberString(display, false)
      });
    }
  }

  allClear = () => {
    this.resetState(true);
  }

  deleteChar = () => {
    const { firstVal, secondVal, operator } = this.state;
    const opRegex = /[+|\-|:|*]/g;

    if (!operator) {
      const newVal = firstVal.slice(0, -1);
      this.setState({
        firstVal: newVal,
        display: newVal ? newVal : '0'
      });
    } else if (operator && !secondVal) {
      this.setState({
        display: firstVal,
        operator: ''
      });
    } else {
      const newVal = secondVal.slice(0, -1);
      this.setState({
        secondVal: newVal,
        display: newVal ? newVal : '0'
      });
    }
  }

  removeZeroAtStart = (value) => {
    return value.indexOf('0') === 0 ? value.substring(1) : value;
  }

  fixNumberString = (value, finalize = false) => {
    // if input has hanging point e.g. '0.'/'1.', add trailing zero
    // should only run when moving to second value / begin calculation
    if (finalize && value.indexOf('.') === value.length - 1 && value.length > 1) {
      return value + '0';
    }
    // if value has zero prefix but not a decimal value, e.g. '01'/'03', remove zero
    if (value.indexOf('0') === 0 && !value.indexOf('0.') === 0) {
      return value.substring(1);
    }
    // if value is a first point input '.', add zero prefix
    if (value.indexOf('.') === 0 && value.length === 1) {
      return '0.';
    }
    if (!value) {
      return '0';
    }
    return value;
  }

  calculate = () => {
    const { firstVal, secondVal, operator } = this.state;
    const { fixNumberString } = this;

    const vfirstVal = fixNumberString(firstVal, true);
    const vsecondVal = fixNumberString(secondVal, true);
    let total = '0';

    switch (operator) {
      case '-':
        total = parseFloat(vfirstVal) - parseFloat(vsecondVal);
        break;
      case '*':
        total = parseFloat(vfirstVal) * parseFloat(vsecondVal);
        break;
      case ':':
      case '/':
        total = parseFloat(vfirstVal) / parseFloat(vsecondVal);
        break;
      case '+':
      default:
        total = parseFloat(vfirstVal) + parseFloat(vsecondVal);
        break;
    }

    // Format the result to handle decimals properly
    return Number(total.toFixed(8)).toString();
  }

  equalHandler = () => {
    const { firstVal, secondVal, operator } = this.state;
    const { calculate } = this;

    if (firstVal && secondVal && operator) {
      const total = calculate();
      this.setState({
        display: total,
        firstVal: total,
        secondVal: '',
        operator: ''
      });
    }
  }

  render() {
    const { display, operator } = this.state;
    const { numberClickHandler, setOperatorValue, equalHandler, allClear, deleteChar } = this;
    
    const activeOperator = (op) => operator === op ? 'active' : '';

    return (
      <div className="calculator">
        <div className="display">
          <div className="display-overall">{this.getOverall()}</div>
          <div className="display-text">{display || '0'}</div>
        </div>
        <div className="inputs">
          <div className="main">
            <div className="operator">
              <div className="row">
                <button 
                  className={activeOperator('+')}
                  onClick={() => setOperatorValue('+')}>+</button>
                <button 
                  className={activeOperator('-')}
                  onClick={() => setOperatorValue('-')}>-</button>
                <button 
                  className={activeOperator(':')}
                  onClick={() => setOperatorValue(':')}>:</button>
                <button 
                  className={activeOperator('*')}
                  onClick={() => setOperatorValue('*')}>*</button>
              </div>
            </div>
            <div className="numbers">
              <div className="row">
                <button onClick={numberClickHandler} data-value="1">1</button>
                <button onClick={numberClickHandler} data-value="2">2</button>
                <button onClick={numberClickHandler} data-value="3">3</button>
              </div>
              <div className="row">
                <button onClick={numberClickHandler} data-value="4">4</button>
                <button onClick={numberClickHandler} data-value="5">5</button>
                <button onClick={numberClickHandler} data-value="6">6</button>
              </div>
              <div className="row">
                <button onClick={numberClickHandler} data-value="7">7</button>
                <button onClick={numberClickHandler} data-value="8">8</button>
                <button onClick={numberClickHandler} data-value="9">9</button>
              </div>
              <div className="row">
                <button onClick={numberClickHandler} data-value=".">.</button>
                <button onClick={numberClickHandler} data-value="0">0</button>
                <button onClick={deleteChar}>C</button>
              </div>
            </div>
            <div className="column sides">
              <button className="ac" onClick={allClear}>AC</button>
              <button className="equal" onClick={equalHandler}>=</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

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
      description: "Open Calculator"
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
        title="Custom Calculator"
        visible={calculatorModalVisible}
        onCancel={() => setCalculatorModalVisible(false)}
        footer={null}
        width={400}
      >
        <CustomCalculator />
      </Modal>

      <TimeClockModal 
        visible={timeClockVisible}
        onClose={() => setTimeClockVisible(false)}
      />
    </>
  );
};

export default SoftwareShortcuts;