const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const ClientInfo = require("../models/ClientInfo"); // You'll need to create this model
const { sendNotificationToAdmins } = require("../utils/notifications"); // You'll need to create this utility
const FormSubmission = require("../models/FormSubmission");
const Message = require("../models/Message");
const FinancialData = require("../models/FinancialData"); // You'll need to create this model
const AuditLog = require("../models/AuditLog"); // You'll need to create this model

exports.submitClientInfo = async (req, res) => {
  try {
    const clientInfo = new ClientInfo({
      ...req.body,
      userId: req.user.id,
    });
    await clientInfo.save();

    res.status(201).json({ message: "Client info submitted successfully" });
  } catch (error) {
    console.error("Error submitting client info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getClientData = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const client = await User.findById(clientId).select("-password");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Fetch form submissions
    const formSubmissions = await FormSubmission.find({ user: clientId });

    // Fetch chat messages
    const chatMessages = await Message.find({
      $or: [{ sender: clientId }, { receiver: clientId }],
    }).sort({ timestamp: 1 });

    res.json({
      client,
      formSubmissions,
      chatMessages,
    });
  } catch (error) {
    console.error("Error fetching client data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitFinancialData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const financialData = {
      revenue: req.body.revenue,
      expenses: req.body.expenses,
      employeeSalary: req.body.employeeSalary,
      clientData: req.body.clientData,
      taxCollected: req.body.taxCollected,
      projectCompletion: req.body.projectCompletion,
      complianceStatus: req.body.complianceStatus,
      dateRange: req.body.dateRange,
    };

    for (const [key, value] of Object.entries(financialData)) {
      if (value === undefined) {
        return res.status(400).json({ error: `Field ${key} is required` });
      }
    }

    for (const [key, value] of Object.entries(financialData)) {
      user[key] = value;
    }

    await user.save({ validateBeforeSave: false });
    res.status(201).json({ message: "Financial data submitted successfully" });
  } catch (error) {
    console.error("Error submitting financial data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getClientInfo = async (req, res) => {
  try {
    const clientInfo = await ClientInfo.findOne({ userId: req.params.userId });
    if (!clientInfo) {
      return res.status(404).json({ error: "Client info not found" });
    }

    // Fetch additional financial data
    const financialData = await FinancialData.findOne({
      userId: req.params.userId,
    });
    if (!financialData) {
      return res.status(404).json({ error: "Financial data not found" });
    }

    const response = {
      ...clientInfo.toObject(),
      totalBalance: financialData.totalBalance,
      monthlyRevenue: financialData.monthlyRevenue,
      monthlyExpenses: financialData.monthlyExpenses,
      monthlyData: financialData.monthlyData,
      cashFlow: financialData.cashFlow,
      invoices: financialData.invoices,
      totalOutstandingInvoices: financialData.totalOutstandingInvoices,
      profitLossSummary: financialData.profitLossSummary,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching client info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('getProfile - user from request:', req.user);
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("assignedManager", "username _id role");
    
    console.log('getProfile - user found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log('getProfile - sending user data');
    res.json(user);
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePic) user.profilePic = profilePic;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select(
        `
        username _id role email profilePic assignedClients isBlocked
        fullName occupation spouseName spouseOccupation phoneNumber address
        dateOfBirth cellNo ssn spouseSSN dob spouseDOB addressLine1 addressLine2
        howDidYouFindUs referredName filingStatus totalDependents dependents
        accountNumber accountType accountStatus businessName businessPhone
        businessAddressLine1 businessAddressLine2 businessEntityType businessTIN
        businessSOS businessEDD businessAccountingMethod businessYear businessEmail
        contactPersonName noOfEmployeesActive businessReferredBy members
        totalBalance availableBalance creditScore annualIncome incomeSources
        employmentStatus taxFilingStatus lastTaxReturnDate outstandingTaxLiabilities
        investments loans insurances documents financialGoals riskToleranceLevel
        investmentRiskProfile kycStatus amlStatus serviceRequested department
        position hireDate company industry
      `
      )
      .populate("assignedManager", "username")
      .populate("pendingTransactions")
      .populate("relatedAccounts");

    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      assignedManager: user.assignedManager
        ? user.assignedManager.username
        : null,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate the new role
    const validRoles = [
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
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ message: "Error updating user role", error: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old profile picture if it exists
    if (user.profilePic) {
      const oldPicPath = path.join(__dirname, "..", "uploads", user.profilePic);
      if (fs.existsSync(oldPicPath)) {
        fs.unlinkSync(oldPicPath);
      }
    }

    user.profilePic = req.file.filename;
    await user.save();

    const fullUrl = `/api/uploads/${user.profilePic}`; // This is the correct path
    console.log("Profile picture uploaded:", fullUrl);
    res.json({ profilePic: user.profilePic }); // Send just the filename
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.profilePic) {
      const picPath = path.join(__dirname, "..", "uploads", user.profilePic);
      if (fs.existsSync(picPath)) {
        fs.unlinkSync(picPath);
      }
      user.profilePic = null;
      await user.save();
    }

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.assignManager = async (req, res) => {
  try {
    const { userId } = req.params;
    const { managerId } = req.body;

    console.log(`Assigning manager ${managerId} to client ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { assignedManager: managerId },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated user:", user);

    res.json(user);
  } catch (error) {
    console.error("Error assigning manager:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignClient = async (req, res) => {
  try {
    const { managerId } = req.params;
    const { clientId } = req.body;

    console.log(`Assigning client ${clientId} to manager ${managerId}`);

    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    if (!manager.assignedClients.includes(clientId)) {
      manager.assignedClients.push(clientId);
      await manager.save();
    }

    console.log("Updated manager:", manager);

    res.json(manager);
  } catch (error) {
    console.error("Error assigning client to manager:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAssignedClients = async (req, res) => {
  try {
    const { managerId } = req.params;
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const assignedClients = await User.find(
      { _id: { $in: manager.assignedClients } },
      "username _id role email profilePic"
    );
    console.log("Assigned clients:", assignedClients);
    res.json(assignedClients);
  } catch (error) {
    console.error("Error in getAssignedClients:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add these methods to your existing userController

exports.blockUser = async (req, res) => {
  try {
    console.log("Blocking user with ID:", req.params.userId);
    console.log("Request user:", req.user);
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBlocked: true },
      { new: true }
    );
    if (!user) {
      console.log("User not found for blocking");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User blocked successfully:", user);
    res.json({ message: "User blocked successfully", user });
  } catch (error) {
    console.error("Error blocking user:", error);
    res
      .status(500)
      .json({ message: "Error blocking user", error: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBlocked: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User unblocked successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unblocking user", error: error.message });
  }
};

// New function to get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }, "username _id role");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// New function to get the role hierarchy
exports.getRoleHierarchy = async (req, res) => {
  const roleHierarchy = {
    admin: [
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
      "manager",
      "client",
      "user",
    ],
    office_head: [
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
    ],
    head_director: [
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
    ],
    master_dept_a: ["master_dept_a", "operator_a", "helper"],
    master_dept_b: ["master_dept_b", "operator_b", "helper"],
    master_dept_c: ["master_dept_c", "operator_c", "helper"],
    master_dept_d: ["master_dept_d", "operator_d", "helper"],
    master_dept_e: ["master_dept_e", "helper"],
    operator_a: ["operator_a"],
    operator_b: ["operator_b"],
    operator_c: ["operator_c"],
    operator_d: ["operator_d"],
    helper: ["helper"],
    manager: ["manager", "client", "user"],
    client: ["client"],
    user: ["user"],
    employee: ["employee"],
  };
  res.json(roleHierarchy);
};

// New method to get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = [
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
    ];
    res.json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching roles", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.getAdminUser = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: "admin" }).select("-password");
    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    res.json(adminUser);
  } catch (error) {
    console.error("Error fetching admin user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New route to fetch a user's profile by ID
exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClientsAndManagers = async (req, res) => {
  try {
    const clientsAndManagers = await User.find(
      { role: { $in: ["client", "manager"] } },
      "username _id role email profilePic"
    );
    res.json(clientsAndManagers);
  } catch (error) {
    console.error("Error fetching clients and managers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getManagersCount = async (req, res) => {
  try {
    const managersCount = await User.countDocuments({ role: "manager" });
    res.json({ count: managersCount });
  } catch (error) {
    console.error("Error fetching managers count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getClientsCount = async (req, res) => {
  try {
    const clientsCount = await User.countDocuments({ role: "client" });
    res.json({ count: clientsCount });
  } catch (error) {
    console.error("Error fetching clients count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAdminsCount = async (req, res) => {
  try {
    const adminsCount = await User.countDocuments({ role: "admin" });
    res.json({ count: adminsCount });
  } catch (error) {
    console.error("Error fetching admins count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFormSubmissionsWithStructure = async (req, res) => {
  try {
    const userId = req.params.clientId;
    const user = await User.findById(userId).populate({
      path: "formSubmissions",
      populate: {
        path: "form",
        model: "Form",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formSubmissionsWithStructure = user.formSubmissions.map(
      (submission) => {
        const formStructure = submission.form;
        const responses = submission.responses.map((response) => {
          const field = formStructure.fields.find(
            (f) => f._id.toString() === response.fieldId.toString()
          );
          return {
            ...response,
            fieldLabel: field ? field.label : "Unknown Field",
          };
        });

        return {
          ...submission.toObject(),
          responses,
          formStructure,
        };
      }
    );

    res.json(formSubmissionsWithStructure);
  } catch (error) {
    console.error("Error fetching form submissions with structure:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });
    res.json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignClientToManager = async (req, res) => {
  try {
    const { selectedUserId } = req.params;
    const { clientId } = req.body;

    const manager = await User.findByIdAndUpdate(
      selectedUserId,
      { $addToSet: { assignedClients: clientId } },
      { new: true }
    );

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const client = await User.findByIdAndUpdate(
      clientId,
      { assignedManager: selectedUserId },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res
      .status(200)
      .json({ message: "Client assigned to manager successfully" });
  } catch (error) {
    console.error("Error assigning client to manager:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsersNonAuthed = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateClientPersonalInfo = async (req, res) => {
  try {
    const { clientId } = req.params;
    const updatedFields = {
      // Personal Information
      fullName: req.body.fullName,
      occupation: req.body.occupation,
      spouseName: req.body.spouseName,
      spouseOccupation: req.body.spouseOccupation,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      cellNo: req.body.cellNo,
      ssn: req.body.ssn,
      spouseSSN: req.body.spouseSSN,
      spouseDOB: req.body.spouseDOB,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      howDidYouFindUs: req.body.howDidYouFindUs,
      referredName: req.body.referredName,
      filingStatus: req.body.filingStatus,
      totalDependents: req.body.totalDependents,
      company: req.body.company,
      industry: req.body.industry,

      // Account Information
      accountNumber: req.body.accountNumber,
      accountType: req.body.accountType,
      accountStatus: req.body.accountStatus,

      // Business Information
      businessName: req.body.businessName,
      businessPhone: req.body.businessPhone,
      businessAddressLine1: req.body.businessAddressLine1,
      businessAddressLine2: req.body.businessAddressLine2,
      businessEntityType: req.body.businessEntityType,
      businessTIN: req.body.businessTIN,
      businessSOS: req.body.businessSOS,
      businessEDD: req.body.businessEDD,
      businessAccountingMethod: req.body.businessAccountingMethod,
      businessYear: req.body.businessYear,
      businessEmail: req.body.businessEmail,
      contactPersonName: req.body.contactPersonName,
      noOfEmployeesActive: req.body.noOfEmployeesActive,
      businessReferredBy: req.body.businessReferredBy,

      // Financial Information
      totalBalance: req.body.totalBalance,
      availableBalance: req.body.availableBalance,
      creditScore: req.body.creditScore,
      annualIncome: req.body.annualIncome,
      incomeSources: req.body.incomeSources,
      employmentStatus: req.body.employmentStatus,

      // Tax Information
      taxFilingStatus: req.body.taxFilingStatus,
      lastTaxReturnDate: req.body.lastTaxReturnDate,
      outstandingTaxLiabilities: req.body.outstandingTaxLiabilities,

      // Risk Assessment
      riskToleranceLevel: req.body.riskToleranceLevel,
      investmentRiskProfile: req.body.investmentRiskProfile,

      // Compliance Information
      kycStatus: req.body.kycStatus,
      amlStatus: req.body.amlStatus,

      // Service Information
      serviceRequested: req.body.serviceRequested,

      // Arrays and Objects
      dependents: req.body.dependents,
      members: req.body.members,
      investments: req.body.investments,
      loans: req.body.loans,
      insurances: req.body.insurances,
      documents: req.body.documents,
      financialGoals: req.body.financialGoals,
    };

    // Remove undefined fields
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    const updatedClient = await User.findByIdAndUpdate(
      clientId,
      updatedFields,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client personal info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUserPersonalInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedFields = {
      // Personal Information
      fullName: req.body.fullName,
      occupation: req.body.occupation,
      spouseName: req.body.spouseName,
      spouseOccupation: req.body.spouseOccupation,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      cellNo: req.body.cellNo,
      ssn: req.body.ssn,
      spouseSSN: req.body.spouseSSN,
      spouseDOB: req.body.spouseDOB,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      howDidYouFindUs: req.body.howDidYouFindUs,
      referredName: req.body.referredName,
      filingStatus: req.body.filingStatus,
      totalDependents: req.body.totalDependents,
      company: req.body.company,
      industry: req.body.industry,

      // Account Information
      accountNumber: req.body.accountNumber,
      accountType: req.body.accountType,
      accountStatus: req.body.accountStatus,

      // Business Information
      businessName: req.body.businessName,
      businessPhone: req.body.businessPhone,
      businessAddressLine1: req.body.businessAddressLine1,
      businessAddressLine2: req.body.businessAddressLine2,
      businessEntityType: req.body.businessEntityType,
      businessTIN: req.body.businessTIN,
      businessSOS: req.body.businessSOS,
      businessEDD: req.body.businessEDD,
      businessAccountingMethod: req.body.businessAccountingMethod,
      businessYear: req.body.businessYear,
      businessEmail: req.body.businessEmail,
      contactPersonName: req.body.contactPersonName,
      noOfEmployeesActive: req.body.noOfEmployeesActive,
      businessReferredBy: req.body.businessReferredBy,

      // Financial Information
      totalBalance: req.body.totalBalance,
      availableBalance: req.body.availableBalance,
      creditScore: req.body.creditScore,
      annualIncome: req.body.annualIncome,
      incomeSources: req.body.incomeSources,
      employmentStatus: req.body.employmentStatus,

      // Tax Information
      taxFilingStatus: req.body.taxFilingStatus,
      lastTaxReturnDate: req.body.lastTaxReturnDate,
      outstandingTaxLiabilities: req.body.outstandingTaxLiabilities,

      // Risk Assessment
      riskToleranceLevel: req.body.riskToleranceLevel,
      investmentRiskProfile: req.body.investmentRiskProfile,

      // Compliance Information
      kycStatus: req.body.kycStatus,
      amlStatus: req.body.amlStatus,

      // Service Information
      serviceRequested: req.body.serviceRequested,

      // Arrays and Objects
      dependents: req.body.dependents,
      members: req.body.members,
      investments: req.body.investments,
      loans: req.body.loans,
      insurances: req.body.insurances,
      documents: req.body.documents,
      financialGoals: req.body.financialGoals,
    };

    // Remove undefined fields
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user personal info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateManagerPersonalInfo = async (req, res) => {
  try {
    const manager = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(manager);
  } catch (error) {
    console.error("Error updating manager personal info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateEmployeePersonalInfo = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(employee);
  } catch (error) {
    console.error("Error updating employee personal info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateAdminPersonalInfo = async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(admin);
  } catch (error) {
    console.error("Error updating admin personal info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateFinancialData = async (req, res) => {
  try {
    const allowedFields = [
      "totalBalance",
      "availableBalance",
      "creditScore",
      "annualIncome",
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(
      (update) => allowedFields.includes(update) || update === "dateUpdated"
    );

    if (!isValidOperation) {
      return res.status(400).json({
        error: "Invalid update field",
        allowedFields,
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating financial data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateFinancialHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, history } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the specific history type
    if (type === "balance") {
      user.balanceHistory = history;
    } else if (type === "creditScore") {
      user.creditScoreHistory = history;
    } else {
      return res.status(400).json({ error: "Invalid history type" });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating financial history:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFinancialHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period, startDate, endDate } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter history based on date range
    const filteredHistory = user.financialHistory.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });

    res.json(filteredHistory);
  } catch (error) {
    console.error('Error fetching financial history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFinancialHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, type } = req.body;

    await FinancialHistory.deleteOne({
      userId,
      date: new Date(date),
      [`metrics.${type}`]: { $exists: true }
    });

    res.json({ message: 'History entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting financial history:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateDashboardComponents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { component, enabled } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize dashboardComponents if it doesn't exist
    if (!Array.isArray(user.dashboardComponents)) {
      user.dashboardComponents = [];
    }

    if (enabled && !user.dashboardComponents.includes(component)) {
      // Add component
      user.dashboardComponents.push(component);
    } else if (!enabled) {
      // Remove component
      user.dashboardComponents = user.dashboardComponents.filter(
        comp => comp !== component
      );
    }

    const updatedUser = await user.save();

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: '🔄 Updated Dashboard Components',
      details: `${enabled ? 'Enabled' : 'Disabled'} ${component} for user ${userId}`,
      targetUserId: userId
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating dashboard components:', error);
    res.status(500).json({ 
      message: 'Failed to update dashboard components',
      error: error.message 
    });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ userId });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
