const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const { validateRegistration, validateLogin, validateForgotPassword, validateResetPassword } = require("../middleware/validate");
const { loginLimiter, trackLoginAttempt } = require("../middleware/loginRateLimiter");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auditMiddleware = require("../middleware/auditMiddleware");

router.post("/register", auditMiddleware("👤 New user registration"), authController.register);

// Apply rate limiter and tracking to login route
router.post("/login", 
  loginLimiter,
  trackLoginAttempt,
  auditMiddleware("🔑 User login"), 
  authController.login
);

router.post("/logout", auth, auditMiddleware("👋 User logout"), authController.logout);
router.post(
  "/forgot-password",
  // forgotPasswordLimiter,
  validateForgotPassword,
  auditMiddleware("🔄 Password reset requested"),
  authController.forgotPassword
);
router.post("/verify-password", auditMiddleware("✅ Password verification"), authController.verifyPassword);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", auditMiddleware("🔰 Google authentication"), async (req, res) => {
  try {
    const { credential, mode } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (mode === "login" && !user) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    if (mode === "register" && user) {
      return res.status(400).json({ message: "Account already exists" });
    }

    if (!user) {
      // Create new user for registration
      user = new User({
        username: name,
        email,
        profilePic: picture,
        googleId: payload.sub,
        role: "client", // Default role for Google sign-ups
        password: Math.random().toString(36).slice(-8) // Generate random password for Google users
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: `${process.env.API_URL}/api/auth/google/callback`,
    });

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        username: name,
        email,
        profilePic: picture,
        googleId: payload.sub,
        role: "client",
        password: Math.random().toString(36).slice(-8) // Generate random password for Google users
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.CLIENT_URL}/auth/google/callback?token=${token}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({ message: "Failed to process Google callback" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

router.post(
  "/reset-password/:resetToken",
  validateResetPassword,
  auditMiddleware("🔒 Password reset completed"),
  authController.resetPassword
);

// Add this at the end of the file, after other routes
router.use("*", (req, res) => {
  console.log(`Auth route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Auth route not found" });
});

module.exports = router;
