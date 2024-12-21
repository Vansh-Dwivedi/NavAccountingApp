const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

// Get notes for a user
router.get('/:clientId', auth, auditMiddleware('📋 Viewing client notes'), noteController.getNotes);

// Add other routes as needed

module.exports = router;
