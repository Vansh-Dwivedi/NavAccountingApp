const path = require("path");
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

    // Create file path in uploads folder
    const uploadPath = path.join(
      __dirname,
      "../uploads",
      new Date()
        .toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(/[/:,\s]/g, "") + path.extname(uploadedFile.name)
    );

    // Save file to uploads folder
    await uploadedFile.mv(uploadPath);

    // Create new DndFile document
    const dndFile = new DndFile({
      senderId: req.user.id,
      recipientId: recipientId,
      fileName: uploadedFile.name,
      filePath: uploadPath,
    });

    await dndFile.save();

    res.status(200).json({
      success: true,
      message: "File sent successfully",
      file: dndFile,
    });
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).json({
      success: false,
      message: "Error sending file",
      error: error.message,
    });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await DndFile.find({ recipientId: userId });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message,
    });
  }
};