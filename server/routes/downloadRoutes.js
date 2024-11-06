const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auditMiddleware = require('../middleware/auditMiddleware');

router.get('/download/:fileName', auditMiddleware('📥 Downloaded file'), formController.downloadFile);

module.exports = router;