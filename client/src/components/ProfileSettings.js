import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';

const ProfileSettings = ({ user, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
    });
  }, [user]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.put('/api/users/profile', values);
      message.success('Profile updated successfully');
      onUpdate(response.data);
    } catch (error) {
      if (error.response && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to update profile');
      }
    }
    setLoading(false);
  };

  const handleProfilePicUpload = async (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      onUpdate({ ...user, profilePic: info.file.response.profilePic });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Profile Picture">
        <Upload
          name="profilePic"
          action={`${process.env.REACT_APP_API_URL}/api/users/profile-pic`}
          headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
          onChange={handleProfilePicUpload}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileSettings;
