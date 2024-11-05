import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button } from 'antd';
import { Line } from '@ant-design/plots';
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialHistoryChart = ({ userId, metric }) => {
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState([
    moment().subtract(6, 'months'),
    moment()
  ]);
  const [data, setData] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/financial-history', {
        params: {
          userId,
          period,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString()
        }
      });
      
      setData(response.data.map(record => ({
        date: moment(record.date).format('YYYY-MM-DD'),
        value: record.metrics[metric]
      })));
    } catch (error) {
      console.error('Error fetching financial history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, period, dateRange, metric]);

  const handleDelete = async (record) => {
    try {
      await api.delete(`/api/financial-history/${userId}`, {
        data: {
          date: record.date,
          type: metric.toLowerCase().replace(' ', '')
        }
      });
      
      message.success('History entry deleted successfully');
      fetchHistory(); // Refresh data
    } catch (error) {
      console.error('Error deleting history entry:', error);
      message.error('Failed to delete history entry');
    }
  };

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <div>
            <p>{title}</p>
            {items.map((item, index) => (
              <div key={index}>
                <span>{item.value}</span>
                <Button 
                  type="link" 
                  danger 
                  size="small"
                  onClick={() => handleDelete(item.data)}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <Card title={`${metric} History`}>
      <div style={{ marginBottom: 16 }}>
        <Select 
          value={period} 
          onChange={setPeriod}
          style={{ width: 120, marginRight: 16 }}
        >
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="quarterly">Quarterly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
        <RangePicker 
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <Line {...config} />
    </Card>
  );
};

export default FinancialHistoryChart; 