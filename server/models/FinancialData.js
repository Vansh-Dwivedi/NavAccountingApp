const mongoose = require('mongoose');

const FinancialDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalBalance: Number,
  monthlyRevenue: Number,
  monthlyExpenses: Number,
  monthlyData: [{
    month: String,
    income: Number,
    expenses: Number
  }],
  cashFlow: [{
    category: String,
    amount: Number
  }],
  invoices: {
    paid: Number,
    overdue: Number,
    pending: Number
  },
  totalOutstandingInvoices: Number,
  profitLossSummary: {
    period: String,
    revenue: Number,
    expenses: Number,
    netProfit: Number
  }
});

module.exports = mongoose.model('FinancialData', FinancialDataSchema);
