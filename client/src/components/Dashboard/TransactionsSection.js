import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const TransactionsSection = ({ clientId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/api/transactions/${clientId}`);
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [clientId]);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="transactions-section">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsSection;
