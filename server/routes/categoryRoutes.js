const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, categoryController.getCategories);
router.post('/', auth, roleCheck(['admin']), categoryController.createCategory);
router.delete('/:id', auth, roleCheck(['admin']), categoryController.deleteCategory);

module.exports = router;