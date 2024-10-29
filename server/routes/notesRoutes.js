const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

// Get notes for a user
router.get('/:clientId', auth, noteController.getNotes);

// Add other routes as needed

module.exports = router;
