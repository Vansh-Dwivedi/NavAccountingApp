import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const ProfileSettings = ({ userData, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(userData?.profilePic);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/users/profile/${userData._id}`, values);
      onUpdate(response.data);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const response = await api.post('/api/users/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfilePic(response.data.profilePic);
      onUpdate({ ...userData, profilePic: response.data.profilePic });
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      message.error('Failed to upload profile picture');
    }
  };

  const handleProfilePicDelete = async () => {
    try {
      await api.delete('/api/users/profile-pic');
      setProfilePic(null);
      onUpdate({ ...userData, profilePic: null });
      message.success('Profile picture deleted successfully');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      message.error('Failed to delete profile picture');
    }
  };

  return (
    <Card title="Profile Settings" style={{ marginTop: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar 
          size={100}
          src={profilePic ? `${process.env.REACT_APP_API_URL}/uploads/${profilePic}` : null}
          icon={!profilePic && <UserOutlined />}
        />
        <div style={{ marginTop: 16 }}>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleProfilePicUpload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
          {profilePic && (
            <Button 
              type="text" 
              danger 
              onClick={handleProfilePicDelete}
              style={{ marginLeft: 8 }}
              icon={<DeleteOutlined />}
            >
              Delete Photo
            </Button>
          )}
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          username: userData?.username,
          email: userData?.email,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileSettings; 