const User = require("../models/User");
const Notification = require("../models/Notification");
const { getIO } = require('./socket');

exports.sendNotification = async (userId, title, message, senderId, senderProfilePic, formData) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      sender: senderId,
      senderProfilePic,
      formData,
    });
    await notification.save();

    const io = getIO();
    io.to(userId.toString()).emit('newNotification', {
      _id: notification._id,
      title,
      message,
      createdAt: notification.createdAt,
      formData,
      read: false,
      senderProfilePic
    });

    console.log(`Notification sent to user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

exports.sendNotificationToAdmins = async (message, data) => {
  try {
    const adminUsers = await User.find({ role: "admin" });
    for (let admin of adminUsers) {
      await this.sendNotification(admin._id, "Admin Notification", message, null, null, data);
    }
    console.log("Notification sent to all admins");
  } catch (error) {
    console.error("Error sending notification to admins:", error);
  }
};
