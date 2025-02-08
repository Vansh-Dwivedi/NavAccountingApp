const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const auditMiddleware = require("../middleware/auditMiddleware");

router.get(
  "/utils/app-logo.png",
  cors({
    origin: ["https://localhost:8443", "https://localhost:8443"],
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  auditMiddleware("🖼️ Accessed application logo"),
  (req, res) => {
    const filePath = path.join(__dirname, "../uploads/app-logo.png");
    res.set({
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
    });
    res.sendFile(filePath);
  }
);

module.exports = router;
