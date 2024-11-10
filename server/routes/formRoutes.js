const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const auditMiddleware = require('../middleware/auditMiddleware');

// Get all forms
router.get('/', auth, roleCheck(['admin', 'manager']), auditMiddleware('📋 Viewed all forms'), formController.getAllForms);

// Get all forms
router.get('/all', auth, roleCheck(['admin', 'manager']), auditMiddleware('📋 Viewed all forms'), formController.getAllForms);

// Create a new form (draft)
router.post('/drafts', auth, roleCheck(['admin']), auditMiddleware('📝 Created form draft'), formController.createDraft);

// Save a form
router.post('/save', auth, roleCheck(['admin']), auditMiddleware('💾 Saved form'), formController.saveForm);

// Get all saved forms
router.get('/saved', auth, roleCheck(['admin', 'manager']), auditMiddleware('📂 Viewed saved forms'), formController.getSavedForms);

// Get all sended forms
router.get('/sent', auth, formController.getSentForms);

// Get forms for a user
router.get('/user', auth, auditMiddleware('📋 Viewed my forms'), formController.getUserForms);

// Get assigned forms
router.get('/assigned/:userId', auth, auditMiddleware('📥 Viewed assigned forms'), formController.getAssignedForms);

// Send a form to a user
router.post('/sendto/:userId', auth, roleCheck(['manager']), auditMiddleware('📨 Sent form to user'), formController.sendFormToUser);

// Submit a form
router.post('/:id/submit', auth, auditMiddleware('✅ Submitted form'), formController.submitForm);

// Get form submissions (for admins)
router.get('/:id/submissions', auth, roleCheck(['admin']), auditMiddleware('📊 Viewed form submissions'), formController.getFormSubmissions);

// Get a form
router.get('/:id', auditMiddleware('👀 Viewed form details'), formController.getForm);

// Delete a form
router.delete('/:id', auditMiddleware('🗑️ Deleted form'), formController.deleteForm);

// Update a form
router.put('/:id', auth, roleCheck(['admin']), auditMiddleware('✏️ Updated form'), formController.updateForm);

// Get form PDF
router.get('/:id/pdf', auditMiddleware('📄 Downloaded form PDF'), formController.getFormPDF);

router.get('*', (req, res) => {
  console.log('Catch-all route hit:', req.path);
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
