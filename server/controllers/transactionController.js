const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const transactions = await Transaction.find({ clientId }).sort({ date: -1 }).limit(10);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
