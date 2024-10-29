const express = require('express');
const router = express.Router();
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/noteController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, getNotes);
router.post('/:userId', auth, addNote);
router.put('/:noteId', auth, updateNote);
router.delete('/:noteId', auth, deleteNote);

module.exports = router;
