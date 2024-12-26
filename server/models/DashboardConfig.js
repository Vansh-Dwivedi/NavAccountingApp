const mongoose = require('mongoose');

const dashboardConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enabledComponents: [{
    type: String
  }],
  tabs: [{
    key: String,
    label: String,
    order: Number,
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  componentsInTabs: {
    type: Map,
    of: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema); 