const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

router.post('/', auth, auditMiddleware('✨ Created new task'), taskController.createTask);
router.get('/', auth, auditMiddleware('📋 Viewed tasks'), taskController.getTasks);
router.put('/:id', auth, auditMiddleware('✏️ Updated task'), taskController.updateTask);
router.delete('/:id', auth, auditMiddleware('🗑️ Deleted task'), taskController.deleteTask);

module.exports = router;