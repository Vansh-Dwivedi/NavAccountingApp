import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AuditLogSection = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await api.get('/api/audit-logs');
        setAuditLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) return <div>Loading audit logs...</div>;

  return (
    <div className="audit-log-section">
      <h3>Audit Logs</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map(log => (
            <tr key={log._id}>
              <td>{log.user.username}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogSection;
