import React, { useState } from 'react';
import { Card, Button, DatePicker, InputNumber, Modal, Table, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import moment from 'moment';

const EditableHistoryChart = ({ title, data, onSave, metric }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState([]);

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
  };

  return (
    <Card
      title={title}
      extra={
        <Button icon={<EditOutlined />} onClick={showModal}>
          Edit History
        </Button>
      }
    >
      <Line {...config} />
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
    </Card>
  );
};

export default EditableHistoryChart; 