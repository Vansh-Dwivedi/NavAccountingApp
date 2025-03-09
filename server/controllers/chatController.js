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

exports.handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userMsg = message.toLowerCase();

    let reply = "Welcome to Nav Accounts. How may I assist you with our accounting, tax, or business services today?";

    const responses = {
      // Default responses
      'hi': "Hello! How can I assist you today?",
      'hello': "Hello there! How can I assist you today?",
      'hey': "Hey there! How can I assist you today?",
      'who are you': "I'm Ivy, your trusted partner for accounting, tax, and business services. How may I assist you today?",

      // Greetings
      'greetings': "Greetings. Welcome to Nav Accounts. How may I be of assistance to you today?",
      
      // Tax Services
      'tax preparation': "Our tax preparation services encompass both individual and business returns. Would you like to schedule a consultation to discuss your specific tax preparation needs?",
      'tax deadline': "The standard federal tax return deadline is April 15th. However, specific deadlines may vary. May I inquire about your particular tax situation to provide more accurate information?",
      'tax deduction': "We offer expertise in identifying all eligible tax deductions, including business expenses and charitable contributions. Would you like to discuss specific deductions that may apply to your situation?",
      'tax planning': "Our tax planning services aim to optimize your financial position and minimize tax liabilities. Shall we arrange a meeting to develop a comprehensive tax strategy for you?",
      'tax compliance': "We ensure adherence to all relevant tax laws and regulations. How may we assist you in maintaining tax compliance?",
      'tax audit': "Our tax audit support services provide representation and guidance throughout the audit process. Are you currently facing an audit or seeking preventative measures?",
      'tax credit': "We can help identify and apply for various tax credits you may be eligible for. Would you like to explore potential tax credit opportunities?",
      'tax law changes': "We stay abreast of all tax law changes and can advise on how they might affect your financial situation. Is there a specific recent change you're concerned about?",
      'international tax': "Our international tax services cater to businesses and individuals with global financial interests. Do you have specific international tax concerns?",
      'estate tax': "We provide estate tax planning to help minimize tax liabilities on your estate. Would you like to discuss strategies for estate tax optimization?",
      'gift tax': "Our services include advice on gift tax implications and reporting requirements. Do you have questions about gift tax regulations?",
      'capital gains tax': "We can assist with strategies to manage and potentially reduce your capital gains tax. Would you like to discuss your investment portfolio from a tax perspective?",
      'tax extension': "We can help you file for a tax extension if needed. Are you concerned about meeting the upcoming tax deadline?",
      'tax withholding': "We can review your tax withholding to ensure it's optimized for your financial situation. Would you like assistance in adjusting your withholdings?",
      'tax resolution': "Our tax resolution services can help if you're facing tax debt or disputes with tax authorities. Are you currently dealing with any tax controversies?",
      'tax': "We offer a comprehensive suite of tax services including preparation, planning, and compliance. How may we assist you with your specific tax needs?",

      // Accounting Services
      'bookkeeping': "Our professional bookkeeping services include meticulous transaction recording, account reconciliation, and detailed financial reporting. How may we assist in organizing your financial records?",
      'financial statement': "We specialize in preparing accurate and insightful balance sheets, income statements, and cash flow statements. Would you like more information about our financial statement services?",
      'payroll': "Our comprehensive payroll services cover processing, tax filing, and ensuring compliance with all relevant regulations. How can we assist with your payroll management needs?",
      'accounts receivable': "We can help streamline your accounts receivable process to improve cash flow. Would you like to discuss strategies for managing your receivables more effectively?",
      'accounts payable': "Our accounts payable services ensure timely and accurate payment processing. How can we assist in optimizing your payables management?",
      'financial analysis': "We provide in-depth financial analysis to help you understand your business's financial health and make informed decisions. Would you like to schedule a financial review?",
      'budgeting': "Our budgeting services can help you create realistic financial plans and forecasts. Shall we discuss your budgeting needs?",
      'cash flow management': "We offer strategies to optimize your cash flow and ensure financial stability. Would you like to explore ways to improve your cash flow?",
      'financial forecasting': "Our financial forecasting services can help you anticipate future financial scenarios. Are you interested in developing financial projections for your business?",
      'cost accounting': "We provide cost accounting services to help you understand and manage your business expenses. Would you like to discuss strategies for cost optimization?",
      'inventory accounting': "Our inventory accounting services ensure accurate tracking and valuation of your inventory. Do you need assistance with inventory management?",
      'financial software implementation': "We can assist in implementing and optimizing financial software solutions. Are you considering upgrading your accounting systems?",
      'internal controls': "We can help establish robust internal controls to safeguard your assets and ensure financial integrity. Would you like to review your current control systems?",
      'financial reporting': "Our financial reporting services ensure you have accurate and timely financial information. How can we help improve your financial reporting processes?",
      'account reconciliation': "We offer thorough account reconciliation services to ensure the accuracy of your financial records. Would you like assistance with reconciling your accounts?",
      'accounting': "Our comprehensive accounting services encompass bookkeeping, financial statement preparation, and strategic business consulting. How may we address your specific accounting needs today?",

      // Business Services
      'start business': "We offer expert guidance on business formation, structure selection, and initial setup procedures. Would you like to discuss your business plans and explore the most suitable options?",
      'business plan': "Our team can assist in developing comprehensive business plans, including detailed financial projections. Shall we arrange a consultation to discuss your business planning needs?",
      'grow business': "Our business growth services encompass strategic planning, market analysis, and expansion strategies. How may we contribute to your business growth objectives?",
      'business valuation': "We provide professional business valuation services for various purposes including sale, merger, or investment. Do you require a valuation of your business?",
      'business restructuring': "Our restructuring services can help optimize your business operations and financial structure. Would you like to explore potential restructuring strategies?",
      'business consulting': "We offer strategic business consulting to help you navigate challenges and capitalize on opportunities. What specific business issues would you like to address?",
      'merger and acquisition': "Our M&A advisory services cover all aspects of the merger and acquisition process. Are you considering a merger or acquisition?",
      'business succession planning': "We can help develop a comprehensive succession plan for your business. Would you like to discuss strategies for ensuring a smooth transition?",
      'business risk assessment': "Our risk assessment services can help identify and mitigate potential business risks. Shall we conduct a risk analysis for your business?",
      'business performance analysis': "We offer in-depth business performance analysis to help you understand and improve your operations. Would you like to schedule a performance review?",
      'business financing': "We can assist in identifying and securing appropriate financing options for your business. Are you seeking funding for your business ventures?",
      'business tax planning': "Our business tax planning services aim to optimize your tax position and ensure compliance. Shall we discuss tax strategies for your business?",
      'business': "We provide a wide array of business services including strategic planning, financial consulting, and growth strategies. Which specific aspect of business services are you most interested in exploring?",

      // Cost and Pricing
      'how much': "Our service fees are determined based on the complexity and scope of each client's unique needs. To provide an accurate quote, we would need to understand your specific requirements in more detail. Which particular services are you interested in?",
      'cost': "Our pricing structure is tailored to each client's individual needs and the complexity of services required. Would you like to schedule a consultation to discuss your specific requirements and receive a detailed quote?",
      'price': "We offer customized pricing based on the scope and complexity of services needed. May I inquire about the specific services you're interested in so we can provide a more accurate price estimate?",
      'fee': "Our fees are structured to reflect the value and expertise we bring to each client's unique situation. Shall we arrange a meeting to discuss your needs in detail and provide a comprehensive fee proposal?",

      // Contact and Scheduling
      'contact': "To schedule an appointment or discuss our services further, please contact our office at +1 530-777-3265. Alternatively, you're welcome to visit us at 1469 Butte House Rd. Ste E, Yuba City, CA 95993. How would you prefer to proceed?",
      'schedule': "We'd be pleased to schedule an appointment at your convenience. You can reach our scheduling team at +1 530-777-3265. What would be the best time for you to come in?",
      'appointment': "To book an appointment, please call our office at +1 530-777-3265. Our team will be happy to find a suitable time for you. When would you prefer to schedule your visit?",

      // Location and Address
      'where': "Our office is conveniently located at 1469 Butte House Rd. Ste E, Yuba City, CA 95993. Would you like directions or have any questions about our location?",
      'location': "Nav Accounts is situated at 1469 Butte House Rd. Ste E, Yuba City, CA 95993. Is there any specific information you need about our location or how to reach us?",
      'address': "You can find us at 1469 Butte House Rd. Ste E, Yuba City, CA 95993. Do you require any additional details about our address or directions to our office?",

      // Business Hours
      'hours': "Our office operates Monday through Friday, from 9:00 AM to 5:00 PM. When would be a convenient time for you to visit or schedule an appointment?",
      'timing': "We are open for business Monday to Friday, 9:00 AM to 5:00 PM. Is there a particular day or time that works best for your schedule?",

      // Document Requirements
      'document': "The specific documents required can vary depending on the service you need. For tax preparation, typically you'll need W-2s, 1099s, receipts, and previous tax returns. Would you like a detailed list for a particular service?",
      'papers': "Document requirements differ based on the service. For instance, tax preparation usually requires W-2s, 1099s, expense receipts, and prior year tax returns. May I provide you with a specific list tailored to your needs?",

      // Experience and Qualifications
      'experience': "Our team comprises highly experienced professionals with extensive backgrounds in accounting, taxation, and business consulting. Would you like more information about our team's qualifications in a specific area?",
      'qualification': "Nav Accounts is proud to have a team of qualified experts with diverse experience in accounting, tax, and business advisory services. Is there a particular area of expertise you'd like to know more about?",

      // Software and Technology
      'software': "We utilize state-of-the-art accounting and tax software to ensure accuracy and efficiency in our services. Additionally, we provide secure online portals for convenient document sharing and communication. Would you like more details about our technological capabilities?",
      'online': "Our firm employs cutting-edge online solutions, including secure client portals for document sharing and communication. How can our online services benefit your specific needs?",

      // Urgent Matters
      'emergency': "For urgent matters, please contact our office immediately at +1 530-777-3265. We prioritize emergency situations and will address your concerns promptly. What is the nature of your urgent request?",
      'urgent': "If you have an urgent matter, please call us right away at +1 530-777-3265. We understand the importance of timely assistance in critical situations. How may we help you with your urgent need?",

      // Gratitude and Farewells
      'thank': "You're most welcome. We appreciate your interest in Nav Accounts. Is there any other information I can provide or questions I can answer for you?",
      'bye': "Thank you for your time and interest in Nav Accounts. We're here to assist you whenever you need our services. Have a wonderful day, and please don't hesitate to reach out if you need anything further.",
      'goodbye': "We appreciate your engagement with Nav Accounts. Thank you for considering our services. Please feel free to contact us if you have any questions in the future. We wish you a pleasant day ahead."
    };

    let foundResponse = false;
    for (const [key, value] of Object.entries(responses)) {
      if (userMsg.includes(key)) {
        reply = value;
        foundResponse = true;
        break;
      }
    }

    if (!foundResponse) {
      reply = "Thank you for your inquiry. Nav Accounts specializes in accounting, tax, and business advisory services. For personalized assistance, we recommend:\n1. Calling our office at +1 530-777-3265\n2. Visiting our location at 1469 Butte House Rd. Ste E, Yuba City, CA 95993\n3. Scheduling a consultation with one of our experts\n\nWhich aspect of our services would you like more information about?";
    }

    res.json({ reply });
  } catch (error) {
    console.error('An error occurred while processing the chatbot message:', error);
    res.status(500).json({ error: 'We apologize, but we encountered an issue while processing your message. Please try again or contact our office directly.' });
  }
};