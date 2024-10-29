import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/api';
import './components.css';

const SendFormTab = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [deadline, setDeadline] = useState(3); // Default 3 days
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [draftForms, setDraftForms] = useState([]);
  const [selectedDraftId, setSelectedDraftId] = useState('');
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    fetchRecipients();
    fetchDraftForms();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await api.get('/api/users/clients-and-managers');
      setRecipients(response.data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const fetchDraftForms = async () => {
    try {
      const response = await api.get('/api/forms/drafts');
      setDraftForms(response.data);
    } catch (error) {
      console.error('Error fetching draft forms:', error);
    }
  };

  const addField = () => {
    setFormFields([...formFields, { type: 'text', label: '', required: false, options: [] }]);
  };

  const updateField = (index, field) => {
    const updatedFields = [...formFields];
    updatedFields[index] = field;
    setFormFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options.push('');
    setFormFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFormFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const handleRecipientSelect = (e) => {
    setSelectedRecipients(
      Array.from(e.target.selectedOptions, (option) => option.value)
    );
  };

  const saveDraft = async () => {
    try {
      const response = await api.post('/api/forms/drafts', {
        title: formTitle,
        fields: formFields,
        isCompulsory,
        deadline
      });
      alert('Form saved as draft');
      fetchDraftForms();
      setDraftForms([...draftForms, response.data]);
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  const sendForm = async () => {
    try {
      const response = await api.post('/api/forms/send', {
        id: selectedDraftId,
        recipients: selectedRecipients
      });
      alert('Form sent successfully');
      // Reset form after sending
      setFormFields([]);
      setFormTitle('');
      setIsCompulsory(false);
      setDeadline(3);
      setSelectedRecipients([]);
      setSelectedDraftId('');
    } catch (error) {
      console.error('Error sending form:', error);
      alert('Error sending form. Please try again.');
    }
  };

  return (
    <div className="send-form-tab">
      <h3>Create and Send Form</h3>
      <input
        type="text"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Form Title"
      />
      <div className="field-buttons">
        <button onClick={() => addField("text")}>
          <FaPlus /> Text Field
        </button>
        <button onClick={() => addField("file")}>
          <FaPlus /> File Upload
        </button>
        <button onClick={() => addField("dropdown")}>
          <FaPlus /> Dropdown
        </button>
      </div>
      {formFields.map((field, index) => (
        <div key={index} className="form-field">
          <select
            value={field.type}
            onChange={(e) => updateField(index, { ...field, type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="dropdown">Dropdown</option>
            <option value="file">File Upload</option>
          </select>
          <input
            type="text"
            placeholder="Field Label"
            value={field.label}
            onChange={(e) => updateField(index, { ...field, label: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(index, { ...field, required: e.target.checked })}
            />
            Required
          </label>
          <button onClick={() => removeField(index)} className="delete-field-button">
            Delete Field
          </button>
          {field.type === 'dropdown' && (
            <div className="dropdown-options">
              {field.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                />
              ))}
              <button onClick={() => addOption(index)}>Add Option</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addField}><FaPlus /> Add Field</button>
      <div className="form-options">
        <label>
          <input
            type="checkbox"
            checked={isCompulsory}
            onChange={(e) => setIsCompulsory(e.target.checked)}
          />
          Compulsory Form
        </label>
        <label>
          Deadline (days):
          <input
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(parseInt(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div className="form-recipients">
        <label>Select Recipients:</label>
        <select multiple onChange={handleRecipientSelect}>
          {recipients.map((recipient) => (
            <option key={recipient._id} value={recipient._id}>
              {recipient.username} ({recipient.role})
            </option>
          ))}
        </select>
      </div>
      <div className="selected-recipients">
        <h4>Selected Recipients:</h4>
        <ul>
          {selectedRecipients.map((id) => {
            const recipient = recipients.find((r) => r._id === id);
            return (
              <li key={id}>
                {recipient?.username} ({recipient?.role})
              </li>
            );
          })}
        </ul>
      </div>
      <div className="draft-forms">
        <h4>Draft Forms:</h4>
        <select
          onChange={(e) => {
            const selectedDraft = draftForms.find(
              (draft) => draft._id === e.target.value
            );
            if (selectedDraft) {
              setFormTitle(selectedDraft.title);
              setFormFields(selectedDraft.fields);
              setIsCompulsory(selectedDraft.isCompulsory);
              setDeadline(selectedDraft.deadline);
              setSelectedDraftId(selectedDraft._id);
            }
          }}
        >
          <option value="">Select a draft</option>
          {draftForms.map((draft) => (
            <option key={draft._id} value={draft._id}>
              {draft.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button onClick={saveDraft}>
          <FaSave /> Save Draft
        </button>
        <button onClick={sendForm}>
          <FaPaperPlane /> Send Form
        </button>
      </div>
    </div>
  );
};

export default SendFormTab;