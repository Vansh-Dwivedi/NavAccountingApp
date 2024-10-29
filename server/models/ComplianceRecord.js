const mongoose = require('mongoose');

const ComplianceRecordSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Compliant', 'Non-Compliant', 'Pending'], default: 'Pending' },
  lastChecked: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ComplianceRecord', ComplianceRecordSchema);
