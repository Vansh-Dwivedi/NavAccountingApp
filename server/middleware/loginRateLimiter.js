const rateLimit = require('express-rate-limit');

// Store failed attempts in memory
const failedLoginAttempts = new Map();

const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3, // 3 attempts
  message: { 
    error: 'Too many login attempts. Please try again in 30 seconds.',
    attemptsRemaining: 0,
    blockDuration: 30
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.ip}:${req.body.email}`;
  }
});

// Middleware to track failed attempts
const trackLoginAttempt = (req, res, next) => {
  const key = `${req.ip}:${req.body.email}`;
  
  // Reset on successful login
  res.on('finish', () => {
    if (res.statusCode === 200) {
      failedLoginAttempts.delete(key);
    } else if (res.statusCode === 401) {
      const attempts = (failedLoginAttempts.get(key) || 0) + 1;
      failedLoginAttempts.set(key, attempts);
      
      // Set expiry for failed attempts
      setTimeout(() => {
        failedLoginAttempts.delete(key);
      }, 30000); // 30 seconds
    }
  });

  // Add attempts info to request object
  req.loginAttempts = {
    remaining: Math.max(0, 3 - (failedLoginAttempts.get(key) || 0))
  };
  
  next();
};

module.exports = { loginLimiter, trackLoginAttempt };
