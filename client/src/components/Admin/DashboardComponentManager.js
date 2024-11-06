import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, Select, Button, message } from 'antd';
import api from '../../utils/api';

const { Option } = Select;

const DashboardComponentManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const availableComponents = {
    client: [
      { key: 'dashboard', label: 'Dashboard Overview' },
      { key: 'submitInfo', label: 'Submit Information' },
      { key: 'notesAndSignatures', label: 'Notes & Signatures' },
      { key: 'dragAndDrop', label: 'File Transfer' },
      { key: 'forms', label: 'Forms' },
      { key: 'chat', label: 'Chat' },
      { key: 'financialInfo', label: 'Financial Information' },
      { key: 'personnelSettings', label: 'Personnel Settings' }
    ],
    employee: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'profile', label: 'Edit Profile' },
      { key: 'settings', label: 'Settings' },
      { key: 'dragAndDrop', label: 'File Transfer' },
      { key: 'personnelSettings', label: 'Personnel Settings' }
    ],
    manager: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'chat', label: 'Chat' },
      { key: 'adminChat', label: 'Admin Chat' },
      { key: 'clientData', label: 'Client Data' },
      { key: 'forms', label: 'Forms' },
      { key: 'dragAndDrop', label: 'File Transfer' }
    ]
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    }
  };

  const handleComponentToggle = async (userId, component, enabled) => {
    try {
      await api.put(`/api/users/${userId}/dashboard-components`, {
        component,
        enabled
      });
      message.success('Dashboard components updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating dashboard components:', error);
      message.error('Failed to update dashboard components');
    }
  };

  const columns = [
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: 'Enabled',
      key: 'enabled',
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handleComponentToggle(selectedUser._id, record.component, checked)}
        />
      ),
    }
  ];

  const handleUserSelect = (userId) => {
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
  };

  return (
    <Card title="Dashboard Component Manager">
      <Select
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Select a user"
        onChange={handleUserSelect}
      >
        {users.map(user => (
          <Option key={user._id} value={user._id}>
            {user.username} ({user.role})
          </Option>
        ))}
      </Select>

      {selectedUser && (
        <Table
          dataSource={availableComponents[selectedUser.role]?.map(comp => ({
            key: comp.key,
            component: comp.label,
            enabled: selectedUser.dashboardComponents?.includes(comp.key) ?? true
          }))}
          columns={columns}
          pagination={false}
        />
      )}
    </Card>
  );
};

export default DashboardComponentManager; 