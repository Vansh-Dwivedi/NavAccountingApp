const mongoose = require("mongoose");

const ClientInfoSchema = new mongoose.Schema(
  {
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
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
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
    dependents: [
      {
        name: { type: String, required: true },
        ssn: { type: String, required: true },
        dob: { type: Date, required: true },
        relation: { type: String, required: true },
      },
    ],

    // Account Information
    accountNumber: { type: String, required: true, unique: true },
    accountType: { type: String, required: true },
    accountOpeningDate: { type: Date, default: Date.now },
    accountStatus: { type: String, default: "Active" },
    // Business Information
    businessName: { type: String },
    businessPhone: { type: String },
    businessAddressLine1: { type: String },
    businessAddressLine2: String,
    businessEntityType: { type: String },
    businessTIN: { type: String },
    businessSOS: String,
    businessEDD: String,
    businessAccountingMethod: { type: String },
    businessYear: { type: String },
    businessEmail: { type: String },
    contactPersonName: { type: String },
    noOfEmployeesActive: { type: Number },
    businessReferredBy: String,
    members: [
      {
        name: { type: String },
        ssn: { type: String },
        cellPhone: { type: String },
        position: { type: String },
      },
    ],

    // Financial Information
    totalBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    pendingTransactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    creditScore: { type: Number },
    annualIncome: { type: Number },
    incomeSources: [String],
    employmentStatus: { type: String },

    // Tax Information
    taxFilingStatus: { type: String },
    lastTaxReturnDate: { type: Date },
    outstandingTaxLiabilities: { type: Number, default: 0 },

    // Investment Portfolio
    investments: [
      {
        type: { type: String },
        value: { type: Number },
        performance: { type: Number },
      },
    ],

    // Loan Information
    loans: [
      {
        type: { type: String },
        amount: { type: Number },
        interestRate: { type: Number },
        repaymentStatus: { type: String },
      },
    ],

    // Insurance Information
    insurances: [
      {
        type: { type: String },
        policyNumber: { type: String },
        coverageAmount: { type: Number },
      },
    ],

    // Document Status
    documents: [
      {
        type: { type: String },
        status: { type: String },
        expiryDate: { type: Date },
      },
    ],

    // Financial Goals
    financialGoals: [
      {
        description: { type: String },
        targetAmount: { type: Number },
        targetDate: { type: Date },
        progress: { type: Number },
      },
    ],

    // Risk Assessment
    riskToleranceLevel: { type: String },
    investmentRiskProfile: { type: String },

    // Compliance Information
    kycStatus: { type: String },
    amlStatus: { type: String },

    // Related Accounts
    relatedAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Service Requested
    serviceRequested: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientInfo", ClientInfoSchema);
