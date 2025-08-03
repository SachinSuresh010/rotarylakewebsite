const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get member statistics using simpler queries
    const membersSnapshot = await db.collection('members').get();
    const totalMembers = membersSnapshot.size;
    
    // Process members in memory to avoid composite index requirements
    let activeMembers = 0;
    let currentDirectors = 0;
    let pastPresidents = 0;
    let recentMembers = [];
    
    membersSnapshot.forEach(doc => {
      const member = doc.data();
      
      if (member.isActive && member.status === 'active') {
        activeMembers++;
      }
      
      if (member.isActive && member.currentDesignation && member.currentDesignation.trim() !== '') {
        currentDirectors++;
      }
      
      if (member.isActive && member.isPastPresident) {
        pastPresidents++;
      }
      
      // Get recent members (last 5)
      if (member.isActive) {
        recentMembers.push({
          id: doc.id,
          name: member.name,
          email: member.email,
          classification: member.classification,
          joinDate: member.joinDate
        });
      }
    });

    // Sort recent members by creation date
    recentMembers.sort((a, b) => {
      const aDate = a.joinDate && typeof a.joinDate.toDate === 'function' ? a.joinDate.toDate() : 
                   a.joinDate ? new Date(a.joinDate) : new Date(0);
      const bDate = b.joinDate && typeof b.joinDate.toDate === 'function' ? b.joinDate.toDate() : 
                   b.joinDate ? new Date(b.joinDate) : new Date(0);
      return bDate - aDate;
    });
    recentMembers = recentMembers.slice(0, 5);

    // Get user statistics
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    let activeUsers = 0;
    let recentUsers = [];
    
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      if (user.isActive) {
        activeUsers++;
      }
      
      if (user.isActive) {
        recentUsers.push({
          id: doc.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        });
      }
    });

    // Sort recent users by last login
    recentUsers.sort((a, b) => {
      const aDate = a.lastLogin && typeof a.lastLogin.toDate === 'function' ? a.lastLogin.toDate() : 
                   a.lastLogin ? new Date(a.lastLogin) : new Date(0);
      const bDate = b.lastLogin && typeof b.lastLogin.toDate === 'function' ? b.lastLogin.toDate() : 
                   b.lastLogin ? new Date(b.lastLogin) : new Date(0);
      return bDate - aDate;
    });
    recentUsers = recentUsers.slice(0, 5);

    // Get classification breakdown
    const classificationCount = {};
    membersSnapshot.forEach(doc => {
      const member = doc.data();
      if (member.isActive) {
        const classification = member.classification || 'Unknown';
        classificationCount[classification] = (classificationCount[classification] || 0) + 1;
      }
    });

    const classifications = Object.entries(classificationCount)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      statistics: {
        members: {
          total: totalMembers,
          active: activeMembers,
          currentDirectors,
          pastPresidents
        },
        users: {
          total: totalUsers,
          active: activeUsers
        }
      },
      recentActivity: {
        members: recentMembers,
        users: recentUsers
      },
      classifications
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/members/bulk-import
// @desc    Bulk import members from JSON
// @access  Private (Admin)
router.post('/members/bulk-import', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: 'Members must be an array' });
    }

    const db = req.app.locals.db;
    const results = {
      imported: 0,
      skipped: 0,
      errors: []
    };

    for (const memberData of members) {
      try {
        // Check if member already exists
        const existingMemberSnapshot = await db.collection('members')
          .where('email', '==', memberData.email)
          .limit(1)
          .get();

        if (!existingMemberSnapshot.empty) {
          results.skipped++;
          continue;
        }

        // Create new member
        const newMember = {
          ...memberData,
          isActive: true,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('members').add(newMember);
        results.imported++;
      } catch (error) {
        results.errors.push({
          member: memberData.name || 'Unknown',
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk import completed',
      results
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/members/export
// @desc    Export all members as JSON
// @access  Private (Admin)
router.get('/members/export', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const membersSnapshot = await db.collection('members')
      .where('isActive', '==', true)
      .get();

    const members = [];
    membersSnapshot.forEach(doc => {
      const member = { id: doc.id, ...doc.data() };
      // Convert Firestore timestamps to ISO strings
      if (member.createdAt) {
        member.createdAt = member.createdAt.toDate().toISOString();
      }
      if (member.updatedAt) {
        member.updatedAt = member.updatedAt.toDate().toISOString();
      }
      if (member.joinDate) {
        member.joinDate = member.joinDate.toDate().toISOString();
      }
      members.push(member);
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=members-export.json');
    res.json({ members });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/members/bulk-update
// @desc    Bulk update member status
// @access  Private (Admin)
router.post('/members/bulk-update', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { memberIds, updates } = req.body;

    if (!Array.isArray(memberIds) || !updates) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const db = req.app.locals.db;
    const batch = db.batch();
    let modifiedCount = 0;

    for (const memberId of memberIds) {
      const memberRef = db.collection('members').doc(memberId);
      batch.update(memberRef, {
        ...updates,
        updatedAt: new Date()
      });
      modifiedCount++;
    }

    await batch.commit();

    res.json({
      message: 'Bulk update completed',
      modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private (Admin)
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const db = req.app.locals.db;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get all members and process in memory
    const allMembersSnapshot = await db.collection('members').get();
    
    const memberGrowth = [];
    const growthByDate = {};
    const classificationCount = {};
    const statusCount = {};

    allMembersSnapshot.forEach(doc => {
      const member = doc.data();
      
      // Only process active members
      if (!member.isActive) return;
      
      // Member growth over time
      if (member.createdAt && member.createdAt.toDate() >= startDate) {
        const date = member.createdAt.toDate().toISOString().split('T')[0];
        growthByDate[date] = (growthByDate[date] || 0) + 1;
      }
      
      // Classification distribution
      const classification = member.classification || 'Unknown';
      classificationCount[classification] = (classificationCount[classification] || 0) + 1;
      
      // Status distribution
      const status = member.status || 'active';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Process member growth data
    Object.entries(growthByDate).forEach(([date, count]) => {
      const [year, month, day] = date.split('-');
      memberGrowth.push({
        _id: { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
        count
      });
    });

    // Sort member growth by date
    memberGrowth.sort((a, b) => {
      const aDate = new Date(a._id.year, a._id.month - 1, a._id.day);
      const bDate = new Date(b._id.year, b._id.month - 1, b._id.day);
      return aDate - bDate;
    });

    const classificationStats = Object.entries(classificationCount)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count);

    const statusStats = Object.entries(statusCount)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      period,
      memberGrowth,
      classificationStats,
      statusStats
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/members/all
// @desc    Get all members with signup and login activity
// @access  Private (Admin)
router.get('/members/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search, 
      status = 'active',
      classification,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const db = req.app.locals.db;
    const membersRef = db.collection('members');
    
    // Use simple query without complex filters to avoid index issues
    let query = membersRef;
    
    // Only apply simple filters that don't require composite indexes
    if (status === 'active') {
      query = query.where('isActive', '==', true);
    } else if (status === 'inactive') {
      query = query.where('isActive', '==', false);
    }
    // If status is 'all', no filter applied
    
    // Get all data first (simpler approach to avoid index issues)
    const allMembersSnapshot = await query.get();
    const total = allMembersSnapshot.size;
    
    // Process all members in memory (for small datasets this is fine)
    let members = [];
    allMembersSnapshot.forEach(doc => {
      const member = { 
        _id: doc.id, 
        ...doc.data() 
      };
      
      // Apply additional filters in memory
      if (classification && member.classification !== classification) {
        return; // Skip this member
      }
      
      // Convert Firestore timestamps to ISO strings
      if (member.createdAt) {
        member.createdAt = typeof member.createdAt.toDate === 'function' ? 
                          member.createdAt.toDate().toISOString() : 
                          new Date(member.createdAt).toISOString();
      }
      if (member.updatedAt) {
        member.updatedAt = typeof member.updatedAt.toDate === 'function' ? 
                          member.updatedAt.toDate().toISOString() : 
                          new Date(member.updatedAt).toISOString();
      }
      if (member.lastLogin) {
        member.lastLogin = typeof member.lastLogin.toDate === 'function' ? 
                          member.lastLogin.toDate().toISOString() : 
                          new Date(member.lastLogin).toISOString();
      }
      if (member.joinDate) {
        member.joinDate = typeof member.joinDate.toDate === 'function' ? 
                         member.joinDate.toDate().toISOString() : 
                         new Date(member.joinDate).toISOString();
      }
      
      // Add login status
      member.hasLoggedIn = !!member.lastLogin;
      member.loginStatus = member.hasLoggedIn ? 'Logged In' : 'Never Logged In';
      
      // Calculate days since last login
      if (member.lastLogin) {
        const lastLoginDate = new Date(member.lastLogin);
        const now = new Date();
        const daysSinceLogin = Math.floor((now - lastLoginDate) / (1000 * 60 * 60 * 24));
        member.daysSinceLastLogin = daysSinceLogin;
        member.lastLoginText = daysSinceLogin === 0 ? 'Today' : 
                              daysSinceLogin === 1 ? 'Yesterday' : 
                              `${daysSinceLogin} days ago`;
      } else {
        member.daysSinceLastLogin = null;
        member.lastLoginText = 'Never';
      }
      
      // Calculate days since signup
      if (member.createdAt) {
        const signupDate = new Date(member.createdAt);
        const now = new Date();
        const daysSinceSignup = Math.floor((now - signupDate) / (1000 * 60 * 60 * 24));
        member.daysSinceSignup = daysSinceSignup;
        member.signupText = daysSinceSignup === 0 ? 'Today' : 
                           daysSinceSignup === 1 ? 'Yesterday' : 
                           `${daysSinceSignup} days ago`;
      }
      
      members.push(member);
    });

    // Apply search filter if provided
    let filteredMembers = members;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        (member.classification && member.classification.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting in memory
    filteredMembers.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'createdAt':
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
          break;
        case 'lastLogin':
          aValue = a.lastLogin || '';
          bValue = b.lastLogin || '';
          break;
        default:
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

    // Get summary statistics based on filtered data
    const totalMembers = total;
    const activeMembers = status === 'active' ? total : 
                         status === 'inactive' ? 0 : 
                         allMembersSnapshot.docs.filter(doc => doc.data().isActive && doc.data().status === 'active').length;
    const membersWithLogin = filteredMembers.filter(m => m.hasLoggedIn).length;
    const recentLogins = filteredMembers.filter(m => {
      if (!m.lastLogin) return false;
      const daysSinceLogin = m.daysSinceLastLogin;
      return daysSinceLogin !== null && daysSinceLogin !== undefined && daysSinceLogin <= 7;
    }).length;

    res.json({
      members: paginatedMembers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredMembers.length,
        pages: Math.ceil(filteredMembers.length / parseInt(limit))
      },
      statistics: {
        totalMembers,
        activeMembers,
        membersWithLogin,
        recentLogins,
        loginRate: totalMembers > 0 ? Math.round((membersWithLogin / totalMembers) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Get all members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/members/login-activity
// @desc    Get member login activity statistics
// @access  Private (Admin)
router.get('/members/login-activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const db = req.app.locals.db;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get all members
    const allMembersSnapshot = await db.collection('members').get();
    
    const loginActivity = {
      totalMembers: allMembersSnapshot.size,
      membersWithLogin: 0,
      membersWithoutLogin: 0,
      recentLogins: 0,
      loginByPeriod: {
        last7Days: 0,
        last30Days: 0,
        last90Days: 0
      },
      loginTrend: []
    };

    const loginByDate = {};

    allMembersSnapshot.forEach(doc => {
      const member = doc.data();
      
      if (member.lastLogin) {
        loginActivity.membersWithLogin++;
        
        const lastLoginDate = member.lastLogin.toDate();
        const daysSinceLogin = Math.floor((now - lastLoginDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLogin <= 7) {
          loginActivity.recentLogins++;
          loginActivity.loginByPeriod.last7Days++;
        }
        if (daysSinceLogin <= 30) {
          loginActivity.loginByPeriod.last30Days++;
        }
        if (daysSinceLogin <= 90) {
          loginActivity.loginByPeriod.last90Days++;
        }
        
        // Track login trend by date
        const loginDate = lastLoginDate.toISOString().split('T')[0];
        loginByDate[loginDate] = (loginByDate[loginDate] || 0) + 1;
      } else {
        loginActivity.membersWithoutLogin++;
      }
    });

    // Convert login trend to array
    Object.entries(loginByDate).forEach(([date, count]) => {
      loginActivity.loginTrend.push({
        date,
        count
      });
    });

    // Sort login trend by date
    loginActivity.loginTrend.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      period,
      loginActivity
    });
  } catch (error) {
    console.error('Login activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 