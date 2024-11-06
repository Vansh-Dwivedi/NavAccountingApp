const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const auditMiddleware = require('../middleware/auditMiddleware');

router.get('/', auth, auditMiddleware('📋 Viewed all categories'), categoryController.getCategories);
router.post('/', auth, roleCheck(['admin']), auditMiddleware('✨ Created new category'), categoryController.createCategory);
router.delete('/:id', auth, roleCheck(['admin']), auditMiddleware('🗑️ Deleted category'), categoryController.deleteCategory);

module.exports = router;