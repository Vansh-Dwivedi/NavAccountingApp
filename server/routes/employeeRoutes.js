const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const employeeController = require("../controllers/employeeController");

router.get("/dashboard", auth, employeeController.getDashboardData);
router.get(
  "/task-of-the-day",
  auth,
  employeeController.getTaskOfTheDay
);
router.get("/passbook", auth, employeeController.getPassbook);
router.get(
  "/software-shortcuts",
  auth,
  employeeController.getSoftwareShortcuts
);
router.put("/passbook", auth, employeeController.updatePassbook);
router.post("/notes", auth, employeeController.addNote);
router.get("/notes", auth, employeeController.getNotes);
router.put("/notes/:noteId", auth, employeeController.updateNote);
router.delete("/notes/:noteId", auth, employeeController.deleteNote);
router.post("/:taskId/complete", auth, employeeController.completeTask);

module.exports = router;
