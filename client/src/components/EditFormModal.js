import React, { useState } from 'react';
import './components.css';

const EditFormModal = ({ form, onClose, onSubmit }) => {
  const [editedForm, setEditedForm] = useState(form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...editedForm.fields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const addField = () => {
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: [...prevForm.fields, { type: 'text', label: '', required: false, options: [] }]
    }));
  };

  const removeField = (index) => {
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: prevForm.fields.filter((_, i) => i !== index)
    }));
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...editedForm.fields];
    updatedFields[fieldIndex].options.push('');
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...editedForm.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setEditedForm(prevForm => ({
      ...prevForm,
      fields: updatedFields
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedForm);
  };

  return (
    <div className="edit-form-modal-overlay">
      <div className="edit-form-modal">
        <h2>Edit Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Form Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedForm.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <h3>Form Fields</h3>
          {editedForm.fields.map((field, index) => (
            <div key={index} className="form-field">
              <input
                type="text"
                name="label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Field Label"
                required
              />
              <select
                name="type"
                value={field.type}
                onChange={(e) => handleFieldChange(index, e)}
              >
                <option value="text">Text</option>
                <option value="file">File</option>
                <option value="dropdown">Dropdown</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  name="required"
                  checked={field.required}
                  onChange={(e) => handleFieldChange(index, {
                    target: { name: 'required', value: e.target.checked }
                  })}
                />
                Required
              </label>
              <button type="button" onClick={() => removeField(index)}>Remove Field</button>
              
              {field.type === 'dropdown' && (
                <div className="dropdown-options">
                  <h4>Options:</h4>
                  {field.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                  ))}
                  <button className="field-button" type="button" onClick={() => addOption(index)}>Add Option</button>
                </div>
              )}
            </div>
          ))}
          
          <button className="field-button" type="button" onClick={addField}>Add Field</button>
          
          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFormModal;
