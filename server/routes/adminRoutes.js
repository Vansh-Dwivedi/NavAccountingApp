const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const roleCheck = require("../middleware/roleCheck");
const auditMiddleware = require("../middleware/auditMiddleware");

router.put(
  "/employee-passbook",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("📖 Updated employee passbook"),
  adminController.updateEmployeePassbook
);
router.post(
  "/assign-task",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("📋 Assigned new task to employee"),
  adminController.assignTask
);
router.put(
  "/employee-notes",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("📝 Updated employee notes"),
  adminController.updateEmployeeNote
);
router.get(
  "/employee-notes/:employeeId",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("📄 Viewed employee notes"),
  adminController.getEmployeeNotes
);
router.get(
  "/employee-passbook/:employeeId",
  auth,
  roleCheck(["admin"]),
  auditMiddleware("📚 Viewed employee passbook"),
  adminController.getEmployeePassbook
);
router.get(
  "/employee-notes/:employeeId/deleted",
  auth,
  auditMiddleware("🗑️ Viewed deleted employee notes"),
  adminController.getDeletedNote
);
router.get(
  "/employee-notes/:employeeId/saved",
  auth,
  auditMiddleware("💾 Viewed saved employee notes"),
  adminController.getSavedNote
);
router.get(
  "/employee-notes/:employeeId/active",
  auth,
  auditMiddleware("✅ Viewed active employee notes"),
  adminController.getActiveNote
);
router.get(
  "/employee-tasks/:employeeId",
  auth,
  auditMiddleware("📋 Viewed employee tasks"),
  adminController.getEmployeeTasks
);
router.put(
  "/employee-notes/:employeeId/:noteId",
  auth,
  auditMiddleware("🗑️ Deleted employee note"),
  adminController.deleteEmployeeNote
);
router.get(
  "/employee-stats/:employeeId",
  auth,
  auditMiddleware("📊 Viewed employee statistics"),
  adminController.getEmployeeStats
);
router.put(
  "/employee-stats/:employeeId",
  auth,
  auditMiddleware("📈 Updated employee statistics"),
  adminController.updateEmployeeStats
);

module.exports = router;
