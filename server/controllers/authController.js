const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { createLog } = require("./logController");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); // We'll create this utility later
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { username, email, password, firmId, pin } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user with additional fields
    const user = await User.create({
      username,
      email,
      password,
      firmId,
      pin,
      role: "client",
    });

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await createLog(user._id, "User registered as client");

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid email or password",
        attemptsRemaining: req.loginAttempts?.remaining || 0
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');

    if (!isPasswordValid) {
      const attemptsRemaining = req.loginAttempts?.remaining || 0;
      return res.status(401).json({ 
        error: "Invalid email or password",
        attemptsRemaining,
        blockDuration: attemptsRemaining === 0 ? 30 : null
      });
    }

    if (user.isBlocked) {
      return res.status(401).json({
        error: "Your account has been blocked. Please contact an administrator."
      });
    }

    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('User data for token:', { id: user._id, role: user.role });

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1d" }
    );

    console.log('Token generated:', !!token);

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// Implement logout, forgotPassword, etc.

exports.logout = async (req, res) => {
  try {
    await createLog(req.user._id, "User logged out");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Send password reset email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: `<h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password:</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>`,
    });

    res.json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await createLog(user._id, "Password reset");

    // Send password reset confirmation email
    await sendEmail({
      email: user.email,
      subject: "Your password has been changed",
      html: "<h1>Password Reset Successful</h1><p>Your password has been successfully reset. If you did not request this change, please contact support immediately.</p>",
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ isValid: false });
    }
    res.json({ isValid: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential, mode } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (mode === 'login' && !user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (!user && mode === 'register') {
      user = await User.create({
        username: name,
        email,
        googleId,
        profilePic: picture,
        role: 'client',
        password: crypto.randomBytes(20).toString('hex') // Random password for Google users
      });
    }

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};
