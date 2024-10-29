const Document = require('../models/Document');

exports.getDocuments = async (req, res) => {
  try {
    const { clientId } = req.params;
    const documents = await Document.find({ clientId }).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { clientId, name, type, url } = req.body;
    const newDocument = new Document({
      clientId,
      name,
      type,
      url,
      uploadedBy: req.user._id
    });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
