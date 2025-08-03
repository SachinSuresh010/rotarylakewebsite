const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Login user or admin
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const db = req.app.locals.db;

    // Check for fixed admin account first
    if (email === 'admin@rotarylake.com' && password === 'admin123') {
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

      const token = generateToken(adminUser.id);

      res.json({
        message: 'Admin login successful',
        token,
        user: adminUser
      });
      return;
    }

    // Find regular user in Firestore
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await userDoc.ref.update({
      lastLogin: new Date()
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// @route   POST /api/auth/member-signup
// @desc    Register new member (public with access key)
// @access  Public
router.post('/member-signup', [
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('accessKey').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, accessKey } = req.body;
    const db = req.app.locals.db;

    // Validate access key
    const validAccessKeys = process.env.ACCESS_KEYS ? process.env.ACCESS_KEYS.split(',') : ['ROTARY2024'];
    if (!validAccessKeys.includes(accessKey)) {
      return res.status(400).json({ 
        message: 'Invalid access key. Please contact the administrator.' 
      });
    }

    // Check if member already exists
    const membersRef = db.collection('members');
    const existingMemberSnapshot = await membersRef
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingMemberSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Member with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new member
    const newMember = {
      name,
      email,
      password: hashedPassword,
      classification: 'Member',
      status: 'active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const memberRef = await membersRef.add(newMember);
    const memberDoc = await memberRef.get();
    const member = { id: memberDoc.id, ...memberDoc.data() };

    // Remove password from response
    delete member.password;

    res.status(201).json({
      message: 'Member registered successfully',
      member
    });
  } catch (error) {
    console.error('Member registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/member-login
// @desc    Login member
// @access  Public
router.post('/member-login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const db = req.app.locals.db;

    // Find member in Firestore
    const membersRef = db.collection('members');
    const memberSnapshot = await membersRef.where('email', '==', email).limit(1).get();

    if (memberSnapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const memberDoc = memberSnapshot.docs[0];
    const member = { id: memberDoc.id, ...memberDoc.data() };

    if (!member.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await memberDoc.ref.update({
      lastLogin: new Date()
    });

    // Generate token
    const token = generateToken(member.id);

    // Remove password from response
    delete member.password;

    // Check if member has admin role
    const isAdmin = member.role === 'admin' || member.isAdmin === true;

    res.json({
      message: 'Login successful',
      token,
      member: {
        ...member,
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user (admin only)
// @access  Private (Admin)
router.post('/register', [
  authenticateToken,
  requireAdmin,
  body('username').isLength({ min: 3 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'editor', 'viewer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role, profile } = req.body;
    const db = req.app.locals.db;

    // Check if user already exists
    const usersRef = db.collection('users');
    const existingUserSnapshot = await usersRef
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Check if username already exists
    const existingUsernameSnapshot = await usersRef
      .where('username', '==', username)
      .limit(1)
      .get();

    if (!existingUsernameSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Username already taken' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      profile: profile || {},
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userRef = await usersRef.add(newUser);
    const userDoc = await userRef.get();
    const user = { id: userDoc.id, ...userDoc.data() };

    // Remove password from response
    delete user.password;

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/member-me
// @desc    Get current member profile
// @access  Private
router.get('/member-me', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const memberRef = db.collection('members').doc(req.user.id);
    const memberDoc = await memberRef.get();
    
    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    const member = { id: memberDoc.id, ...memberDoc.data() };
    delete member.password; // Remove password from response
    
    // Check if member has admin role
    const isAdmin = member.role === 'admin' || member.isAdmin === true;
    
    res.json({ 
      member: {
        ...member,
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    console.error('Get member profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('profile.firstName').optional().trim(),
  body('profile.lastName').optional().trim(),
  body('profile.phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { profile } = req.body;
    const db = req.app.locals.db;

    const userRef = db.collection('users').doc(req.user.id);
    const updateData = {
      updatedAt: new Date()
    };

    if (profile) {
      updateData.profile = { ...req.user.profile, ...profile };
    }

    await userRef.update(updateData);

    // Get updated user
    const updatedUserDoc = await userRef.get();
    const updatedUser = { id: updatedUserDoc.id, ...updatedUserDoc.data() };

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update member profile
// @access  Private
router.put('/update-profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('currentDesignation').optional().trim(),
  body('profession').optional().trim(),
  body('birthday').optional().trim(),
  body('hobbies').optional().trim(),
  body('familyMembers').optional(),
  body('personalBio').optional().trim(),
  body('personalDetails').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      name, 
      email, 
      currentDesignation, 
      profession, 
      birthday, 
      hobbies, 
      familyMembers,
      personalBio,
      personalDetails 
    } = req.body;
    const db = req.app.locals.db;

    // Check if member exists
    const memberRef = db.collection('members').doc(req.user.id);
    const memberDoc = await memberRef.get();
    
    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (name) {
      updateData.name = name;
    }

    if (email) {
      // Check if email is already taken by another member
      const emailCheckSnapshot = await db.collection('members')
        .where('email', '==', email)
        .where('__name__', '!=', req.user.id)
        .limit(1)
        .get();

      if (!emailCheckSnapshot.empty) {
        return res.status(400).json({ message: 'Email is already in use by another member' });
      }

      updateData.email = email;
    }

    if (currentDesignation !== undefined) {
      updateData.currentDesignation = currentDesignation;
    }

    if (profession !== undefined) {
      updateData.profession = profession;
    }

    if (birthday !== undefined) {
      updateData.birthday = birthday;
    }

    if (hobbies !== undefined) {
      updateData.hobbies = hobbies;
    }

    if (familyMembers !== undefined) {
      updateData.familyMembers = familyMembers;
    }

    if (personalBio !== undefined) {
      updateData.personalBio = personalBio;
    }

    if (personalDetails !== undefined) {
      updateData.personalDetails = personalDetails;
    }

    await memberRef.update(updateData);

    // Get updated member
    const updatedMemberDoc = await memberRef.get();
    const updatedMember = { id: updatedMemberDoc.id, ...updatedMemberDoc.data() };
    delete updatedMember.password; // Remove password from response

    // Check if member has admin role
    const isAdmin = updatedMember.role === 'admin' || updatedMember.isAdmin === true;

    res.json({
      message: 'Profile updated successfully',
      member: {
        ...updatedMember,
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    console.error('Member profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const db = req.app.locals.db;

    // Get current user with password
    const userRef = db.collection('users').doc(req.user.id);
    const userDoc = await userRef.get();
    const user = userDoc.data();

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userRef.update({
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const user = { id: doc.id, ...doc.data() };
      delete user.password; // Remove password from response
      users.push(user);
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/upload-profile-picture
// @desc    Upload member profile picture
// @access  Private
router.post('/upload-profile-picture', [
  authenticateToken,
  upload.single('profilePicture')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const db = req.app.locals.db;
    const memberId = req.user.id;

    // Check if member exists
    const memberRef = db.collection('members').doc(memberId);
    const memberDoc = await memberRef.get();
    
    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Smart image processing with quality preservation
    let processedImageBuffer = req.file.buffer;
    let base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Only compress if the image is too large for Firestore
    if (base64Image.length > 800000) {
      // Start with high quality and gradually reduce if needed
      const qualityLevels = [95, 90, 85, 80, 75];
      
      for (const quality of qualityLevels) {
        try {
          processedImageBuffer = await sharp(req.file.buffer)
            .resize(1200, 1200, { 
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ 
              quality: quality,
              progressive: true,
              mozjpeg: true
            })
            .toBuffer();
          
          const compressedBase64 = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
          
          // Check if it's now small enough
          if (compressedBase64.length <= 800000) {
            base64Image = compressedBase64;
            break;
          }
        } catch (error) {
          console.error(`Compression failed for quality ${quality}:`, error);
        }
      }
      
      // If still too large, try PNG with maximum compression
      if (base64Image.length > 800000) {
        try {
          processedImageBuffer = await sharp(req.file.buffer)
            .resize(1000, 1000, { 
              fit: 'inside',
              withoutEnlargement: true
            })
            .png({ 
              compressionLevel: 9,
              adaptiveFiltering: true
            })
            .toBuffer();
          
          const pngBase64 = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;
          
          if (pngBase64.length <= 800000) {
            base64Image = pngBase64;
          }
        } catch (error) {
          console.error('PNG compression failed:', error);
        }
      }
    }
    
    // Final check - if still too large, reject
    if (base64Image.length > 800000) {
      return res.status(400).json({ 
        message: 'Image is too large even after compression. Please try a smaller image.' 
      });
    }

    // Update member profile with compressed base64 image
    await memberRef.update({
      profileImage: base64Image,
      updatedAt: new Date()
    });

    // Get updated member data
    const updatedMemberDoc = await memberRef.get();
    const updatedMember = { id: updatedMemberDoc.id, ...updatedMemberDoc.data() };
    delete updatedMember.password;

    // Check if member has admin role
    const isAdmin = updatedMember.role === 'admin' || updatedMember.isAdmin === true;

    res.json({
      message: 'Profile picture uploaded successfully',
      member: {
        ...updatedMember,
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 