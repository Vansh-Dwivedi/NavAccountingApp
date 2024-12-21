const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const financialController = require('../controllers/financialController');
const documentController = require('../controllers/documentController');
const noteController = require('../controllers/noteController');
const taskController = require('../controllers/taskController');
const complianceController = require('../controllers/complianceController');
const exportController = require('../controllers/exportController');
const auditController = require('../controllers/auditController');
const auditMiddleware = require('../middleware/auditMiddleware');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/audit-logs', 
  auth, 
  roleCheck(['admin']), 
  auditMiddleware('📋 Viewed audit logs'), 
  auditController.getAuditLogs
);

router.delete('/audit-logs', 
  auth, 
  roleCheck(['admin']), 
  auditMiddleware('🗑️ Cleared all audit logs'), 
  auditController.clearAuditLogs
);

router.post('/notes', auditMiddleware('📝 Added new note'), noteController.addNote);
router.post('/documents', auditMiddleware('📄 Uploaded new document'), documentController.uploadDocument);
router.post('/tasks', auditMiddleware('✅ Created new task'), taskController.addTask);
router.post('/compliance', auditMiddleware('⚖️ Updated compliance record'), complianceController.updateComplianceRecord);
router.get('/documents/:clientId', auditMiddleware('📂 Viewed client documents'), documentController.getDocuments);
router.get('/notes/:clientId', auditMiddleware('📔 Viewed client notes'), noteController.getNotes);
router.get('/tasks/:clientId', auditMiddleware('📋 Viewed client tasks'), taskController.getTasks);
router.get('/compliance/:clientId', auditMiddleware('⚖️ Viewed compliance records'), complianceController.getComplianceRecords);
router.get('/transactions/:clientId', auditMiddleware('💰 Viewed client transactions'), transactionController.getTransactions);
router.post('/financial-info/:clientId', auditMiddleware('💼 Retrieved financial information'), financialController.getFinancialInfo);
router.get('/export-client-data/:clientId', auditMiddleware('📊 Exported client data'), exportController.exportData);

module.exports = router;