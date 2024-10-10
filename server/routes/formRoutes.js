const express = require('express');
const router = express.Router();
const { createDraft, sendForm } = require('../controllers/formController');
const auth = require('../middleware/auth');

router.post('/draft', auth, createDraft);
router.post('/send', auth, sendForm);

module.exports = router;