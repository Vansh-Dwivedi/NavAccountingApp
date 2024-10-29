const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    responses: [
      {
        fieldId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'submitted', 'deleted'],
      default: 'pending'
    },
    submittedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

FormSubmissionSchema.pre('save', function(next) {
  if (this.form === null) {
    next(new Error('FormSubmission cannot be saved with a null form field'));
  } else {
    next();
  }
});

module.exports = mongoose.model("FormSubmission", FormSubmissionSchema);
