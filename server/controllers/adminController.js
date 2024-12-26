const User = require("../models/User");
const Passbook = require("../models/Passbook");
const Task = require("../models/Task");
const Note = require("../models/Note");

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
      return res.json([]);
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
    if (!passbook) {
      return res.json([]);
    }
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
    if (!passbook) {
      return res.json([]);
    }
    const savedNotes = passbook.notes.filter((note) => note.isSaved);
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
    if (!passbook) {
      return res.json([]);
    }
    const deletedNotes = passbook.notes.filter((note) => note.isDeleted);
    res.json(deletedNotes);
  } catch (error) {
    console.error("Error fetching deleted notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.employeeId,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Get tasks for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getDate() - 6);

    // Fetch all relevant data
    const [tasks, passbook, notes] = await Promise.all([
      Task.find({
        assignedTo: employeeId,
        createdAt: { $gte: sixMonthsAgo },
      }),
      Passbook.findOne({ user: employeeId }),
      Note.find({ employeeId, createdAt: { $gte: sixMonthsAgo } }),
    ]);

    // 1. Task Statistics
    const taskStats = calculateTaskStats(tasks);

    // 2. Financial Statistics
    const financialStats = calculateFinancialStats(passbook);

    // 3. Performance Metrics
    const performanceMetrics = calculatePerformanceMetrics(tasks, notes);

    const taskPriorities = passbook?.taskPriorities || { high: 0, medium: 0, low: 0 };

    // Combine all statistics
    const response = {
      taskStats: {
        completion: taskStats.monthlyCompletion,
        priorities: taskStats.priorities,
        monthLabels: taskStats.labels,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === "Completed").length,
      },
      financialStats: {
        monthlyEarnings: financialStats.monthlyEarnings,
        totalEarnings: financialStats.totalEarnings,
        bonuses: financialStats.bonuses,
      },
      performanceMetrics: {
        score: performanceMetrics.score,
        efficiency: performanceMetrics.efficiency,
        qualityRating: performanceMetrics.qualityRating,
      },
      taskPriorities,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper functions for calculations
function calculateTaskStats(tasks) {
  const monthlyStats = {};
  const currentDate = new Date();

  // Initialize last 6 months
  for (let i = 0; i < 6; i++) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthKey = month.toLocaleString("default", { month: "short" });
    monthlyStats[monthKey] = {
      total: 0,
      completed: 0,
    };
  }

  // Calculate monthly completion rates
  tasks.forEach((task) => {
    const taskMonth = task.createdAt.toLocaleString("default", {
      month: "short",
    });
    if (monthlyStats[taskMonth]) {
      monthlyStats[taskMonth].total++;
      if (task.status === "Completed") {
        monthlyStats[taskMonth].completed++;
      }
    }
  });

  // Calculate priorities
  const priorities = {
    high: tasks.filter((t) => t.priority === "High").length,
    medium: tasks.filter((t) => t.priority === "Medium").length,
    low: tasks.filter((t) => t.priority === "Low").length,
  };

  return {
    monthlyCompletion: Object.values(monthlyStats)
      .map((stat) => (stat.total ? (stat.completed / stat.total) * 100 : 0))
      .reverse(),
    priorities,
    labels: Object.keys(monthlyStats).reverse(),
  };
}

function calculateFinancialStats(passbook) {
  if (!passbook || !passbook.transactions) {
    return {
      monthlyEarnings: [],
      totalEarnings: 0,
      bonuses: [],
    };
  }

  const monthlyEarnings = passbook.transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {});

  const totalEarnings = passbook.transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const bonuses = passbook.transactions
    .filter((t) => t.category === "bonus")
    .map((t) => ({
      amount: t.amount,
      date: t.date,
      reason: t.description,
    }));

  const taskPriorities = passbook.taskPriorities || {};

  return {
    monthlyEarnings: Object.values(monthlyEarnings),
    totalEarnings,
    bonuses,
    taskPriorities,
  };
}

function calculatePerformanceMetrics(tasks, notes) {
  // Calculate completion rate
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const completionRate = tasks.length
    ? completedTasks.length / tasks.length
    : 0;

  // Calculate on-time completion rate
  const onTimeTasks = completedTasks.filter(
    (t) => new Date(t.completedAt) <= new Date(t.dueDate)
  );
  const timelinessRate = completedTasks.length
    ? onTimeTasks.length / completedTasks.length
    : 0;

  // Calculate quality rating based on notes/feedback
  const positiveNotes = notes.filter((n) => n.sentiment === "positive").length;
  const qualityRating = notes.length ? (positiveNotes / notes.length) * 100 : 0;

  // Calculate efficiency (average task completion time)
  const avgCompletionTime = completedTasks.length
    ? completedTasks.reduce((sum, task) => {
        const completionTime =
          new Date(task.completedAt) - new Date(task.createdAt);
        return sum + completionTime;
      }, 0) / completedTasks.length
    : 0;

  // Calculate overall performance score
  const performanceScore = Math.round(
    (completionRate * 0.4 +
      timelinessRate * 0.3 +
      (qualityRating / 100) * 0.3) *
      100
  );

  return {
    score: performanceScore,
    efficiency: avgCompletionTime,
    qualityRating,
  };
}

exports.updateEmployeeStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { taskCompletion, taskPriorities, performanceScore } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee stats
    const stats = {
      taskCompletion: taskCompletion || employee.stats?.taskCompletion,
      taskPriorities: taskPriorities || employee.stats?.taskPriorities,
      performanceScore: performanceScore || employee.stats?.performanceScore,
      lastUpdated: new Date(),
    };

    const updatedEmployee = await User.findByIdAndUpdate(
      employeeId,
      { stats },
      { new: true }
    );

    res.json(updatedEmployee.stats);
  } catch (error) {
    console.error("Error updating employee stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};