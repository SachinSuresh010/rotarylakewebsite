const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireEditor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/members
// @desc    Get all members (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status = 'active',
      classification,
      sortBy = 'joinDate',
      sortOrder = 'asc'
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
      const memberData = doc.data();
      // Filter out sensitive data
      const { password, ...member } = memberData;
      const memberWithId = { id: doc.id, ...member };
      
      // Apply additional filters in memory
      if (classification && memberWithId.classification !== classification) {
        return; // Skip this member
      }
      
      // Convert Firestore timestamps to ISO strings for consistent sorting
      if (memberWithId.createdAt) {
        memberWithId.createdAt = typeof memberWithId.createdAt.toDate === 'function' ? 
                          memberWithId.createdAt.toDate().toISOString() : 
                          new Date(memberWithId.createdAt).toISOString();
      }
      if (memberWithId.joinDate) {
        memberWithId.joinDate = typeof memberWithId.joinDate.toDate === 'function' ? 
                         memberWithId.joinDate.toDate().toISOString() : 
                         new Date(memberWithId.joinDate).toISOString();
      }
      
      members.push(memberWithId);
    });

    // Apply search filter if provided
    let filteredMembers = members;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchLower) ||
        (member.classification && member.classification.toLowerCase().includes(searchLower)) ||
        member.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting in memory
    filteredMembers.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        case 'joinDate':
          aValue = a.joinDate || a.memberSince || a.createdAt || '';
          bValue = b.joinDate || b.memberSince || b.createdAt || '';
          break;
        case 'createdAt':
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
          break;
        default:
          aValue = a.joinDate || a.memberSince || a.createdAt || '';
          bValue = b.joinDate || b.memberSince || b.createdAt || '';
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

    res.json({
      members: paginatedMembers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/members/:id
// @desc    Get member by ID (public)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const memberDoc = await db.collection('members').doc(req.params.id).get();
    
    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const memberData = memberDoc.data();
    // Filter out sensitive data
    const { password, ...member } = memberData;
    const memberWithId = { id: memberDoc.id, ...member };
    res.json({ member: memberWithId });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/members/directors/current
// @desc    Get current directors (public)
// @access  Public
router.get('/directors/current', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allMembersSnapshot = await db.collection('members').get();

    const directors = [];
    allMembersSnapshot.forEach(doc => {
      const member = doc.data();
      if (member.isActive && member.currentDesignation && member.currentDesignation.trim() !== '') {
        // Filter out sensitive data
        const { password, ...safeMember } = member;
        directors.push({ id: doc.id, ...safeMember });
      }
    });
    res.json({ directors });
  } catch (error) {
    console.error('Get current directors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/members/presidents/past
// @desc    Get past presidents (public) - includes both active and inactive past presidents
// @access  Public
router.get('/presidents/past', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allMembersSnapshot = await db.collection('members').get();

    const presidents = [];
    allMembersSnapshot.forEach(doc => {
      const member = doc.data();
      if (member.isPastPresident) {
        // Filter out sensitive data
        const { password, ...safeMember } = member;
        // Add flag to indicate if member is clickable (active members are clickable)
        const presidentData = { 
          id: doc.id, 
          ...safeMember,
          isClickable: member.isActive // Only active members can be clicked
        };
        presidents.push(presidentData);
      }
    });

    // Sort by presidential years (if available)
    presidents.sort((a, b) => {
      const aYears = a.pastPresidentYears || [];
      const bYears = b.pastPresidentYears || [];
      const aLatest = Math.max(...aYears.map(y => parseInt(y) || 0));
      const bLatest = Math.max(...bYears.map(y => parseInt(y) || 0));
      return bLatest - aLatest;
    });

    res.json({ presidents });
  } catch (error) {
    console.error('Get past presidents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/members
// @desc    Create new member (admin/editor only)
// @access  Private
router.post('/', [
  authenticateToken,
  requireEditor,
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('classification').notEmpty().trim(),
  body('joinDate').isISO8601(),
  body('memberSince').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const memberData = req.body;
    const db = req.app.locals.db;

    // Check if member with email already exists
    const existingMemberSnapshot = await db.collection('members')
      .where('email', '==', memberData.email)
      .limit(1)
      .get();

    if (!existingMemberSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Member with this email already exists. Please use the Account Setup tab to set up your password.' 
      });
    }

    // Create new member with admin fields
    const newMember = {
      ...memberData,
      isActive: true,
      status: 'active',
      isAdmin: memberData.isAdmin || false,
      role: memberData.role || 'member',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const memberRef = await db.collection('members').add(newMember);
    const memberDoc = await memberRef.get();
    const member = { id: memberDoc.id, ...memberDoc.data() };

    res.status(201).json({
      message: 'Member created successfully',
      member
    });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/members/:id
// @desc    Update member (admin/editor only)
// @access  Private
router.put('/:id', [
  authenticateToken,
  requireEditor,
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('classification').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const memberRef = db.collection('members').doc(req.params.id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const currentMember = memberDoc.data();

    // Check if email is being changed and if it conflicts
    if (req.body.email && req.body.email !== currentMember.email) {
      const existingMemberSnapshot = await db.collection('members')
        .where('email', '==', req.body.email)
        .limit(1)
        .get();

      if (!existingMemberSnapshot.empty) {
        return res.status(400).json({ 
          message: 'Member with this email already exists. Please use the Account Setup tab to set up your password.' 
        });
      }
    }

    // Update member with admin fields
    const updateData = {
      ...req.body,
      isAdmin: req.body.isAdmin || false,
      role: req.body.role || 'member',
      updatedAt: new Date()
    };

    await memberRef.update(updateData);

    // Get updated member
    const updatedMemberDoc = await memberRef.get();
    const member = { id: updatedMemberDoc.id, ...updatedMemberDoc.data() };

    res.json({
      message: 'Member updated successfully',
      member
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/members/:id
// @desc    Delete member (admin/editor only)
// @access  Private
router.delete('/:id', [
  authenticateToken,
  requireEditor
], async (req, res) => {
  try {
    const db = req.app.locals.db;
    const memberRef = db.collection('members').doc(req.params.id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Completely delete the member from the database
    await memberRef.delete();

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/members/search/classifications
// @desc    Get all unique classifications (public)
// @access  Public
router.get('/search/classifications', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allMembersSnapshot = await db.collection('members').get();

    const classifications = new Set();
    allMembersSnapshot.forEach(doc => {
      const member = doc.data();
      if (member.isActive && member.classification) {
        classifications.add(member.classification);
      }
    });

    res.json({ classifications: Array.from(classifications) });
  } catch (error) {
    console.error('Get classifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/members/:id/family
// @desc    Get family members with member data (public)
// @access  Public
router.get('/:id/family', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const memberDoc = await db.collection('members').doc(req.params.id).get();
    
    if (!memberDoc.exists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const member = { id: memberDoc.id, ...memberDoc.data() };
    const familyMembers = member.familyMembers || [];

    if (familyMembers.length === 0) {
      return res.json({ familyMembers: [] });
    }

    // Get all members to find matches
    const allMembersSnapshot = await db.collection('members').get();
    const allMembers = [];
    allMembersSnapshot.forEach(doc => {
      const memberData = doc.data();
      if (memberData.isActive) {
        allMembers.push({ id: doc.id, ...memberData });
      }
    });

    // Process family members and find matching members
    const processedFamilyMembers = familyMembers.map(familyMember => {
      // First try to find by memberId if it exists
      if (familyMember.memberId) {
        const matchingMember = allMembers.find(member => 
          member.id === familyMember.memberId
        );

        if (matchingMember) {
          return {
            ...familyMember,
            memberId: matchingMember.id,
            isMember: true,
            memberData: {
              id: matchingMember.id,
              name: matchingMember.name,
              currentDesignation: matchingMember.currentDesignation,
              classification: matchingMember.classification,
              isPastPresident: matchingMember.isPastPresident,
              profileImage: matchingMember.profileImage,
              profession: matchingMember.profession,
              personalBio: matchingMember.personalBio
            }
          };
        }
      }

      // Fallback: Try to find a matching member by name (case-insensitive)
      const matchingMember = allMembers.find(member => 
        member.name.toLowerCase() === familyMember.name.toLowerCase()
      );

      if (matchingMember) {
        return {
          ...familyMember,
          memberId: matchingMember.id,
          isMember: true,
          memberData: {
            id: matchingMember.id,
            name: matchingMember.name,
            currentDesignation: matchingMember.currentDesignation,
            classification: matchingMember.classification,
            isPastPresident: matchingMember.isPastPresident,
            profileImage: matchingMember.profileImage,
            profession: matchingMember.profession,
            personalBio: matchingMember.personalBio
          }
        };
      }

      return {
        ...familyMember,
        isMember: false
      };
    });

    res.json({ familyMembers: processedFamilyMembers });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/members/:id/family/link
// @desc    Link family member to existing member (creates bidirectional relationship)
// @access  Private
router.post('/:id/family/link', [
  authenticateToken,
  requireEditor,
  body('targetMemberId').notEmpty().trim(),
  body('relationship').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { targetMemberId, relationship } = req.body;
    const sourceMemberId = req.params.id;
    const db = req.app.locals.db;

    // Get both members
    const sourceMemberDoc = await db.collection('members').doc(sourceMemberId).get();
    const targetMemberDoc = await db.collection('members').doc(targetMemberId).get();

    if (!sourceMemberDoc.exists) {
      return res.status(404).json({ message: 'Source member not found' });
    }

    if (!targetMemberDoc.exists) {
      return res.status(404).json({ message: 'Target member not found' });
    }

    const sourceMember = sourceMemberDoc.data();
    const targetMember = targetMemberDoc.data();

    // Add target member to source member's family
    const sourceFamilyMembers = sourceMember.familyMembers || [];
    const sourceFamilyMember = {
      id: `family-${Date.now()}-${targetMemberId}`,
      name: targetMember.name,
      relationship: relationship,
      photo: targetMember.profileImage,
      profession: targetMember.profession,
      hobbies: targetMember.hobbies,
      birthday: targetMember.birthday,
      personalBio: targetMember.personalBio,
      personalDetails: targetMember.personalDetails,
      memberId: targetMemberId,
      isMember: true
    };

    // Add source member to target member's family (bidirectional)
    const targetFamilyMembers = targetMember.familyMembers || [];
    const inverseRelationship = getInverseRelationship(relationship);
    const targetFamilyMember = {
      id: `family-${Date.now()}-${sourceMemberId}`,
      name: sourceMember.name,
      relationship: inverseRelationship,
      photo: sourceMember.profileImage,
      profession: sourceMember.profession,
      hobbies: sourceMember.hobbies,
      birthday: sourceMember.birthday,
      personalBio: sourceMember.personalBio,
      personalDetails: sourceMember.personalDetails,
      memberId: sourceMemberId,
      isMember: true
    };

    // Update both members in parallel
    await Promise.all([
      db.collection('members').doc(sourceMemberId).update({
        familyMembers: [...sourceFamilyMembers, sourceFamilyMember],
        updatedAt: new Date()
      }),
      db.collection('members').doc(targetMemberId).update({
        familyMembers: [...targetFamilyMembers, targetFamilyMember],
        updatedAt: new Date()
      })
    ]);

    res.json({ 
      message: 'Bidirectional family relationship created successfully',
      sourceMember: { id: sourceMemberId, ...sourceMember },
      targetMember: { id: targetMemberId, ...targetMember },
      relationships: {
        sourceToTarget: { relationship, targetName: targetMember.name },
        targetToSource: { relationship: inverseRelationship, sourceName: sourceMember.name }
      }
    });
  } catch (error) {
    console.error('Link family member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get inverse relationship
function getInverseRelationship(relationship) {
  const inverseMap = {
    'Spouse': 'Spouse',
    'Father': 'Child',
    'Mother': 'Child',
    'Child': 'Parent',
    'Son': 'Parent',
    'Daughter': 'Parent',
    'Brother': 'Brother',
    'Sister': 'Sister',
    'Grandfather': 'Grandchild',
    'Grandmother': 'Grandchild',
    'Grandchild': 'Grandparent',
    'Nephew': 'Uncle/Aunt',
    'Niece': 'Uncle/Aunt',
    'Uncle': 'Nephew/Niece',
    'Aunt': 'Nephew/Niece',
    'Brother-In-Law': 'Brother-In-Law',
    'Sister-In-Law': 'Sister-In-Law',
    'Father-In-Law': 'Son-In-Law/Daughter-In-Law',
    'Mother-In-Law': 'Son-In-Law/Daughter-In-Law',
    'Son-In-Law': 'Father-In-Law/Mother-In-Law',
    'Daughter-In-Law': 'Father-In-Law/Mother-In-Law',
    'Cousin': 'Cousin',
    'Other': 'Other'
  };
  
  return inverseMap[relationship] || 'Other';
}

// @route   DELETE /api/members/:id/family/unlink
// @desc    Unlink family member (removes bidirectional relationship)
// @access  Private
router.delete('/:id/family/unlink', [
  authenticateToken,
  requireEditor,
  body('targetMemberId').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { targetMemberId } = req.body;
    const sourceMemberId = req.params.id;
    const db = req.app.locals.db;

    // Get both members
    const sourceMemberDoc = await db.collection('members').doc(sourceMemberId).get();
    const targetMemberDoc = await db.collection('members').doc(targetMemberId).get();

    if (!sourceMemberDoc.exists) {
      return res.status(404).json({ message: 'Source member not found' });
    }

    if (!targetMemberDoc.exists) {
      return res.status(404).json({ message: 'Target member not found' });
    }

    const sourceMember = sourceMemberDoc.data();
    const targetMember = targetMemberDoc.data();

    // Remove target member from source member's family
    const sourceFamilyMembers = sourceMember.familyMembers || [];
    const updatedSourceFamilyMembers = sourceFamilyMembers.filter(
      fm => fm.memberId !== targetMemberId
    );

    // Remove source member from target member's family
    const targetFamilyMembers = targetMember.familyMembers || [];
    const updatedTargetFamilyMembers = targetFamilyMembers.filter(
      fm => fm.memberId !== sourceMemberId
    );

    // Update both members in parallel
    await Promise.all([
      db.collection('members').doc(sourceMemberId).update({
        familyMembers: updatedSourceFamilyMembers,
        updatedAt: new Date()
      }),
      db.collection('members').doc(targetMemberId).update({
        familyMembers: updatedTargetFamilyMembers,
        updatedAt: new Date()
      })
    ]);

    res.json({ 
      message: 'Bidirectional family relationship removed successfully',
      sourceMember: { id: sourceMemberId, ...sourceMember },
      targetMember: { id: targetMemberId, ...targetMember }
    });
  } catch (error) {
    console.error('Unlink family member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 