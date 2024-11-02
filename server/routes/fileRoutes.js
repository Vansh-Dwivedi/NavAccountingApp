const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

router.post("/send", fileController.sendFile);
router.get("/:userId/files", fileController.getFiles);

module.exports = router;