const User = require("../models/User");
const Passbook = require("../models/Passbook");
const Task = require("../models/Task");

exports.updateEmployeePassbook = async (req, res) => {
  try {
    const { employeeId, achievements, supportDirectory, projectTrackers } =
      req.body;
    const passbook = await Passbook.findOneAndUpdate(
      { user: employeeId },
      { achievements, supportDirectory, projectTrackers },
      { new: true, upsert: true }
    );
    res.json(passbook);
  } catch (error) {
    console.error("Error updating employee passbook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { employeeId, title, description, dueDate, priority } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: employeeId,
      createdBy: req.user.id,
    });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeeNotes = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const passbook = await Passbook.findOne({ user: employeeId });
    if (!passbook) {
      return res
        .status(404)
        .json({ message: "Passbook not found for the employee" });
    }
    res.json(passbook.notes || []);
  } catch (error) {
    console.error("Error fetching employee notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmployeeNote = async (req, res) => {
  try {
    const { employeeId, noteId, content } = req.body;
    const passbook = await Passbook.findOneAndUpdate(
      { user: employeeId, "notes._id": noteId },
      {
        $set: {
          "notes.$.content": content,
          "notes.$.updatedAt": Date.now(),
        },
      },
      { new: true }
    );
    res.json(passbook.notes.id(noteId));
  } catch (error) {
    console.error("Error updating employee note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEmployeeNote = async (req, res) => {
  try {
    const { employeeId, noteId } = req.params;
    const passbook = await Passbook.findOneAndUpdate(
      { user: employeeId },
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    );
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const tasks = await Task.find({ assignedTo: employeeId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeePassbook = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const passbook = await Passbook.findOne({ user: employeeId });
    res.json(passbook);
  } catch (error) {
    console.error("Error fetching employee passbook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getActiveNote = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const passbook = await Passbook.findOne({ user: employeeId });
    res.json(passbook.notes || []);
  } catch (error) {
    console.error("Error fetching active notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSavedNote = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const passbook = await Passbook.findOne({ user: employeeId });
    const savedNotes = passbook.notes.filter(note => note.isSaved);
    res.json(savedNotes);
  } catch (error) {
    console.error("Error fetching saved notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDeletedNote = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const passbook = await Passbook.findOne({ user: employeeId });
    const deletedNotes = passbook.notes.filter(note => note.isDeleted);
    res.json(deletedNotes);
  } catch (error) {
    console.error("Error fetching deleted notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};