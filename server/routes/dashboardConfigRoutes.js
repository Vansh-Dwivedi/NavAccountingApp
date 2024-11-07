const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const dashboardConfigController = require("../controllers/dashboardConfigController");
const auditMiddleware = require("../middleware/auditMiddleware");

// Get user's dashboard configuration
router.get(
  '/:userId/dashboard-config',
  auth,
  roleCheck(["admin"]),
  auditMiddleware('👀 Viewed dashboard configuration'),
  dashboardConfigController.getUserDashboardConfig
);

// Update dashboard components
router.put(
  '/:userId/dashboard-components',
  auth,
  roleCheck(["admin"]),
  auditMiddleware('🔄 Updated dashboard components'),
  dashboardConfigController.updateDashboardComponents
);

// Update dashboard tabs
router.put(
  '/:userId/dashboard-tabs',
  auth,
  roleCheck(["admin"]),
  auditMiddleware('📑 Updated dashboard tabs'),
  dashboardConfigController.updateDashboardTabs
);

// Update components in tab
router.put(
  '/:userId/dashboard-tab-components',
  auth,
  roleCheck(["admin"]),
  auditMiddleware('🔧 Updated components in tab'),
  dashboardConfigController.updateComponentsInTab
);

// Get enabled components
router.get(
  '/:userId/enabled-components',
  auth,
  auditMiddleware('👀 Fetched enabled components'),
  dashboardConfigController.getEnabledComponents
);

module.exports = router; 