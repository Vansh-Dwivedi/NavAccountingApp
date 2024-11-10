const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const employeeController = require("../controllers/employeeController");
const auditMiddleware = require("../middleware/auditMiddleware");

router.get("/dashboard", auth, auditMiddleware('📊 Viewed dashboard'), employeeController.getDashboardData);
router.get(
  "/task-of-the-day",
  auth,
  auditMiddleware('📅 Checked daily task'),
  employeeController.getTaskOfTheDay
);
router.get("/passbook", auth, auditMiddleware('📗 Viewed passbook'), employeeController.getPassbook);
router.get(
  "/software-shortcuts",
  auth,
  auditMiddleware('⌨️ Viewed software shortcuts'),
  employeeController.getSoftwareShortcuts
);
router.put("/passbook", auth, auditMiddleware('✏️ Updated passbook'), employeeController.updatePassbook);
router.post("/notes", auth, auditMiddleware('📝 Created new note'), employeeController.addNote);
router.get("/notes", auth, auditMiddleware('📋 Viewed all notes'), employeeController.getNotes);
router.put("/notes/:noteId", auth, auditMiddleware('✍️ Updated note'), employeeController.updateNote);
router.delete("/notes/:noteId", auth, auditMiddleware('🗑️ Deleted note'), employeeController.deleteNote);
router.post("/:taskId/complete", auth, auditMiddleware('✅ Completed task'), employeeController.completeTask);
router.put("/profile/:userId", auth, auditMiddleware('👤 Updated profile'), employeeController.updateProfile);

module.exports = router;
