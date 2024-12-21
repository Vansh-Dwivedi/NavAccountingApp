const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const financialHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "user",
        "client",
        "manager",
        "admin",
        "office_head",
        "head_director",
        "master_dept_a",
        "master_dept_b",
        "master_dept_c",
        "master_dept_d",
        "master_dept_e",
        "operator_a",
        "operator_b",
        "operator_c",
        "operator_d",
        "helper",
        "employee",
      ],
      default: "client",
    },
    profilePic: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    assignedManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    firmId: { type: String },
    revenue: String,
    expenses: String,
    employeeSalary: String,
    clientData: String,
    taxCollected: String,
    projectCompletion: Number,
    complianceStatus: Boolean,
    dateRange: String,
    fullName: { type: String },
    occupation: { type: String },
    spouseName: String,
    spouseOccupation: String,
    phoneNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    cellNo: { type: String },
    ssn: { type: String },
    spouseSSN: String,
    dob: { type: Date },
    spouseDOB: Date,
    addressLine1: { type: String },
    addressLine2: String,
    howDidYouFindUs: String,
    referredName: String,
    filingStatus: { type: String },
    totalDependents: Number,
    dependents: [
      {
        name: { type: String },
        ssn: { type: String },
        dob: { type: Date },
        relation: { type: String },
      },
    ],

    // Account Information
    accountNumber: { type: String, unique: true },
    accountType: { type: String },
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

    // Employee-specific fields
    department: String,
    position: String,
    hireDate: Date,
    // Client-specific fields
    company: String,
    industry: String,
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    balanceHistory: [financialHistorySchema],
    creditScoreHistory: [financialHistorySchema],
    dashboardComponents: {
      type: [String],
      default: [], // Empty array means all components are enabled
      validate: {
        validator: function(components) {
          const validComponents = [
            'dashboard',
            'submitInfo',
            'notesAndSignatures',
            'dragAndDrop',
            'forms',
            'chat',
            'financialInfo',
            'personnelSettings',
            'profile',
            'settings',
            'adminChat',
            'clientData',
            'fileTransfer',     
            'chatCenter',
          ];
          return components.every(comp => validComponents.includes(comp));
        },
        message: 'Invalid dashboard component'
      }
    },
    dashboardConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DashboardConfig'
    },
    isInSleepMode: {
      type: Boolean,
      default: false
    },
    pin: {
      type: String,
      minlength: 4,
      maxlength: 4,
      match: /^\d{4}$/,
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
