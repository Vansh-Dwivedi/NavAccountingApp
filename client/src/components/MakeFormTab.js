import React, { useState } from 'react';
import api from '../utils/api';

const MakeFormTab = () => {
  const [formData, setFormData] = useState({
    title: '',
    fields: [],
    isCompulsory: false,
    deadline: 3,
  });

  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    required: false,
    options: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddField = () => {
    setFormData(prevData => ({
      ...prevData,
      fields: [...prevData.fields, newField]
    }));
    setNewField({
      type: 'text',
      label: '',
      required: false,
      options: [],
    });
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prevField => ({
      ...prevField,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/forms', formData);
      alert('Form created successfully!');
      setFormData({
        title: '',
        fields: [],
        isCompulsory: false,
        deadline: 3,
      });
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Failed to create form. Please try again.');
    }
  };

  return (
    <div className="make-form-tab">
      <h2>Create New Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Form Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="isCompulsory">Is Compulsory:</label>
          <input
            type="checkbox"
            id="isCompulsory"
            name="isCompulsory"
            checked={formData.isCompulsory}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="deadline">Deadline (days):</label>
          <input
            type="number"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            min="1"
          />
        </div>
        <h3>Form Fields</h3>
        {formData.fields.map((field, index) => (
          <div key={index}>
            <p>{field.label} ({field.type})</p>
          </div>
        ))}
        <div>
          <h4>Add New Field</h4>
          <select name="type" value={newField.type} onChange={handleFieldChange}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dropdown">Dropdown</option>
          </select>
          <input
            type="text"
            name="label"
            value={newField.label}
            onChange={handleFieldChange}
            placeholder="Field Label"
          />
          <label>
            Required:
            <input
              type="checkbox"
              name="required"
              checked={newField.required}
              onChange={handleFieldChange}
            />
          </label>
          {newField.type === 'dropdown' && (
            <input
              type="text"
              name="options"
              value={newField.options.join(',')}
              onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value.split(',') }))}
              placeholder="Option1,Option2,Option3"
            />
          )}
          <button type="button" onClick={handleAddField}>Add Field</button>
        </div>
        <button type="submit">Create Form</button>
      </form>
    </div>
  );
};

export default MakeFormTab;