import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DocumentsSection = ({ clientId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/api/documents/${clientId}`);
        setDocuments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  if (loading) return <div>Loading documents...</div>;

  return (
    <div className="documents-section">
      <h3>Documents & Reports</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
            <span> ({doc.type})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsSection;
