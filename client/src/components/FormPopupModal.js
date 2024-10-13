import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './FormPopupModal.css';

const FormPopupModal = ({ form, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [timeLeft, setTimeLeft] = useState(form.deadline * 24 * 60 * 60);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (fieldId, value) => {
    setFormValues({ ...formValues, [fieldId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = {};
    form.fields.forEach((field) => {
      if (field.type === 'file' && formValues[field._id]) {
        formDataToSubmit[field._id] = formValues[field._id].name; // Send file name for now
      } else {
        formDataToSubmit[field._id] = formValues[field._id] || '';
      }
    });
    onSubmit(formDataToSubmit);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="form-popup-modal">
      <div className="form-popup-content">
        <button className="close-button" onClick={onClose}><FaTimes /></button>
        <h2>{form.title}</h2>
        {form.isCompulsory && (
          <div className="compulsory-warning">
            <p>This form is compulsory. Your account will be suspended if not completed within:</p>
            <p className="countdown">{formatTime(timeLeft)}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {form.fields.map((field) => (
            <div key={field._id} className="form-field">
              <label>{field.label}{field.required && ' *'}</label>
              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  onChange={(e) => handleInputChange(field._id, e.target.value)}
                />
              )}
              {field.type === 'file' && (
                <input
                  type="file"
                  required={field.required}
                  onChange={(e) => handleInputChange(field._id, e.target.files[0])}
                />
              )}
              {field.type === 'dropdown' && (
                <select
                  required={field.required}
                  onChange={(e) => handleInputChange(field._id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <button type="submit" className="submit-button">Submit Form</button>
        </form>
      </div>
    </div>
  );
};

export default FormPopupModal;
