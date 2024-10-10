const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fields: [{
    type: {
      type: String,
      enum: ['text', 'file', 'dropdown'],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String]
  }],
  isCompulsory: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Number,
    default: 3
  },
  status: {
    type: String,
    enum: ['draft', 'sent'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Form", FormSchema);
