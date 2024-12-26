import React, { useState, useEffect } from 'react';
import { Table, Input, Button, DatePicker, Select, Space, Modal } from 'antd';
import { getSocket } from '../utils/socket';
import api from '../utils/api';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  
  // Authentication Actions
  { value: '🔐 User login', label: 'Login' },
  { value: '🚪 User logout', label: 'Logout' },
  { value: '🔑 Password changed', label: 'Changed Password' },
  { value: '📧 Password reset requested', label: 'Reset Password Request' },
  { value: '🔒 Password reset completed', label: 'Reset Password Complete' },
  { value: '📱 2FA enabled', label: '2FA Enabled' },
  { value: '🔓 2FA disabled', label: '2FA Disabled' },
  { value: '📲 2FA verified', label: '2FA Verified' },
  { value: '🔄 Session refreshed', label: 'Refreshed Session' },
  { value: '🌐 Google login', label: 'Google Login' },
  { value: '📝 User registered', label: 'Registration' },
  { value: '✅ Email verified', label: 'Email Verification' },
  
  // Audit Log Actions
  { value: '📋 Viewed audit logs', label: 'Viewed Audit Logs' },
  { value: '🗑️ Cleared all audit logs', label: 'Cleared Audit Logs' },
  
  // Note Actions
  { value: '📝 Added new note', label: 'Added Note' },
  { value: '📋 Viewed notes', label: 'Viewed Notes' },
  { value: '✍️ Updated note', label: 'Updated Note' },
  { value: '🗑️ Deleted note', label: 'Deleted Note' },
  { value: '📔 Viewed client notes', label: 'Viewed Client Notes' },
  
  // Task Actions
  { value: '✨ Created new task', label: 'Created Task' },
  { value: '📋 Viewed tasks', label: 'Viewed Tasks' },
  { value: '✏️ Updated task', label: 'Updated Task' },
  { value: '🗑️ Deleted task', label: 'Deleted Task' },
  { value: '📋 Assigned new task to employee', label: 'Assigned Task' },
  { value: '✅ Completed task', label: 'Completed Task' },
  { value: '📅 Checked daily task', label: 'Checked Daily Task' },
  
  // User Profile Actions
  { value: '👤 Viewing user profile', label: 'Viewed Profile' },
  { value: '✏️ Updating user profile', label: 'Updated Profile' },
  { value: '📸 Uploading profile picture', label: 'Uploaded Profile Picture' },
  { value: '🗑️ Deleting profile picture', label: 'Deleted Profile Picture' },
  
  // User Management Actions
  { value: '📋 Viewing all users', label: 'Viewed All Users' },
  { value: '👥 Viewing clients and managers list', label: 'Viewed Clients & Managers' },
  { value: '🔍 Viewing role hierarchy', label: 'Viewed Role Hierarchy' },
  { value: '👑 Viewing all roles', label: 'Viewed All Roles' },
  { value: '👨‍💼 Viewing admin user', label: 'Viewed Admin User' },
  { value: '❌ Deleting user', label: 'Deleted User' },
  { value: '🚫 Blocking user', label: 'Blocked User' },
  { value: '✅ Unblocking user', label: 'Unblocked User' },
  { value: '🔄 Updating user role', label: 'Updated User Role' },
  
  // Client Actions
  { value: '📝 Submitting client information', label: 'Submitted Client Info' },
  { value: '📋 Viewing assigned clients', label: 'Viewed Assigned Clients' },
  { value: 'ℹ️ Viewing client information', label: 'Viewed Client Info' },
  { value: '🤝 Assigning client to manager', label: 'Assigned Client' },
  { value: '📊 Viewing client data', label: 'Viewed Client Data' },
  
  // Financial Actions
  { value: '💰 Submitting financial data', label: 'Submitted Financial Data' },
  { value: '💰 Updating financial data', label: 'Updated Financial Data' },
  { value: '📈 Updating financial history', label: 'Updated Financial History' },
  { value: '📊 Viewing financial history', label: 'Viewed Financial History' },
  { value: '🗑️ Deleting financial history', label: 'Deleted Financial History' },
  { value: '💼 Retrieved financial information', label: 'Retrieved Financial Info' },
  
  // Employee Actions
  { value: '📖 Updated employee passbook', label: 'Updated Employee Passbook' },
  { value: '📝 Updated employee notes', label: 'Updated Employee Notes' },
  { value: '📄 Viewed employee notes', label: 'Viewed Employee Notes' },
  { value: '📚 Viewed employee passbook', label: 'Viewed Employee Passbook' },
  { value: '🗑️ Viewed deleted employee notes', label: 'Viewed Deleted Notes' },
  { value: '💾 Viewed saved employee notes', label: 'Viewed Saved Notes' },
  { value: '✅ Viewed active employee notes', label: 'Viewed Active Notes' },
  { value: '📋 Viewed employee tasks', label: 'Viewed Employee Tasks' },
  { value: '📊 Viewed employee statistics', label: 'Viewed Employee Stats' },
  { value: '📈 Updated employee statistics', label: 'Updated Employee Stats' },
  
  // Document Actions
  { value: '📄 Uploaded new document', label: 'Uploaded Document' },
  { value: '📂 Viewed client documents', label: 'Viewed Documents' },
  { value: '📥 Downloaded file', label: 'Downloaded File' },
  
  // Compliance Actions
  { value: '⚖️ Updated compliance record', label: 'Updated Compliance' },
  { value: '⚖️ Viewed compliance records', label: 'Viewed Compliance' },
  
  // Category Actions
  { value: '📋 Viewed all categories', label: 'Viewed Categories' },
  { value: '✨ Created new category', label: 'Created Category' },
  { value: '🗑️ Deleted category', label: 'Deleted Category' },
  
  // Signature Actions
  { value: '✍️ Viewed signatures', label: 'Viewed Signatures' },
  { value: '✒️ Created new signature', label: 'Created Signature' },
  { value: '📝 Updated signature', label: 'Updated Signature' },
  { value: '🗑️ Deleted signature', label: 'Deleted Signature' },
  
  // Notification Actions
  { value: '🔔 Viewed notifications', label: 'Viewed Notifications' },
  
  // Dashboard Actions
  { value: '📊 Viewed dashboard', label: 'Viewed Dashboard' },
  
  // Export Actions
  { value: '📊 Exported client data', label: 'Exported Client Data' },
  
  // Miscellaneous
  { value: '⌨️ Viewed software shortcuts', label: 'Viewed Shortcuts' },
];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    dateRange: [],
    action: '',
    user: ''
  });

  useEffect(() => {
    fetchLogs();
    
    // Socket connection for real-time updates
    const socket = getSocket();
    socket.on('newAuditLog', (newLog) => {
      setLogs(prevLogs => [newLog, ...prevLogs]);
    });

    return () => {
      socket.off('newAuditLog');
    };
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/audit-logs', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: filters.search,
          startDate: filters.dateRange[0],
          endDate: filters.dateRange[1],
          action: filters.action,
          user: filters.user
        }
      });
      
      setLogs(response.data.logs);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = () => {
    Modal.confirm({
      title: 'Clear All Audit Logs',
      content: 'Are you sure you want to clear all audit logs? This action cannot be undone.',
      okText: 'Yes, Clear All',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete('/api/audit-logs');
          setLogs([]);
          setPagination(prev => ({ ...prev, total: 0 }));
        } catch (error) {
          console.error('Error clearing audit logs:', error);
        }
      }
    });
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    },
    {
      title: 'User',
      dataIndex: ['user', 'username'],
      sorter: (a, b) => a.user.username.localeCompare(b.user.username)
    },
    {
      title: 'Action',
      dataIndex: 'action',
      filters: ACTION_OPTIONS.filter(opt => opt.value).map(opt => ({
        text: opt.label,
        value: opt.value
      })),
      onFilter: (value, record) => record.action === value
    },
    {
      title: 'Details',
      dataIndex: 'details',
      render: (text) => {
        try {
          const parsed = JSON.parse(text);
          return parsed.message || parsed.details || text;
        } catch {
          return text;
        }
      }
    }
  ];

  return (
    <div className="audit-logs">
      <div className="audit-logs-header">
        <h2>Audit Logs</h2>
        <Button 
          type="primary" 
          danger 
          icon={<DeleteOutlined />}
          onClick={handleClearLogs}
        >
          Clear All Logs
        </Button>
      </div>

      <Space className="audit-logs-filters" direction="horizontal">
        <Input
          placeholder="Search logs..."
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <RangePicker
          onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
        />
        <Select
          placeholder="Filter by action"
          allowClear
          style={{ width: 200 }}
          onChange={value => setFilters(prev => ({ ...prev, action: value }))}
        >
          {ACTION_OPTIONS.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
        loading={loading}
      />
    </div>
  );
};

export default AuditLogs;