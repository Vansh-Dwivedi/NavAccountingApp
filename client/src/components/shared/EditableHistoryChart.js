import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, Modal, Table, message, Space, Select, DatePicker } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import moment from 'moment';

const { Option } = Select;

const EditableHistoryChart = ({ title, data, onSave, metric, readOnly = false, showFilters = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState([
    moment().subtract(6, 'months'),
    moment()
  ]);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (showFilters && data) {
      // Filter data based on period and date range
      const filtered = data.filter(item => {
        const itemDate = moment(item.date);
        return itemDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
      });

      // Group by period if needed
      if (period === 'weekly') {
        // Group by week logic
      } else if (period === 'monthly') {
        // Group by month logic
      } else if (period === 'quarterly') {
        // Group by quarter logic
      } else if (period === 'yearly') {
        // Group by year logic
      }

      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, period, dateRange, showFilters]);

  const showModal = () => {
    setEditingData(data);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await onSave(editingData);
      setIsModalVisible(false);
      message.success('History updated successfully');
    } catch (error) {
      message.error('Failed to update history');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text, record, index) => (
        <DatePicker
          value={moment(text)}
          onChange={(date) => {
            const newData = [...editingData];
            newData[index].date = date.format('YYYY-MM-DD');
            setEditingData(newData);
          }}
        />
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (text, record, index) => (
        <InputNumber
          value={text}
          onChange={(value) => {
            const newData = [...editingData];
            newData[index].value = value;
            setEditingData(newData);
          }}
          prefix={metric === 'Credit Score' ? '' : '$'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const newData = [...editingData];
            newData.splice(index, 1);
            setEditingData(newData);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const config = {
    data: filteredData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <Card
      title={title}
      extra={
        !readOnly && (
          <Button icon={<EditOutlined />} onClick={showModal}>
            Edit History
          </Button>
        )
      }
    >
      {showFilters && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Select 
              value={period} 
              onChange={setPeriod}
              style={{ width: 120 }}
            >
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="quarterly">Quarterly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
            <DatePicker.RangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
          </Space>
        </div>
      )}
      <Line {...config} />
      {!readOnly && (
        <Modal
          title={`Edit ${title}`}
          open={isModalVisible}
          onOk={handleSave}
          onCancel={() => setIsModalVisible(false)}
          width={800}
        >
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingData([
                ...editingData,
                { date: moment().format('YYYY-MM-DD'), value: 0 },
              ]);
            }}
            style={{ marginBottom: 16 }}
          >
            Add Entry
          </Button>
          <Table
            columns={columns}
            dataSource={editingData}
            rowKey="date"
            pagination={false}
          />
        </Modal>
      )}
    </Card>
  );
};

export default EditableHistoryChart; 