const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const auditMiddleware = require('../middleware/auditMiddleware');

router.post("/send", auditMiddleware('📤 Sending new file'), fileController.sendFile);
router.get("/:userId/files", auditMiddleware('📂 Viewing user files'), fileController.getFiles);

module.exports = router;