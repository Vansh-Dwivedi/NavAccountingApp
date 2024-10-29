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

router.get('/audit-logs', auditController.getAuditLogs);
router.post('/notes', noteController.addNote);
router.post('/documents', documentController.uploadDocument);
router.post('/tasks', taskController.addTask);
router.post('/compliance', complianceController.updateComplianceRecord);
router.get('/documents/:clientId', documentController.getDocuments);
router.get('/notes/:clientId', noteController.getNotes);
router.get('/tasks/:clientId', taskController.getTasks);
router.get('/compliance/:clientId', complianceController.getComplianceRecords);
router.get('/transactions/:clientId', transactionController.getTransactions);
router.post('/financial-info/:clientId', financialController.getFinancialInfo);
router.get('/export-client-data/:clientId', exportController.exportData);

module.exports = router;