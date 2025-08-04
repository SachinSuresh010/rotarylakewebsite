const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = req.app.locals.db;
    
    // Handle hardcoded admin user
    if (decoded.userId === 'admin') {
      const adminUser = {
        id: 'admin',
        username: 'admin',
        email: 'admin@rotarylake.com',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      req.user = adminUser;
      next();
      return;
    }
    
    // Check if it's a member
    const memberDoc = await db.collection('members').doc(decoded.userId).get();
    
    if (memberDoc.exists) {
      const member = { id: memberDoc.id, ...memberDoc.data() };
      
      if (!member.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      // Set the member as the user
      req.user = member;
      next();
      return;
    }
    
    // Get user from Firestore for regular users (admin users)
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = { id: userDoc.id, ...userDoc.data() };
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware for admin only
const requireAdmin = requireRole(['admin']);

// Middleware for admin and editor
const requireEditor = requireRole(['admin', 'editor']);

// Middleware for admin, editor, and viewer
const requireViewer = requireRole(['admin', 'editor', 'viewer']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireEditor,
  requireViewer
}; 