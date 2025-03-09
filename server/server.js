// Core Node modules
const fs = require("fs");
const http = require("http");
const path = require("path");
const https = require("https");

// External dependencies
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
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

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const corsOrigin = process.env.CORS_ORIGIN || 'https://localhost:3000';
    const allowedOrigins = corsOrigin.split(',');
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Security middleware with minimal restrictions
app.use(
  helmet({
    contentSecurityPolicy: false,
    contentTypeOptions: false
  })
);

// Add permissive headers middleware
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'disabled');
  next();
});

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

// Direct route handlers for static files
app.get('/static/js/*', (req, res) => {
  const filePath = path.join(__dirname, '../client/build', req.path);
  console.log('Serving JS file:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  res.set('Content-Type', 'application/javascript');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending JS file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error serving JS file');
      }
    }
  });
});

app.get('/static/css/*', (req, res) => {
  const filePath = path.join(__dirname, '../client/build', req.path);
  console.log('Serving CSS file:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  res.set('Content-Type', 'text/css');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending CSS file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error serving CSS file');
      }
    }
  });
});

// Serve other static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve uploads directory
app.use('/uploads', (req, res, next) => {
  // Allow origin
  const origin = req.headers.origin;
  if (origin === 'https://localhost:3000' || origin === 'https://localhost:8443') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1} of ${retries}`);
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
        heartbeatFrequencyMS: 2000,      // More frequent heartbeats
      });
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};

// Initialize MongoDB connection
connectWithRetry()
  .catch(err => {
    console.error('Fatal MongoDB connection error:', err);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// API Routes
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
const contactRoutes = require("./routes/contactRoutes");
const googleReviewsRoutes = require("./routes/googleReviews");
const reviewsRoutes = require("./routes/reviews");

// Mount API routes
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
app.use("/api/contact", contactRoutes);
app.use("/api", googleReviewsRoutes);
app.use("/api/reviews", reviewsRoutes);

// Uploads Directory Configuration
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle client-side routing - This should be AFTER all other routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  }
});

// SSL Certificate configuration
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'certificate.pem'))
};

// Initialize HTTPS server
const server = https.createServer(sslOptions, app);

// Initialize socket.io with HTTPS
const io = initializeSocket(server);
app.set("io", io);

// Error Handling
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export server and app
module.exports = { app, server, io };
