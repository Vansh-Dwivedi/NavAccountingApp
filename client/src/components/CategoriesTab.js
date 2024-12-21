import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Space, Modal, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title } = Typography;

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      message.error('Error fetching categories');
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      message.warning('Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
      message.success('Category added successfully');
    } catch (error) {
      message.error('Error adding category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.delete(`/api/categories/${id}`);
          setCategories(categories.filter(cat => cat._id !== id));
          message.success('Category deleted successfully');
        } catch (error) {
          message.error('Error deleting category');
        }
      }
    });
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
      <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
        Categories Management
      </Title>
      
      <Space.Compact style={{ width: '100%', marginBottom: 24 }}>
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onPressEnter={addCategory}
        />
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={addCategory}
          loading={loading}
        >
          Add
        </Button>
      </Space.Compact>

      <List
        bordered
        dataSource={categories}
        renderItem={(category) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteCategory(category._id)}
              />
            ]}
          >
            {category.name}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CategoriesTab;