const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const roleCheck = require("../middleware/roleCheck");
const auditMiddleware = require("../middleware/auditMiddleware");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Existing routes
router.get("/profile", auth, auditMiddleware("👤 Viewing user profile"), userController.getProfile);
router.put("/profile/:id", auth, auditMiddleware("✏️ Updating user profile"), userController.updateProfile);
router.post(
  "/profile-pic",
  auth,
  upload.single("profilePic"),
  auditMiddleware("📸 Uploading profile picture"),
  userController.uploadProfilePic
);
router.delete("/profile-pic", auth, auditMiddleware("🗑️ Deleting profile picture"), userController.deleteProfilePic);
router.get("/all", auth, auditMiddleware("📋 Viewing all users"), userController.getAllUsers);
router.get("/clients-and-managers", auth, auditMiddleware("👥 Viewing clients and managers list"), userController.getClientsAndManagers);

// Routes for the updated role hierarchy
router.get(
  "/role-hierarchy",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("🔍 Viewing role hierarchy"),
  userController.getRoleHierarchy
);

router.get("/roles", auth, auditMiddleware("👑 Viewing all roles"), userController.getAllRoles);
router.get("/admin", auth, auditMiddleware("👨‍💼 Viewing admin user"), userController.getAdminUser);

router.get("/managers/count", auditMiddleware("📊 Getting managers count"), userController.getManagersCount);
router.get("/clients/count", auditMiddleware("📊 Getting clients count"), userController.getClientsCount);
router.get("/managers", auth, roleCheck(["admin"]), auditMiddleware("👥 Viewing managers list"), userController.getManagers);
router.get("/admins/count", auditMiddleware("📊 Getting admins count"), userController.getAdminsCount);

router.post(
  "/client-info",
  auth,
  roleCheck(["client"]),
  auditMiddleware("📝 Submitting client information"),
  userController.submitClientInfo
);

router.get("/all/nonauthed", auditMiddleware("👥 Viewing non-authenticated users"), userController.getAllUsersNonAuthed);

router.delete(
  "/:userId",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("❌ Deleting user"),
  userController.deleteUser
);

router.get("/profile/:userId", auth, auditMiddleware("👤 Viewing specific user profile"), userController.getUserProfileById);

// Admin-only routes
router.put(
  "/:userId/block",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("🚫 Blocking user"),
  userController.blockUser
);
router.put(
  "/:userId/unblock",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("✅ Unblocking user"),
  userController.unblockUser
);

router.put(
  "/update-role/:userId",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("🔄 Updating user role"),
  userController.updateUserRole
);
router.put(
  "/:userId/assign-manager",
  auth,
  roleCheck(["admin", "manager"]),
  auditMiddleware("👨‍💼 Assigning manager to user"),
  userController.assignManager
);
router.put(
  "/:managerId/assign-client",
  auth,
  roleCheck(["admin", "manager"]),
  auditMiddleware("🤝 Assigning client to manager"),
  userController.assignClient
);
router.get(
  "/:managerId/assigned-clients",
  auth,
  roleCheck(["manager"]),
  auditMiddleware("📋 Viewing assigned clients"),
  userController.getAssignedClients
);

router.get(
  "role/:role",
  auth,
  roleCheck(["admin", "office_head", "head_director"]),
  auditMiddleware("👥 Viewing users by role"),
  userController.getUsersByRole
);

router.get(
  "/client-info/:userId",
  auth,
  roleCheck(["client"]),
  auditMiddleware("ℹ️ Viewing client information"),
  userController.getClientInfo
);

router.post(
  "/:selectedUserId/assign-client",
  auth,
  roleCheck(["manager"]),
  auditMiddleware("🤝 Assigning client to manager"),
  userController.assignClientToManager
);

router.get("/:clientId/data", auth, auditMiddleware("📊 Viewing client data"), userController.getClientData);

router.post(
  "/submit-financial-data/:clientId",
  auth,
  roleCheck(["client"]),
  auditMiddleware("💰 Submitting financial data"),
  userController.submitFinancialData
);

router.put("/client-personal-info/:clientId", auth, auditMiddleware("✏️ Updating client personal info"), userController.updateClientPersonalInfo);

router.put('/users/:userId/personal-info', auth, auditMiddleware("✏️ Updating user personal info"), userController.updateUserPersonalInfo);

router.put('/manager-personal-info/:id', auth, auditMiddleware("✏️ Updating manager personal info"), userController.updateManagerPersonalInfo);
router.put('/employee-personal-info/:id', auth, auditMiddleware("✏️ Updating employee personal info"), userController.updateEmployeePersonalInfo);
router.put('/admin-personal-info/:id', auth, auditMiddleware("✏️ Updating admin personal info"), userController.updateAdminPersonalInfo);
router.put('/:userId/financial-data', auth, auditMiddleware("💰 Updating financial data"), userController.updateFinancialData);
router.put('/:userId/financial-history', auth, auditMiddleware("📈 Updating financial history"), userController.updateFinancialHistory);
router.get('/:userId/financial-history', auth, auditMiddleware("📊 Viewing financial history"), userController.getFinancialHistory);
router.delete('/financial-history/:userId', auth, auditMiddleware("🗑️ Deleting financial history"), userController.deleteFinancialHistory);

// Add this new route
router.put(
  '/:userId/dashboard-components',
  auth,
  roleCheck(['admin']), // Only admin can modify dashboard components
  userController.updateDashboardComponents
);

module.exports = router;
