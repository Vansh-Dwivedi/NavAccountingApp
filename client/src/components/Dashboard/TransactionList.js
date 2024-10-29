import React, { useState } from "react";
import dayjs from "../../utils/dayjsConfig";
import { DatePicker } from "antd";

const TransactionList = ({ transactions, onApprove, onReject }) => {
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  const filteredTransactions = transactions.filter((transaction) => {
    if (!dateFilter.start || !dateFilter.end) return true;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate >= new Date(dateFilter.start) &&
      transactionDate <= new Date(dateFilter.end)
    );
  });

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <div className="date-filter">
        <DatePicker
          value={dateFilter.start ? dayjs(dateFilter.start) : null}
          onChange={(date) =>
            setDateFilter({
              ...dateFilter,
              start: date ? date.format("DD-MM-YYYY") : "",
            })
          }
        />
        <DatePicker
          value={dateFilter.end ? dayjs(dateFilter.end) : null}
          onChange={(date) =>
            setDateFilter({
              ...dateFilter,
              end: date ? date.format("DD-MM-YYYY") : "",
            })
          }
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
          {filteredTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>{transaction.status}</td>
              <td>
                {transaction.needsAdminApproval &&
                  transaction.status === "pending" && (
                    <>
                      <button onClick={() => onApprove(transaction._id)}>
                        Approve
                      </button>
                      <button onClick={() => onReject(transaction._id)}>
                        Reject
                      </button>
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
