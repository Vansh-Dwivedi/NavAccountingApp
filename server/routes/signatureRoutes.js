const express = require('express');
const router = express.Router();
const { getSignatures, addSignature, updateSignature, deleteSignature } = require('../controllers/signatureController');
const auth = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

// Get all signatures for a user
router.get('/:userId', auth, auditMiddleware('✍️ Viewed signatures'), getSignatures);

// Add a new signature
router.post('/:userId', auth, auditMiddleware('✒️ Created new signature'), addSignature);

// Update a signature
router.put('/:signatureId', auth, auditMiddleware('📝 Updated signature'), updateSignature);

// Delete a signature
router.delete('/:signatureId', auth, auditMiddleware('🗑️ Deleted signature'), deleteSignature);

module.exports = router;
