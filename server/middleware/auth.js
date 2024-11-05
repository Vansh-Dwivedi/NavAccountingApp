const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

exports.canUpdateUser = async (req, res, next) => {
  try {
    // Allow admins to update any user
    if (req.user.role === 'admin') {
      return next();
    }

    // Users can only update their own info
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = auth;