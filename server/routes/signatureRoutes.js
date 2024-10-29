const express = require('express');
const router = express.Router();
const { getSignatures, addSignature, updateSignature, deleteSignature } = require('../controllers/signatureController');
const auth = require('../middleware/auth');

// Get all signatures for a user
router.get('/:userId', auth, getSignatures);

// Add a new signature
router.post('/:userId', auth, addSignature);

// Update a signature
router.put('/:signatureId', auth, updateSignature);

// Delete a signature
router.delete('/:signatureId', auth, deleteSignature);

module.exports = router;
