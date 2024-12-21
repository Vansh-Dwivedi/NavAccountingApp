import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Avatar } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';

const RecipientSearchModal = ({ visible, onClose, onSelect, excludeUsers = [], userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/all/nonauthed`);
      const filteredUsers = response.data.filter(
        user => !excludeUsers.includes(user._id)
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title="Select Recipient"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <List
        loading={loading}
        dataSource={filteredUsers}
        renderItem={user => (
          <List.Item
            onClick={() => onSelect(user)}
            style={{ cursor: 'pointer' }}
            className="recipient-list-item"
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} src={user.profilePic} />}
              title={user.username}
              description={user.email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default RecipientSearchModal; 