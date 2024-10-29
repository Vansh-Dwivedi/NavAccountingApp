const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  needsAdminApproval: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bankAccount: {
    name: String,
    accountNumber: String,
    bankName: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
