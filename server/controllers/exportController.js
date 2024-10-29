const User = require('../models/User');
const FinancialInfo = require('../models/FinancialInfo');
const Transaction = require('../models/Transaction');
const Document = require('../models/Document');
const ClientNote = require('../models/ClientNote');
const Task = require('../models/Task');
const ComplianceRecord = require('../models/ComplianceRecord');
const { Parser } = require('json2csv');

exports.exportData = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await User.findById(clientId);
    const financialInfo = await FinancialInfo.findOne({ clientId });
    const transactions = await Transaction.find({ clientId });
    const documents = await Document.find({ clientId });
    const notes = await ClientNote.find({ clientId });
    const tasks = await Task.find({ clientId });
    const complianceRecords = await ComplianceRecord.find({ clientId });

    const data = {
      clientInfo: client,
      financialInfo,
      transactions,
      documents,
      notes,
      tasks,
      complianceRecords
    };

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`client_${clientId}_data.csv`);
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting client data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
