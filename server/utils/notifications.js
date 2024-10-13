const User = require("../models/User");
const Notification = require("../models/Notification"); // You'll need to create this model

exports.sendNotification = async (
  userId,
  title,
  message,
  senderId,
  senderProfilePic,
  formData
) => {
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

    // Emit a socket event to notify the client immediately
    const io = require("../server").io;
    if (io) {
      io.to(userId.toString()).emit("newNotification", {
        title,
        message,
        createdAt: notification.createdAt,
        formData,
      });
    } else {
      console.warn("Socket.io instance not available. Real-time notification not sent.");
    }

    console.log(`Notification sent to user ${userId}: ${title}`);
  } catch (error) {
    console.error("Error sending notification:", error);
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
