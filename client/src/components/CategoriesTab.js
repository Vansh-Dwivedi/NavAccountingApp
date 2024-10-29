import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async () => {
    try {
      const response = await api.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '100px',
      marginBottom: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
      transform: 'scale(1)',
      ':hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
      }
    }}>
      <h2 style={{
        marginBottom: '1.5rem',
        color: '#333',
        fontSize: '1.8em',
        textAlign: 'center',
        transition: 'color 0.3s ease-in-out',
        ':hover': {
          color: '#4CAF50'
        }
      }}>Categories</h2>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        marginTop: '1rem',
        width: '100%'
      }}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          style={{
            flex: 1,
            marginRight: '1rem',
            padding: '0.5rem',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            ':focus': {
              borderColor: '#4CAF50',
              boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)'
            }
          }}
        />
        <button onClick={addCategory} style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9em',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
          marginTop: '-0.76px',
          ':hover': {
            backgroundColor: '#45a049',
            transform: 'translateY(-2px)'
          }
        }}>Add Category</button>
      </div>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%'
      }}>
        {categories.map((category) => (
          <li key={category._id} style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            ':hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
            }
          }}>
            {category.name}
            <button onClick={() => deleteCategory(category._id)} style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9em',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              marginLeft: '1rem',
              ':hover': {
                backgroundColor: '#45a049',
                transform: 'translateY(-2px)'
              }
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesTab;