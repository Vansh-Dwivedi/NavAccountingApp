const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const roleCheck = require("../middleware/roleCheck");

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
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);
router.post(
  "/profile-pic",
  auth,
  upload.single("profilePic"),
  userController.uploadProfilePic
);
router.delete("/profile-pic", auth, userController.deleteProfilePic);
router.get("/all", auth, userController.getAllUsers);
router.get("/clients-and-managers", auth, userController.getClientsAndManagers);

// Routes for the updated role hierarchy
router.get(
  "/role-hierarchy",
  auth,
  roleCheck(["admin"]),
  userController.getRoleHierarchy
);

// New route to fetch all roles
router.get("/roles", auth, userController.getAllRoles);

// New route to fetch the admin user
router.get("/admin", auth, userController.getAdminUser);

router.get("/managers/count", userController.getManagersCount);
router.get("/clients/count", userController.getClientsCount);
router.get("/managers", auth, roleCheck(["admin"]), userController.getManagers);
router.get("/admins/count", userController.getAdminsCount);

router.post(
  "/client-info",
  auth,
  roleCheck(["client"]),
  userController.submitClientInfo
);

router.get("/all/nonauthed", userController.getAllUsersNonAuthed);

// New route to delete a user
router.delete(
  "/:userId",
  auth,
  roleCheck(["admin"]),
  userController.deleteUser
);

router.get("/profile/:userId", auth, userController.getUserProfileById);

// Admin-only routes
router.put(
  "/:userId/block",
  auth,
  roleCheck(["admin"]),
  userController.blockUser
);
router.put(
  "/:userId/unblock",
  auth,
  roleCheck(["admin"]),
  userController.unblockUser
);

router.put(
  "/update-role/:userId",
  auth,
  roleCheck(["admin"]),
  userController.updateUserRole
);
router.put(
  "/:userId/assign-manager",
  auth,
  roleCheck(["admin", "manager"]),
  userController.assignManager
);
router.put(
  "/:managerId/assign-client",
  auth,
  roleCheck(["admin", "manager"]),
  userController.assignClient
);
router.get(
  "/:managerId/assigned-clients",
  auth,
  roleCheck(["manager"]),
  userController.getAssignedClients
);

router.get(
  "role/:role",
  auth,
  roleCheck(["admin", "office_head", "head_director"]),
  userController.getUsersByRole
);

// Highlighted route to see assigned manager of client
router.get(
  "/client-info/:userId",
  auth,
  roleCheck(["client"]),
  userController.getClientInfo
);

router.post(
  "/:selectedUserId/assign-client",
  auth,
  roleCheck(["manager"]),
  userController.assignClientToManager
);

router.get("/:clientId/data", auth, userController.getClientData);

router.post(
  "/submit-financial-data/:clientId",
  auth,
  roleCheck(["client"]),
  userController.submitFinancialData
);

router.put("/client-personal-info/:clientId", auth, userController.updateClientPersonalInfo);

module.exports = router;
