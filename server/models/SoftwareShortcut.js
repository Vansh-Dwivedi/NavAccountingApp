const mongoose = require('mongoose');

const SoftwareShortcutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: String,
  url: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SoftwareShortcut', SoftwareShortcutSchema);
