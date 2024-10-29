const ComplianceRecord = require('../models/ComplianceRecord');

exports.getComplianceRecords = async (req, res) => {
  try {
    const { clientId } = req.params;
    const records = await ComplianceRecord.find({ clientId }).sort({ lastChecked: -1 });
    res.json(records);
  } catch (error) {
    console.error('Error fetching compliance records:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateComplianceRecord = async (req, res) => {
  try {
    const { clientId, type, status, notes } = req.body;
    const record = await ComplianceRecord.findOneAndUpdate(
      { clientId, type },
      { status, notes, lastChecked: Date.now() },
      { new: true, upsert: true }
    );
    res.json(record);
  } catch (error) {
    console.error('Error updating compliance record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
