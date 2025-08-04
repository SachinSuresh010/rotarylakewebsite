const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireEditor } = require('../middleware/auth');
const admin = require('firebase-admin');
const multer = require('multer');

// Configure multer for memory storage (we'll convert to base64 instead of uploading to Firebase Storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to convert image to base64
const convertImageToBase64 = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error('Failed to convert image to base64');
  }
};

// Helper function to convert buffer to base64 (for multer files)
const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Legacy function - keeping for reference but not using
const uploadToFirebaseStorage = async (file, folder = 'gallery') => {
  try {
    // Get the bucket name from environment or use default
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'rotary-cochin-lakeside.appspot.com';
    console.log('Using bucket:', bucketName);
    const bucket = admin.storage().bucket(bucketName);
    const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', async () => {
        // Make the file public
        await fileUpload.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    throw new Error('Failed to upload image to Firebase Storage');
  }
};

const router = express.Router();



// @route   GET /api/gallery
// @desc    Get all galleries (public) - combines static and dynamic
// @access  Public
router.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    
    // Get static gallery data (existing)
    const staticYears = [
      {
        id: "2024-2025",
        year: "2024-2025",
        title: "2024-2025",
        description: "Current year activities and events",
        image: "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1-1280x853.jpg",
        alt: "2024-2025 Gallery",
        link: "/gallery/2024-2025",
        isStatic: true
      },
      {
        id: "2023-2024",
        year: "2023-2024",
        title: "2023-2024",
        description: "A walk through our journey this year",
        image: "/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-816x614.jpg",
        alt: "2023-2024 Gallery",
        link: "/gallery/2023-2024",
        isStatic: true
      },
      {
        id: "2022-2023",
        year: "2022-2023",
        title: "2022-2023",
        description: "A Collection of our memories",
        image: "/assets/images/img-5252-816x544.jpeg",
        alt: "2022-2023 Gallery",
        link: "/gallery/2022-2023",
        isStatic: true
      }
    ];

    // Get dynamic gallery years from database
    const dynamicYearsSnapshot = await db.collection('gallery_years')
      .where('isActive', '==', true)
      .orderBy('year', 'desc')
      .get();

    const dynamicYears = dynamicYearsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      isStatic: false
    }));

    // Combine static and dynamic, prioritizing dynamic years over static ones
    const allYears = [...staticYears];
    dynamicYears.forEach(dynamicYear => {
      const existingIndex = allYears.findIndex(year => year.year === dynamicYear.year);
      if (existingIndex !== -1) {
        // Replace static year with dynamic year
        allYears[existingIndex] = dynamicYear;
      } else {
        // Add new dynamic year
        allYears.push(dynamicYear);
      }
    });

    // Sort by year (newest first) - server-side sorting now that index is created
    allYears.sort((a, b) => b.year.localeCompare(a.year));

    res.json({ 
      years: allYears,
      total: allYears.length
    });
  } catch (error) {
    console.error('Get galleries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gallery/:year
// @desc    Get gallery by year (public)
// @access  Public
router.get('/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const db = admin.firestore();

    // Check if it's a static year
    const staticYears = ["2022-2023", "2023-2024", "2024-2025"];
    const isStatic = staticYears.includes(year);

    if (isStatic) {
      // Return static data structure
      res.json({ 
        year,
        isStatic: true,
        message: 'Static gallery data - use frontend data'
      });
    } else {
      // Get dynamic year data
      const yearDoc = await db.collection('gallery_years').doc(year).get();
      
      if (!yearDoc.exists) {
        return res.status(404).json({ message: 'Gallery year not found' });
      }

      const yearData = yearDoc.data();
      
      // Get events for this year
      const eventsSnapshot = await db.collection('gallery_events')
        .where('year', '==', year)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        year,
        isStatic: false,
        yearData,
        events
      });
    }
  } catch (error) {
    console.error('Get gallery year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gallery/years
// @desc    Create new gallery year (directors only)
// @access  Private (Editor)
router.post('/years', [
  authenticateToken,
  upload.single('image'),
  body('year').isString().notEmpty(),
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, title, description, alt } = req.body;
    const db = admin.firestore();

    // Check if year already exists
    const existingYear = await db.collection('gallery_years').doc(year).get();
    if (existingYear.exists) {
      return res.status(400).json({ message: 'Gallery year already exists' });
    }

    let imageUrl = '';
    
    // Handle image upload if file is provided
    if (req.file) {
      try {
        // Convert image to base64 instead of uploading to Firebase Storage
        imageUrl = bufferToBase64(req.file.buffer, req.file.mimetype);
      } catch (uploadError) {
        console.error('Image conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process image' });
      }
    } else {
      // Temporarily make image optional for testing
      console.log('No image provided, using placeholder');
      imageUrl = '/assets/images/placeholder.jpg';
    }

    const yearData = {
      year,
      title,
      description,
      image: imageUrl,
      alt: alt || `${year} Gallery`,
      link: `/gallery/${year}`,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.id || req.user.uid
    };

    await db.collection('gallery_years').doc(year).set(yearData);

    res.status(201).json({
      message: 'Gallery year created successfully',
      year: yearData
    });
  } catch (error) {
    console.error('Create gallery year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gallery/events
// @desc    Create new gallery event (directors only)
// @access  Private (Editor)
router.post('/events', [
  authenticateToken,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 20 }
  ]),
  body('year').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('description').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, name, description } = req.body;
    const db = admin.firestore();

    let thumbnailUrl = '';
    let uploadedImages = [];

    // Handle thumbnail upload
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      try {
        // Convert thumbnail to base64 instead of uploading to Firebase Storage
        thumbnailUrl = bufferToBase64(req.files.thumbnail[0].buffer, req.files.thumbnail[0].mimetype);
      } catch (uploadError) {
        console.error('Thumbnail conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process thumbnail' });
      }
    } else {
      return res.status(400).json({ message: 'Thumbnail image is required' });
    }

    // Handle multiple images upload
    if (req.files && req.files.images && req.files.images.length > 0) {
      try {
        for (let i = 0; i < req.files.images.length; i++) {
          // Convert image to base64 instead of uploading to Firebase Storage
          const imageUrl = bufferToBase64(req.files.images[i].buffer, req.files.images[i].mimetype);
          uploadedImages.push({
            id: `img-${Date.now()}-${i}`,
            src: imageUrl,
            alt: `${name} - Image ${i + 1}`
          });
        }
      } catch (uploadError) {
        console.error('Images conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process images' });
      }
    } else {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const eventData = {
      year,
      name,
      description,
      thumbnail: thumbnailUrl,
      images: uploadedImages,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.id || req.user.uid
    };

    const eventRef = await db.collection('gallery_events').add(eventData);

    res.status(201).json({
      message: 'Gallery event created successfully',
      event: {
        id: eventRef.id,
        ...eventData
      }
    });
  } catch (error) {
    console.error('Create gallery event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/gallery/events/:eventId
// @desc    Update gallery event (directors only)
// @access  Private (Editor)
router.put('/events/:eventId', [
  authenticateToken,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 20 }
  ]),
  body('year').optional().isString(),
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('existingImages').optional().isString()
], async (req, res) => {
  try {
    const { eventId } = req.params;
    const db = admin.firestore();

    console.log('Updating event:', eventId);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const eventRef = db.collection('gallery_events').doc(eventId);
    console.log('Looking for event with ID:', eventId);
    console.log('Document path:', eventRef.path);
    
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      console.log('Event not found in database');
      return res.status(404).json({ message: 'Event not found' });
    }

    const currentEvent = eventDoc.data();
    console.log('Current event data:', currentEvent);
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.id || req.user.uid
    };

    // Handle text fields
    if (req.body.year !== undefined) updateData.year = req.body.year;
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;

    // Handle thumbnail
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      try {
        // Convert new thumbnail to base64
        const thumbnailUrl = bufferToBase64(req.files.thumbnail[0].buffer, req.files.thumbnail[0].mimetype);
        updateData.thumbnail = thumbnailUrl;
      } catch (uploadError) {
        console.error('Thumbnail conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process thumbnail' });
      }
    }
    // If no new thumbnail provided, keep existing one (no need to update)

    // Handle images
    let finalImages = [];

    // Add existing images that weren't removed
    if (req.body.existingImages) {
      try {
        // Parse the JSON string from FormData
        const existingImages = JSON.parse(req.body.existingImages);
        finalImages = [...existingImages];
      } catch (parseError) {
        console.error('Failed to parse existingImages:', parseError);
        return res.status(400).json({ message: 'Invalid existing images data' });
      }
    }

    // Add new images
    if (req.files && req.files.images && req.files.images.length > 0) {
      try {
        for (let i = 0; i < req.files.images.length; i++) {
          const imageUrl = bufferToBase64(req.files.images[i].buffer, req.files.images[i].mimetype);
          finalImages.push({
            id: `img-${Date.now()}-${i}`,
            src: imageUrl,
            alt: `${req.body.name || currentEvent.name} - Image ${finalImages.length + 1}`
          });
        }
      } catch (uploadError) {
        console.error('Images conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process images' });
      }
    }

    // Only update images if we have some (either existing or new)
    if (finalImages.length > 0) {
      updateData.images = finalImages;
    }

    console.log('Final update data:', updateData);
    console.log('Event reference path:', eventRef.path);

    // Check if we have any data to update
    if (Object.keys(updateData).length <= 2) { // Only has updatedAt and updatedBy
      console.log('No data to update - only metadata fields present');
      return res.status(400).json({ message: 'No data provided for update' });
    }

    const updateResult = await eventRef.update(updateData);
    console.log('Update result:', updateResult);

    res.json({
      message: 'Gallery event updated successfully',
      eventId
    });
  } catch (error) {
    console.error('Update gallery event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/gallery/events/:eventId
// @desc    Delete gallery event (directors only)
// @access  Private (Editor)
router.delete('/events/:eventId', [
  authenticateToken
], async (req, res) => {
  try {
    const { eventId } = req.params;
    const db = admin.firestore();

    const eventRef = db.collection('gallery_events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Soft delete - mark as inactive
    await eventRef.update({
      isActive: false,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedBy: req.user.id || req.user.uid
    });

    res.json({
      message: 'Gallery event deleted successfully',
      eventId
    });
  } catch (error) {
    console.error('Delete gallery event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/gallery/years/:yearId
// @desc    Update gallery year (directors only)
// @access  Private (Editor)
router.put('/years/:yearId', [
  authenticateToken,
  upload.single('image'),
  body('year').optional().isString(),
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('alt').optional().isString(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { yearId } = req.params;
    const { year, title, description, alt, isActive } = req.body;
    const db = admin.firestore();

    // Check if year exists
    const yearRef = db.collection('gallery_years').doc(yearId);
    const yearDoc = await yearRef.get();
    
    if (!yearDoc.exists) {
      return res.status(404).json({ message: 'Gallery year not found' });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.id || req.user.uid
    };

    // Add fields to update if provided
    if (year !== undefined) updateData.year = year;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (alt !== undefined) updateData.alt = alt;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image upload if file is provided
    if (req.file) {
      try {
        // Convert image to base64 instead of uploading to Firebase Storage
        const imageUrl = bufferToBase64(req.file.buffer, req.file.mimetype);
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('Image conversion error:', uploadError);
        return res.status(500).json({ message: 'Failed to process image' });
      }
    }

    await yearRef.update(updateData);

    res.json({
      message: 'Gallery year updated successfully',
      yearId
    });
  } catch (error) {
    console.error('Update gallery year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/gallery/years/:yearId
// @desc    Delete gallery year (directors only)
// @access  Private (Editor)
router.delete('/years/:yearId', [
  authenticateToken
], async (req, res) => {
  try {
    const { yearId } = req.params;
    const db = admin.firestore();

    const yearRef = db.collection('gallery_years').doc(yearId);
    const yearDoc = await yearRef.get();

    if (!yearDoc.exists) {
      return res.status(404).json({ message: 'Gallery year not found' });
    }

    // Soft delete - mark as inactive
    await yearRef.update({
      isActive: false,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedBy: req.user.id || req.user.uid
    });

    res.json({
      message: 'Gallery year deleted successfully',
      yearId
    });
  } catch (error) {
    console.error('Delete gallery year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gallery/admin/years
// @desc    Get all years for admin (including inactive)
// @access  Private (Editor)
router.get('/admin/years', [
  authenticateToken
], async (req, res) => {
  try {
    const db = admin.firestore();
    
    const yearsSnapshot = await db.collection('gallery_years')
      .orderBy('year', 'desc')
      .get();

    const years = yearsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ years });
  } catch (error) {
    console.error('Get admin years error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gallery/admin/events
// @desc    Get all events for admin (including inactive)
// @access  Private (Editor)
router.get('/admin/events', [
  authenticateToken
], async (req, res) => {
  try {
    const { year } = req.query;
    const db = admin.firestore();
    
    let eventsQuery = db.collection('gallery_events');
    
    if (year) {
      eventsQuery = eventsQuery.where('year', '==', year);
    }
    
    const eventsSnapshot = await eventsQuery
      .orderBy('createdAt', 'desc')
      .get();

    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ events });
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 