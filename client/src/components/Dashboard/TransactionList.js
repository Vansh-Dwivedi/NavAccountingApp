import React, { useState } from 'react';

const TransactionList = ({ transactions, onApprove, onReject }) => {
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const filteredTransactions = transactions.filter(transaction => {
    if (!dateFilter.start || !dateFilter.end) return true;
    const transactionDate = new Date(transaction.date);
    return transactionDate >= new Date(dateFilter.start) && transactionDate <= new Date(dateFilter.end);
  });

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <div className="date-filter">
        <input 
          type="date" 
          value={dateFilter.start} 
          onChange={e => setDateFilter({...dateFilter, start: e.target.value})}
        />
        <input 
          type="date" 
          value={dateFilter.end} 
          onChange={e => setDateFilter({...dateFilter, end: e.target.value})}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>{transaction.status}</td>
              <td>
                {transaction.needsAdminApproval && transaction.status === 'pending' && (
                  <>
                    <button onClick={() => onApprove(transaction._id)}>Approve</button>
                    <button onClick={() => onReject(transaction._id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
