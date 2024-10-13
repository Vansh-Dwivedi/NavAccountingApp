import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AdminFormManagement = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/forms/all");
      setForms(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError("Failed to fetch forms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading forms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-form-management">
      <h2>Form Management</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Submissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form._id}>
              <td>{form.title}</td>
              <td>{form.status}</td>
              <td>{form.submittedBy.length}</td>
              <td>
                <button onClick={() => handleViewSubmissions(form._id)}>
                  View Submissions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFormManagement;
