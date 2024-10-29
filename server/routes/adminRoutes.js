const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const roleCheck = require("../middleware/roleCheck");

router.put(
  "/employee-passbook",
  auth,
  roleCheck(["admin"]),
  adminController.updateEmployeePassbook
);
router.post(
  "/assign-task",
  auth,
  roleCheck(["admin"]),
  adminController.assignTask
);
router.put(
  "/employee-notes",
  auth,
  roleCheck(["admin"]),
  adminController.updateEmployeeNote
);
router.get(
  "/employee-notes/:employeeId",
  auth,
  roleCheck(["admin"]),
  adminController.getEmployeeNotes
);
router.delete(
  "/employee-notes/:employeeId/:noteId",
  auth,
  roleCheck(["admin"]),
  adminController.deleteEmployeeNote
);
router.get(
  "/employee-passbook/:employeeId",
  auth,
  roleCheck(["admin"]),
  adminController.getEmployeePassbook
);
router.get("/employee-notes/:employeeId/deleted", auth, adminController.getDeletedNote);
router.get("/employee-notes/:employeeId/saved", auth, adminController.getSavedNote);
router.get("/employee-notes/:employeeId/active", auth, adminController.getActiveNote);

module.exports = router;
