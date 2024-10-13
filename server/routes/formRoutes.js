const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Create a new form (draft)
router.post('/drafts', auth, formController.createDraft);

// Get all draft forms
router.get('/drafts', auth, formController.getDrafts);

// Update a draft form
router.put('/drafts/:id', auth, formController.updateDraft);

// Send a form
router.post('/send', auth, formController.sendForm);

// Get forms for a user
router.get('/user', auth, formController.getUserForms);

// Submit a form
router.post('/:id/submit', auth, formController.submitForm);

// Get form submissions (for admins)
router.get('/:id/submissions', auth, formController.getFormSubmissions);

// Get all forms
router.get('/', auth, formController.getAllForms);

// Get a single form
router.get('/:id', auth, formController.getForm);

// Admin routes
router.get('/all', auth, roleCheck(['admin']), formController.getAllForms);
router.get('/:id', auth, roleCheck(['admin', 'manager']), formController.getFormById);
router.delete('/:id', auth, roleCheck(['admin', 'manager']), formController.deleteForm);

// Manager routes
router.post('/send', auth, roleCheck(['manager']), formController.sendFormToClient);

module.exports = router;
