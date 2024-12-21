// Core Node modules
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

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

// SSL Certificate configuration
const privateKey = fs.readFileSync('/home/ubuntu/NavAccountingApp/ubuntu/certificates/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('/home/ubuntu/NavAccountingApp/ubuntu/certificates/certificate.pem', 'utf8');
const credentials = { 
  key: privateKey, 
  cert: certificate,
};

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://navaccounts.com',
    'https://www.navaccounts.com',
    process.env.NODE_ENV === 'development' ? 'https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443' : false
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
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
      res.status(500).send('Error serving JS file');
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
      res.status(500).send('Error serving CSS file');
    }
  });
});

// Serve other static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
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

// Initialize socket.io with HTTP and HTTPS
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const io = initializeSocket(httpServer);
const httpsIo = initializeSocket(httpsServer);
app.set("io", io);

// Error Handling
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export servers and app
module.exports = { app, server: httpServer, httpsServer, io };
