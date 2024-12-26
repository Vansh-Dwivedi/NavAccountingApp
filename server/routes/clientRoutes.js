const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

router.post('/client-info', auth, auditMiddleware('📝 Client information submitted'), clientController.submitClientInfo);

module.exports = router;