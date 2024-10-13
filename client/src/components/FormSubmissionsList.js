import React, { useState, useEffect } from "react";
import api from "../utils/api";
import FormSubmissionModal from './FormSubmissionModal';

const FormSubmissionsList = ({ onSelectForm }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get("/api/forms");
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError("Failed to load forms. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmissionClick = async (formId) => {
    try {
      const response = await api.get(`/api/forms/${formId}/submissions`);
      if (response.data && response.data.length > 0) {
        setSelectedSubmission(response.data[0]);
      } else {
        alert("No submissions found for this form.");
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
      alert("Failed to load submission. Please try again.");
    }
  };

  if (loading) return <div>Loading forms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="forms-list">
      <h4>Select a form to view submissions:</h4>
      <ul>
        {forms.map((form) => (
          <li key={form._id} onClick={() => handleSubmissionClick(form._id)}>
            {form.title}
          </li>
        ))}
      </ul>
      {selectedSubmission && (
        <FormSubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

export default FormSubmissionsList;
