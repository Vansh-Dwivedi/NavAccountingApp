// Core Node modules
const fs = require("fs");
const http = require("http");
const path = require("path");

// External dependencies
const cors = require("cors");
const express = require("express");
const fileUpload = require('express-fileupload');
const helmet = require("helmet");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const { initializeSocket } = require("./utils/socket");

// Load environment variables
require("dotenv").config();

// Log environment variables
console.log("Environment variables:");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);

// Route imports
const adminRoutes = require("./routes/adminRoutes");
const appRoutes = require("./routes/appRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const componentRoutes = require("./routes/componentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const fileRoutes = require("./routes/fileRoutes");
const formRoutes = require("./routes/formRoutes");
const logRoutes = require("./routes/logRoutes");
const noteRoutes = require("./routes/noteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardConfigRoutes = require("./routes/dashboardConfigRoutes");

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Manual CORS headers for more control
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  console.log("Request body:", req.body);
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Please set it in your .env file.");
  process.exit(1);
}

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/app", appRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/signatures", require("./routes/signatureRoutes"));
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api", componentRoutes);
app.use("/api/dashboard-management", dashboardConfigRoutes);

// File upload handling
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static file serving
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path, stat) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// 404 handler for uploads
app.use("/uploads", (req, res) => {
  res.status(404).send("File not found");
});

// Socket.IO setup
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);
app.set('io', io);

// Socket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId} joined`);
    }
  });

  socket.on("sendMessage", (message) => {
    if (message.receiver) {
      io.to(message.receiver.toString()).emit("newMessage", message);
    }
  });

  socket.on("notification", (notification) => {
    io.to(notification.userId).emit("newNotification", notification);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Update message handling route
app.post("/api/messages", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const io = app.get('io');
    io.to(receiverId.toString()).emit('newMessage', {
      id: newMessage._id,
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: newMessage.createdAt,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`No route found for ${req.method} ${req.originalUrl}`);
  console.log(
    "Available routes:",
    app._router.stack.filter((r) => r.route).map((r) => r.route.path)
  );
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Export server
module.exports = { app, server, io };