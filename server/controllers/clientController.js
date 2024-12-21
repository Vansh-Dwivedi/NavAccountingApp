const User = require('../models/User');
const ClientInfo = require('../models/ClientInfo'); // You'll need to create this model
const { sendNotificationToAdmins } = require('../utils/notifications'); // You'll need to create this utility

exports.submitClientInfo = async (req, res) => {
  try {
    const clientInfo = new ClientInfo({
      ...req.body,
      userId: req.user.id
    });
    await clientInfo.save();

    // Send notification to admin users
    const adminUsers = await User.find({ role: 'admin' });
    const notificationMessage = `New client info submitted by ${req.user.username}`;
    sendNotificationToAdmins(adminUsers, notificationMessage, clientInfo);

    res.status(201).json({ message: 'Client info submitted successfully' });
  } catch (error) {
    console.error('Error submitting client info:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClientData = async (req, res) => {
  try {
    const { clientId } = req.params;
    const clientInfo = await ClientInfo.findOne({ userId: clientId })
      .populate('pendingTransactions')
      .populate('relatedAccounts');

    if (!clientInfo) {
      return res.status(404).json({ error: 'Client information not found' });
    }

    res.json(clientInfo);
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
