const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, assignedTo: req.user.id },
      { title, description, status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, assignedTo: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientTasks = async (req, res) => {
  try {
    const { clientId } = req.params;
    const tasks = await Task.find({ clientId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { clientId, title, description, dueDate, assignedTo } = req.body;
    const newTask = new Task({
      clientId,
      title,
      description,
      dueDate,
      assignedTo
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
