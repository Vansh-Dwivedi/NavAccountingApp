const mongoose = require('mongoose');

const PassbookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievements: [{
    title: String,
    date: Date,
    description: String
  }],
  supportDirectory: [{
    name: String,
    role: String,
    contact: String
  }],
  projectTrackers: [{
    name: String,
    progress: Number
  }],
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Passbook', PassbookSchema);
