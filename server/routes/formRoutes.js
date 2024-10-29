const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all forms
router.get('/', auth, roleCheck(['admin', 'manager']), formController.getAllForms);

// Get all forms
router.get('/all', auth, roleCheck(['admin', 'manager']), formController.getAllForms);

// Create a new form (draft)
router.post('/drafts', auth, roleCheck(['admin']), formController.createDraft);

// Save a form
router.post('/save', auth, roleCheck(['admin']), formController.saveForm);

// Get all saved forms
router.get('/saved', auth, roleCheck(['admin', 'manager']), formController.getSavedForms);

// Get all sended forms
router.get('/sent', auth, roleCheck(['admin']), formController.getSentForms);

// Get forms for a user
router.get('/user', auth, formController.getUserForms);

// Get assigned forms
router.get('/assigned/:userId', auth, formController.getAssignedForms);

// Send a form to a user
router.post('/sendto/:userId', auth, roleCheck(['manager']), formController.sendFormToUser);

// Submit a form
router.post('/:id/submit', auth, formController.submitForm);

// Get form submissions (for admins)
router.get('/:id/submissions', auth, roleCheck(['admin']), formController.getFormSubmissions);

// Get a form
router.get('/:id', formController.getForm);

// Delete a form
router.delete('/:id', formController.deleteForm);

// Update a form
router.put('/:id', auth, roleCheck(['admin']), formController.updateForm);

// Get form PDF
router.get('/:id/pdf', formController.getFormPDF);

router.get('*', (req, res) => {
  console.log('Catch-all route hit:', req.path);
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
