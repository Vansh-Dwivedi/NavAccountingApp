const mongoose = require('mongoose');

const FinancialInfoSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalBalance: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  annualRevenue: { type: Number, default: 0 },
  annualExpenses: { type: Number, default: 0 },
  totalAssets: { type: Number, default: 0 },
  totalLiabilities: { type: Number, default: 0 },
  cashOnHand: { type: Number, default: 0 },
  accountsReceivable: { type: Number, default: 0 },
  accountsPayable: { type: Number, default: 0 },
  dateRange: { type: String, enum: ['Monthly', 'Quarterly', 'Yearly'], default: 'Monthly' },
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
    paid: { type: Number, default: 0 },
    overdue: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('FinancialInfo', FinancialInfoSchema);
