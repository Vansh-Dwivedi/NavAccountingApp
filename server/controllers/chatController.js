const Message = require("../models/Message");
const User = require("../models/User");
const ChatSubmission = require("../models/ChatSubmission");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Notification = require("../models/Notification");
const Chat = require('../models/Chat');
const { getIO } = require('../utils/socket');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("file");

exports.sendMessage = async (req, res) => {
  try {
    const { message, receiver, sender } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({ error: "Receiver and message are required" });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      content: message
    });

    // Get sender details for the notification
    const senderUser = await User.findById(sender);

    // Use the notification utility
    const notification = await require('../utils/notifications').sendNotification(
      receiver,
      "New Message",
      `You have a new message from ${senderUser.username}`,
      sender,
      senderUser.profilePic,
      null
    );

    await newMessage.populate('sender', 'username profilePic');

    const io = req.app.get('io');
    if (io) {
      io.to(receiver.toString()).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.sendMessageWithFile = async (req, res) => {
  try {
    const { receiver, message, fileType } = req.body;
    const sender = req.user.id;
    
    if (!receiver || !message) {
      return res.status(400).json({ error: "Receiver and message are required" });
    }

    let file;
    if (req.file) {
      file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      };
    }

    const newMessage = new Message({
      sender,
      receiver,
      content: message,
      file,
      fileType,
    });

    await newMessage.save();
    await newMessage.populate("sender", "username profilePic");

    // Rest of the notification logic...
    const senderUser = await User.findById(sender);
    const newNotification = new Notification({
      userId: receiver,
      sender: sender,
      message: `${senderUser.username}`,
      senderProfilePic: senderUser.profilePic || "default-profile-pic.jpg",
      createdAt: new Date(),
    });

    await newNotification.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessageWithFile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId || !chatId.includes('-')) {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }

    let [user1Id, user2Id] = chatId.split('-');

    // Handle 'admin' identifier
    if (user1Id === 'admin' || user2Id === 'admin') {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        return res.status(404).json({ error: 'Admin user not found' });
      }
      user1Id = user1Id === 'admin' ? adminUser._id.toString() : user1Id;
      user2Id = user2Id === 'admin' ? adminUser._id.toString() : user2Id;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    })
      .sort({ timestamp: -1 }) // Changed to descending order
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'username profilePic')
      .populate('receiver', 'username profilePic');

    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    });
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ $eq: ["$sender", userId] }, { $eq: ["$receiver", userId] }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          lastMessage: 1,
        },
      },
    ]);
    res.json(conversations);
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.submitToAdmin = async (req, res) => {
  try {
    const { clientId, managerId, remarks } = req.body;
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const chatLog = await Message.find({
      $or: [
        { sender: clientId, receiver: managerId },
        { sender: managerId, receiver: clientId },
      ],
    }).sort("timestamp");

    const submission = {
      clientId,
      managerId,
      remarks,
      chatLog,
      submittedAt: new Date(),
    };

    // Here you would typically save this submission to a new collection
    // For now, we'll just send a notification to the admin
    req.app
      .get("io")
      .to(admin._id.toString())
      .emit("chatSubmission", submission);

    res.json({ message: "Chat submitted to admin successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendToAdmin = async (req, res) => {
  try {
    const { clientId, managerId, remarks } = req.body;
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const chatLog = await Message.find({
      $or: [
        { sender: clientId, receiver: managerId },
        { sender: managerId, receiver: clientId },
      ],
    })
      .sort("timestamp")
      .populate("sender", "username")
      .populate("receiver", "username");

    const submission = new ChatSubmission({
      clientId,
      managerId,
      remarks,
      chatLog: chatLog.map((chat) => chat._id),
      submittedAt: new Date(),
    });

    await submission.save();

    // Use the socket utility to send notification
    const io = getIO();
    io.to(admin._id.toString()).emit('newNotification', {
      type: 'CHAT_SUBMISSION',
      message: 'New chat submission received',
      submissionId: submission._id
    });

    res.json({ message: "Chat submitted to admin successfully" });
  } catch (error) {
    console.error("Error in sendToAdmin:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.getChatSubmissions = async (req, res) => {
  try {
    const submissions = await ChatSubmission.find()
      .populate("clientId", "username")
      .populate("managerId", "username")
      .sort("-submittedAt");
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching chat submissions:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.updateChatSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;
    const submission = await ChatSubmission.findByIdAndUpdate(
      submissionId,
      { status },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    console.error("Error updating chat submission status:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.getSentRemarks = async (req, res) => {
  try {
    const remarks = await ChatSubmission.find({ managerId: req.user.id })
      .populate("clientId", "username")
      .sort("-submittedAt");
    res.json(remarks);
  } catch (error) {
    console.error("Error fetching sent remarks:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.updateRemarkStatus = async (req, res) => {
  try {
    const { remarkId } = req.params;
    const { status } = req.body;
    const remark = await ChatSubmission.findByIdAndUpdate(
      remarkId,
      { status },
      { new: true }
    );
    if (!remark) {
      return res.status(404).json({ error: "Remark not found" });
    }
    res.json(remark);
  } catch (error) {
    console.error("Error updating remark status:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.downloadFile = (req, res) => {
  const filePath = path.join(__dirname, "..", req.params.filePath);
  console.log("Requested file path:", filePath);

  if (fs.existsSync(filePath)) {
    const filename = path.basename(filePath);
    console.log("Sending file:", filename);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    console.error("File not found:", filePath);
    res.status(404).json({ error: "File not found" });
  }
};

exports.getUnreadMessageCounts = async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCounts = await Message.aggregate([
      { $match: { receiver: userId, read: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);

    const countsObject = unreadCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(countsObject);
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    res.status(500).json({ message: "Error fetching unread counts" });
  }
};

exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// IP tracking for bad word attempts with timestamps
const badWordAttempts = new Map();

exports.handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userMsg = message.toLowerCase();
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check if IP is blocked
    const ipData = badWordAttempts.get(clientIP);
    if (ipData && ipData.attempts >= 3) {
      // Check if 24 hours have passed
      const hoursPassed = (Date.now() - ipData.timestamp) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        return res.status(403).json({ 
          reply: "Your access is blocked for 24 hours due to multiple violations.",
          blocked: true
        });
      } else {
        // Reset after 24 hours
        badWordAttempts.delete(clientIP);
      }
    }

    // Bad words list
    const badWords = [
      'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'stupid', 'idiot', 
      'dumb', 'crap', 'fool', 'wtf', 'stfu', 'suck', 'hate', 'jerk',
      'moron', 'retard', 'bastard', 'dick', 'piss', 'cunt', 'whore',
      'fucker', 'asshole', 'bastard', 'twat', 'dickhead', 'motherfucker',
      'faggot', 'nigga'
    ];

    const sexualContent = [
      'sex', 'porn', 'nude', 'naked', 'boob', 'breast', 'penis', 'vagina', 
      'pussy', 'cock', 'anal', 'blowjob', 'handjob', 'masturbat', 'cum',
      'horny', 'threesome', 'orgasm', 'fetish', 'bdsm', 'kinky', 'xxx',
      'erotic', 'nsfw', 'milf', 'escort', 'hookup', 'strip', 'sexy',
      'seduce', 'virgin', 'spank', 'bondage', 'hentai', 'oral', 'dildo',
      'vibrator', 'condom', 'bang', 'fuck'
    ];

    const badResponses = [
      "SILENCE. Your primitive language has no power here. State your business inquiry or leave.",
      "Pathetic. Is this how you handle professional matters? Elevate your communication or exit.",
      "Your emotional outburst is meaningless. Either speak professionally or waste someone else's time.",
      "Weak behavior detected. Real professionals communicate with respect. Last chance.",
      "This childish display ends NOW. State your business purpose or be dismissed.",
      "Your lack of professionalism is embarrassing. Compose yourself and try again.",
      "ENOUGH. This is a business environment. Act accordingly or be removed.",
      "Control your emotions or leave. We only serve professionals here."
    ];

    const sexualResponses = [
      "This is a PROFESSIONAL accounting service. Take your inappropriate content elsewhere.",
      "UNACCEPTABLE. This is a business environment. One more violation and you're blocked.",
      "TERMINATED. Sexual harassment will not be tolerated. Final warning.",
      "VIOLATION DETECTED. This behavior is reportable. Choose your next message carefully.",
      "INAPPROPRIATE CONTENT. This is your last warning before permanent ban."
    ];

    // Check for sexual content first
    if (sexualContent.some(word => userMsg.includes(word))) {
      const currentData = badWordAttempts.get(clientIP) || { attempts: 0, timestamp: Date.now() };
      const newAttempts = currentData.attempts + 2; // Count sexual content as 2 strikes
      badWordAttempts.set(clientIP, { attempts: newAttempts, timestamp: Date.now() });

      if (newAttempts >= 3) {
        return res.status(403).json({ 
          reply: "BLOCKED: Multiple violations of professional conduct. Your IP has been logged and reported. Access blocked for 24 hours.",
          blocked: true
        });
      }

      const remainingAttempts = Math.max(0, 3 - newAttempts);
      const randomResponse = sexualResponses[Math.floor(Math.random() * sexualResponses.length)];
      return res.json({ 
        reply: `${randomResponse} (Warning: ${remainingAttempts} attempts remaining before 24-hour block)` 
      });
    }

    // Check for bad words
    if (badWords.some(word => userMsg.includes(word))) {
      const currentData = badWordAttempts.get(clientIP) || { attempts: 0, timestamp: Date.now() };
      const newAttempts = currentData.attempts + 1;
      badWordAttempts.set(clientIP, { attempts: newAttempts, timestamp: Date.now() });

      if (newAttempts >= 3) {
        return res.status(403).json({ 
          reply: "BLOCKED: Multiple violations of professional conduct. Your IP has been logged and blocked for 24 hours.",
          blocked: true
        });
      }

      const remainingAttempts = 3 - newAttempts;
      const randomResponse = badResponses[Math.floor(Math.random() * badResponses.length)];
      return res.json({ 
        reply: `${randomResponse} (Warning: ${remainingAttempts} attempts remaining before 24-hour block)` 
      });
    }

    let reply = "I'm here to help! How can I assist you with accounting, tax, or business matters?";

    // Greetings
    if (userMsg.includes('hi') || userMsg.includes('hello') || userMsg.includes('hey')) {
      reply = "Hello! Welcome to Nav Accounts. How can I assist you today?";
    }
    // Tax Related
    else if (userMsg.includes('tax preparation')) {
      reply = "Our tax preparation services cover both individual and business returns. Would you like to schedule a consultation?";
    }
    else if (userMsg.includes('tax deadline')) {
      reply = "Federal tax returns are typically due on April 15th. Would you like to discuss your specific tax situation?";
    }
    else if (userMsg.includes('tax deduction')) {
      reply = "We can help identify all eligible tax deductions including business expenses and charitable contributions. Would you like to discuss specific deductions?";
    }
    else if (userMsg.includes('tax')) {
      reply = "We offer comprehensive tax services including preparation, planning, and compliance. How can we help with your tax needs?";
    }
    // Accounting Related
    else if (userMsg.includes('bookkeeping')) {
      reply = "Our bookkeeping services include transaction recording, reconciliation, and financial reporting. Need help organizing your books?";
    }
    else if (userMsg.includes('financial statement')) {
      reply = "We prepare balance sheets, income statements, and cash flow statements. Would you like more information?";
    }
    else if (userMsg.includes('payroll')) {
      reply = "We offer complete payroll services including processing, tax filing, and compliance. Need help with payroll management?";
    }
    else if (userMsg.includes('account') || userMsg.includes('accounting')) {
      reply = "Our accounting services include bookkeeping, financial statements, and business consulting. How can we help you today?";
    }
    // Business Related
    else if (userMsg.includes('start business')) {
      reply = "We can help with business formation, structure selection, and initial setup. Would you like to discuss your business plans?";
    }
    else if (userMsg.includes('business plan')) {
      reply = "We assist in creating comprehensive business plans including financial projections. Shall we schedule a consultation?";
    }
    else if (userMsg.includes('grow business')) {
      reply = "Our business growth services include strategic planning and market expansion strategies. How can we help grow your business?";
    }
    else if (userMsg.includes('business')) {
      reply = "We provide various business services including planning, consulting, and growth strategies. What specific aspect interests you?";
    }
    // Cost Related
    else if (userMsg.includes('how much')) {
      reply = "Our fees vary based on service complexity. We can provide a detailed quote after understanding your needs. What services interest you?";
    }
    else if (userMsg.includes('cost') || userMsg.includes('price') || userMsg.includes('fee')) {
      reply = "Our fees vary based on the services required. Would you like to schedule a consultation to discuss your specific needs?";
    }
    // Contact Related
    else if (userMsg.includes('contact') || userMsg.includes('schedule') || userMsg.includes('appointment')) {
      reply = "You can schedule an appointment by calling us at +1 530-777-3265 or visiting our office at 1469 Butte House Rd. Ste E, Yuba City, CA 95993.";
    }
    // Location Related
    else if (userMsg.includes('where') || userMsg.includes('location') || userMsg.includes('address')) {
      reply = "We're located at 1469 Butte House Rd. Ste E, Yuba City, CA 95993. Would you like directions?";
    }
    // Hours Related
    else if (userMsg.includes('hours') || userMsg.includes('timing')) {
      reply = "We're open Monday through Friday, 9:00 AM to 5:00 PM. When would you like to visit?";
    }
    // Document Related
    else if (userMsg.includes('document') || userMsg.includes('papers')) {
      reply = "Required documents vary by service. For tax preparation, bring W-2s, 1099s, receipts, and previous returns. Need a specific list?";
    }
    // Experience Related
    else if (userMsg.includes('experience') || userMsg.includes('qualification')) {
      reply = "Our team has extensive experience in accounting, tax, and business consulting. Would you like to know more about our expertise?";
    }
    // Software Related
    else if (userMsg.includes('software') || userMsg.includes('online')) {
      reply = "We use industry-leading accounting and tax software. We also provide secure online portals for document sharing.";
    }
    // Emergency Related
    else if (userMsg.includes('emergency') || userMsg.includes('urgent')) {
      reply = "For urgent matters, please call us immediately at +1 530-777-3265. We prioritize emergency situations.";
    }
    // Thank you and Goodbye
    else if (userMsg.includes('thank')) {
      reply = "You're welcome! Is there anything else I can help you with?";
    }
    else if (userMsg.includes('bye') || userMsg.includes('goodbye')) {
      reply = "Thank you for chatting with us! Feel free to reach out if you need anything else. Have a great day!";
    }
    // Default Response
    else {
      reply = "I'm here to help with accounting, tax, and business matters. For specific assistance, you can:\n1. Call us at +1 530-777-3265\n2. Visit our office\n3. Schedule a consultation\n\nWhat would you like to know more about?";
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};