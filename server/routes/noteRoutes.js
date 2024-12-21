const express = require('express');
const router = express.Router();
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/noteController');
const auth = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

router.get('/:userId', auth, auditMiddleware('📋 Viewed notes'), getNotes);
router.post('/:userId', auth, auditMiddleware('📝 Created new note'), addNote);
router.put('/:noteId', auth, auditMiddleware('✍️ Updated note'), updateNote);
router.delete('/:noteId', auth, auditMiddleware('🗑️ Deleted note'), deleteNote);

module.exports = router;
