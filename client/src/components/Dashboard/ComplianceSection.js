import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ComplianceSection = ({ clientId }) => {
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplianceRecords = async () => {
      try {
        const response = await api.get(`/api/compliance/${clientId}`);
        setComplianceRecords(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching compliance records:', error);
        setLoading(false);
      }
    };

    fetchComplianceRecords();
  }, [clientId]);

  if (loading) return <div>Loading compliance records...</div>;

  return (
    <div className="compliance-section">
      <h3>Compliance & Audit</h3>
      <ul>
        {complianceRecords.map((record) => (
          <li key={record._id}>
            <h4>{record.type}</h4>
            <p>Status: {record.status}</p>
            <p>Last Checked: {new Date(record.lastChecked).toLocaleString()}</p>
            <p>Notes: {record.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplianceSection;
