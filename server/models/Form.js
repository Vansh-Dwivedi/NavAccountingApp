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
          enum: ["text", "file", "dropdown"],
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
    isCompulsory: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Number,
      default: 3,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "deleted"],
      default: "draft",
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    submittedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
