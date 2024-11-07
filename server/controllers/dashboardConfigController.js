const DashboardConfig = require('../models/DashboardConfig');
const User = require('../models/User');

exports.getUserDashboardConfig = async (req, res) => {
  try {
    let config = await DashboardConfig.findOne({ userId: req.params.userId });
    if (!config) {
      config = new DashboardConfig({
        userId: req.params.userId,
        enabledComponents: [],
        tabs: [],
        componentsInTabs: new Map()
      });
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard configuration', error: error.message });
  }
};

exports.getEnabledComponents = async (req, res) => {
  try {
    const config = await DashboardConfig.findOne({ userId: req.params.userId });
    if (!config) {
      return res.json({ enabledComponents: [] });
    }
    res.json({ enabledComponents: config.enabledComponents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enabled components', error: error.message });
  }
};

exports.updateDashboardComponents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { component, enabled } = req.body;

    // Find both user and config
    const user = await User.findById(userId);
    let config = await DashboardConfig.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize config if it doesn't exist
    if (!config) {
      config = new DashboardConfig({
        userId,
        enabledComponents: [],
        tabs: [],
        componentsInTabs: new Map()
      });
    }

    // Initialize arrays if they don't exist
    if (!Array.isArray(config.enabledComponents)) {
      config.enabledComponents = [];
    }
    if (!Array.isArray(user.dashboardComponents)) {
      user.dashboardComponents = [];
    }

    // Update both config and user
    if (enabled) {
      if (!config.enabledComponents.includes(component)) {
        config.enabledComponents.push(component);
      }
      if (!user.dashboardComponents.includes(component)) {
        user.dashboardComponents.push(component);
      }
    } else {
      config.enabledComponents = config.enabledComponents.filter(c => c !== component);
      user.dashboardComponents = user.dashboardComponents.filter(c => c !== component);
    }

    config.lastUpdated = new Date();

    // Save both documents
    await Promise.all([
      config.save(),
      user.save()
    ]);

    // Return combined response
    res.json({
      config,
      user: {
        _id: user._id,
        dashboardComponents: user.dashboardComponents
      }
    });
  } catch (error) {
    console.error('Error updating dashboard components:', error);
    res.status(500).json({ message: 'Error updating dashboard components', error: error.message });
  }
};

exports.updateDashboardTabs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tabs } = req.body;

    let config = await DashboardConfig.findOne({ userId });

    if (!config) {
      config = new DashboardConfig({
        userId,
        enabledComponents: [],
        tabs,
        componentsInTabs: new Map()
      });
    } else {
      config.tabs = tabs;
    }

    config.lastUpdated = new Date();
    await config.save();

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error updating dashboard tabs', error: error.message });
  }
};

exports.updateComponentsInTab = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tabKey, components } = req.body;

    let config = await DashboardConfig.findOne({ userId });

    if (!config) {
      config = new DashboardConfig({
        userId,
        enabledComponents: [],
        tabs: [],
        componentsInTabs: new Map()
      });
    }

    config.componentsInTabs.set(tabKey, components);
    config.lastUpdated = new Date();
    await config.save();

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error updating components in tab', error: error.message });
  }
}; 