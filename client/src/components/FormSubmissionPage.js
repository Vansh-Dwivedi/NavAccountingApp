import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import FormPopupModal from './FormPopupModal';

const FormSubmissionPage = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formId) {
      fetchForm(formId);
    }
  }, [formId]);

  const fetchForm = async (id) => {
    try {
      const response = await api.get(`/api/forms/${id}`);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form:', error);
      setError('Failed to load form. Please try again later.');
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await api.post(`/api/forms/${formId}/submit`, formData);
      alert('Form submitted successfully');
      // Redirect to dashboard or show a success message
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (loading) return <div>Loading form...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className="form-submission-page">
      <h2>Form Submission</h2>
      <FormPopupModal
        form={form}
        onClose={() => {/* Handle close */}}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default FormSubmissionPage;
