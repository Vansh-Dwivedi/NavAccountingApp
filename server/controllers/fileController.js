const path = require("path");
const fs = require("fs");
const DndFile = require("../models/DndFile");

exports.sendFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const uploadedFile = req.files.file;
    const recipientId = req.body.recipientId;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only images, PDFs, and text files are allowed."
      });
    }

    // Create unique filename while preserving original name
    const timestamp = Date.now();
    const originalName = uploadedFile.name;
    const extension = path.extname(originalName);
    const uniqueFilename = `${timestamp}-${originalName}`;
    const uploadPath = path.join(__dirname, "../api/uploads", uniqueFilename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../api/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file
    await uploadedFile.mv(uploadPath);

    // Create new DndFile document
    const dndFile = new DndFile({
      senderId: req.user.id,
      recipientId: recipientId,
      fileName: originalName,
      filePath: uniqueFilename,
      fileType: uploadedFile.mimetype
    });

    await dndFile.save();

    res.status(200).json({
      success: true,
      message: "File sent successfully",
      file: dndFile
    });
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).json({
      success: false,
      message: "Error sending file",
      error: error.message
    });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await DndFile.find({ recipientId: userId })
      .populate('senderId', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: files.map(file => ({
        _id: file._id,
        fileName: file.fileName,
        filePath: file.filePath,
        fileType: file.fileType,
        senderId: file.senderId._id,
        senderName: file.senderId.username,
        createdAt: file.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../api/uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    res.download(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message
    });
  }
};