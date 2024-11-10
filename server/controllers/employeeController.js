const User = require("../models/User");
const Task = require("../models/Task");
const Passbook = require("../models/Passbook");
const SoftwareShortcut = require("../models/SoftwareShortcut");

exports.getDashboardData = async (req, res) => {
  try {
    const employee = await User.findById(req.user.id).select("-password");
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(req.params.userId, { username, email });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTaskOfTheDay = async (req, res) => {
  try {
    const task = await Task.findOne({
      assignedTo: req.user.id,
      status: { $ne: "Completed" },
    }).sort({ dueDate: 1 });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPassbook = async (req, res) => {
  try {
    const passbook = await Passbook.findOne({ user: req.user.id });
    res.json(passbook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSoftwareShortcuts = async (req, res) => {
  try {
    const shortcuts = await SoftwareShortcut.find({ isActive: true });
    res.json(shortcuts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassbook = async (req, res) => {
  try {
    const { achievements, supportDirectory, projectTrackers } = req.body;
    const passbook = await Passbook.findOneAndUpdate(
      { user: req.user.id },
      { achievements, supportDirectory, projectTrackers },
      { new: true, upsert: true }
    );
    res.json(passbook);
  } catch (error) {
    console.error("Error updating passbook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const passbook = await Passbook.findOneAndUpdate(
      { user: req.user.id },
      { $push: { notes: { content } } },
      { new: true, upsert: true }
    );
    res.json(passbook.notes[passbook.notes.length - 1]);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const noteId = req.params.noteId;
    const passbook = await Passbook.findOne({ user: req.user.id });

    if (!passbook) {
      return res.status(404).json({ message: "Passbook not found" });
    }

    const noteIndex = passbook.notes.findIndex(
      (note) => note._id.toString() === noteId
    );
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    passbook.notes[noteIndex].content = content;
    passbook.notes[noteIndex].updatedAt = Date.now();
    await passbook.save();

    res.json(passbook.notes[noteIndex]);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const passbook = await Passbook.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    );
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const passbook = await Passbook.findOne({ user: req.user.id });
    const total = passbook?.notes?.length || 0;
    const notes = passbook?.notes?.slice(skip, skip + limit) || [];

    res.json({
      notes,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "Completed" },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Server error" });
  }
};