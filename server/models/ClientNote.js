const mongoose = require('mongoose');

const ClientNoteSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isInternal: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ClientNote', ClientNoteSchema);
