const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fields: [
      {
        type: {
          type: String,
          enum: ["text", "file", "dropdown", "digitalSignature"],
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String], // For dropdown fields
      },
    ],
    category: {
      type: String,
      required: true,
    },
    isCompulsory: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "saved", "sent", "in_progress", "submitted", "deleted"],
      default: "draft",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
