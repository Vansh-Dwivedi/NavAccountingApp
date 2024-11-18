const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");
const auditMiddleware = require('../middleware/auditMiddleware');

router.get("/", protect, auditMiddleware('🔔 Viewed notifications'), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.params.id
    );
    
    // Get socket instance and emit event for single notification
    const io = require('../utils/socket').getIO();
    io.to(req.user._id.toString()).emit('notificationRead', req.params.id);
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" + error });
  }
});

router.put("/mark-all-read", protect, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    
    // Get socket instance and emit event
    const io = require('../utils/socket').getIO();
    io.to(req.user._id.toString()).emit('allNotificationsRead');
    
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking all notifications as read" });
  }
});

module.exports = router;
