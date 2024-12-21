const Note = require("../models/Note");

// Get notes with pagination
exports.getNotes = async (req, res) => {
  try {
    console.log("Received request params:", req.params);
    console.log("Received request query:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.params.userId; // Change this line

    console.log("Parsed values:", { page, limit, userId });

    if (!userId) {
      console.log("User ID is missing");
      return res.status(400).json({ error: "User ID is required" });
    }

    const startIndex = (page - 1) * limit;
    const total = await Note.countDocuments({ user: userId });

    console.log("Total notes found:", total);

    const notes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    console.log("Notes fetched:", notes.length);

    res.json({
      notes,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new note
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.params.userId;

    const newNote = new Note({
      user: userId,
      content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const noteId = req.params.noteId;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Server error" });
  }
};
