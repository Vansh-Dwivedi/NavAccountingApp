const mongoose = require('mongoose');

const ClientInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Personal Information
  fullName: { type: String, required: true },
  occupation: { type: String, required: true },
  spouseName: String,
  spouseOccupation: String,
  email: { type: String, required: true },
  cellNo: { type: String, required: true },
  ssn: { type: String, required: true },
  spouseSSN: String,
  dob: { type: Date, required: true },
  spouseDOB: Date,
  addressLine1: { type: String, required: true },
  addressLine2: String,
  howDidYouFindUs: String,
  referredName: String,
  filingStatus: { type: String, required: true },
  totalDependents: Number,
  dependents: [{
    name: { type: String, required: true },
    ssn: { type: String, required: true },
    dob: { type: Date, required: true },
    relation: { type: String, required: true }
  }],

  // Business Information
  businessName: { type: String, required: true },
  businessPhone: { type: String, required: true },
  businessAddressLine1: { type: String, required: true },
  businessAddressLine2: String,
  businessEntityType: { type: String, required: true },
  businessTIN: { type: String, required: true },
  businessSOS: String,
  businessEDD: String,
  businessAccountingMethod: { type: String, required: true },
  businessYear: { type: String, required: true },
  businessEmail: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  noOfEmployeesActive: { type: Number, required: true },
  businessReferredBy: String,
  members: [{
    name: { type: String, required: true },
    ssn: { type: String, required: true },
    cellPhone: { type: String, required: true },
    position: { type: String, required: true }
  }],

  // Service Requested
  serviceRequested: [String]
}, { timestamps: true });

module.exports = mongoose.model('ClientInfo', ClientInfoSchema);