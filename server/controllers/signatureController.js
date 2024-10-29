const Signature = require('../models/Signature');

// Get signatures with pagination
exports.getSignatures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const startIndex = (page - 1) * limit;
    const total = await Signature.countDocuments({ user: userId });

    const signatures = await Signature.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.json({
      signatures,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching signatures:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new signature
exports.addSignature = async (req, res) => {
  try {
    const { name, data } = req.body;
    const userId = req.params.userId;

    const newSignature = new Signature({
      user: userId,
      name,
      data
    });

    await newSignature.save();
    res.status(201).json(newSignature);
  } catch (error) {
    console.error('Error adding signature:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a signature
exports.updateSignature = async (req, res) => {
  try {
    const { name, data } = req.body;
    const signatureId = req.params.signatureId;

    const updatedSignature = await Signature.findByIdAndUpdate(
      signatureId,
      { name, data, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedSignature) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    res.json(updatedSignature);
  } catch (error) {
    console.error('Error updating signature:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a signature
exports.deleteSignature = async (req, res) => {
  try {
    const signatureId = req.params.signatureId;

    const deletedSignature = await Signature.findByIdAndDelete(signatureId);

    if (!deletedSignature) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    res.json({ message: 'Signature deleted successfully' });
  } catch (error) {
    console.error('Error deleting signature:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
