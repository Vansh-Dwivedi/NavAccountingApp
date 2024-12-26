const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const auth = require("../middleware/auth");
const auditMiddleware = require('../middleware/auditMiddleware');

router.post("/send", auth, auditMiddleware('📤 Sending new file'), fileController.sendFile);
router.get("/:userId/files", auth, auditMiddleware('📂 Viewing user files'), fileController.getFiles);
router.get("/download/:filename", auth, auditMiddleware('📥 Downloading file'), fileController.downloadFile);

module.exports = router;