const User = require("../models/User");
const Notification = require("../models/Notification"); // You'll need to create this model

exports.sendNotification = async (
  userId,
  title,
  message,
  senderId,
  senderProfilePic
) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      sender: senderId,
      senderProfilePic,
    });
    await notification.save();

    // Emit a socket event to notify the client immediately
    const io = require("../server").io;
    io.to(userId).emit("newNotification", {
      title,
      message,
      createdAt: notification.createdAt,
    });

    console.log(`Notification sent to user ${userId}: ${title}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

exports.sendNotificationToAdmins = async (message, data) => {
  try {
    const adminUsers = await User.find({ role: "admin" });
    for (let admin of adminUsers) {
      await this.sendNotification(admin._id, "Admin Notification", message);
    }
    console.log("Notification sent to all admins");
  } catch (error) {
    console.error("Error sending notification to admins:", error);
  }
};
