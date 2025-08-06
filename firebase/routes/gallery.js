const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireEditor } = require('../middleware/auth');
const admin = require('firebase-admin');
const multer = require('multer');
const sharp = require('sharp');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit (reduced from 5MB)
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

// Helper function to compress and resize image
const compressImage = async (buffer, maxWidth = 800, maxHeight = 800, quality = 60) => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Resize if image is larger than max dimensions
    let resizedImage = image;
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      resizedImage = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to JPEG and compress more aggressively
    const compressedBuffer = await resizedImage
      .jpeg({ quality, progressive: true })
      .toBuffer();
    
    return compressedBuffer;
  } catch (error) {
    throw new Error('Failed to compress image');
  }
};

// Helper function to convert buffer to base64 with compression
const bufferToBase64Compressed = async (buffer, mimetype) => {
  try {
    // Compress the image
    const compressedBuffer = await compressImage(buffer);
    return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
  } catch (error) {
    throw new Error('Failed to compress and convert image');
  }
};

// Helper function to check document size (approximate)
const estimateDocumentSize = (data) => {
  const jsonString = JSON.stringify(data);
  return Buffer.byteLength(jsonString, 'utf8');
};

// Helper function to validate document size
const validateDocumentSize = (data, maxSize = 900000) => { // 900KB to be safe
  const size = estimateDocumentSize(data);
  return {
    isValid: size <= maxSize,
    size: size,
    maxSize: maxSize
  };
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

// Legacy function - keeping for reference but not using
const deleteFromFirebaseStorage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.startsWith('https://storage.googleapis.com/')) {
      return; // Not a Firebase Storage URL
    }
    
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'rotary-cochin-lakeside.appspot.com';
    const bucket = admin.storage().bucket(bucketName);
    
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(3).join('/'); // Remove https://storage.googleapis.com/bucket-name/
    
    await bucket.file(filePath).delete();
  } catch (error) {
    console.error('Failed to delete image from Firebase Storage:', error);
    // Don't throw error as this is not critical
  }
};

// Legacy function - keeping for reference but not using
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

// Legacy function - keeping for reference but not using
const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
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

    // Always check for dynamic events first, regardless of whether it's a static year
    const eventsSnapshot = await db.collection('gallery_events')
      .where('year', '==', year)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (isStatic) {
      // For static years, return both static info and any dynamic events
      res.json({ 
        year,
        isStatic: true,
        hasDynamicEvents: events.length > 0,
        events: events,
        message: events.length > 0 ? 'Static year with dynamic events' : 'Static gallery data - use frontend data'
      });
    } else {
      // Get dynamic year data
      const yearDoc = await db.collection('gallery_years').doc(year).get();
      
      if (!yearDoc.exists) {
        return res.status(404).json({ message: 'Gallery year not found' });
      }

      const yearData = yearDoc.data();

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
  body('description').isString().notEmpty(),
  body('imageUrl').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, title, description, alt, imageUrl } = req.body;
    const db = admin.firestore();

    // Check if year already exists
    const existingYear = await db.collection('gallery_years').doc(year).get();
    if (existingYear.exists) {
      return res.status(400).json({ message: 'Gallery year already exists' });
    }

    let imageUrlFinal = '';
    
    // Handle image - either uploaded file or URL
    if (req.file) {
      try {
        // Compress and convert image to base64
        imageUrlFinal = await bufferToBase64Compressed(req.file.buffer, req.file.mimetype);
      } catch (uploadError) {
        console.error('Image compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process image' });
      }
    } else if (imageUrl && imageUrl.trim()) {
      // Use provided URL
      imageUrlFinal = imageUrl.trim();
    } else {
      // Temporarily make image optional for testing
      console.log('No image provided, using placeholder');
      imageUrlFinal = '/assets/images/placeholder.jpg';
    }

    const yearData = {
      year,
      title,
      description,
      image: imageUrlFinal,
      alt: alt || `${year} Gallery`,
      link: `/gallery/${year}`,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.id || req.user.uid
    };

    // Validate document size
    const sizeValidation = validateDocumentSize(yearData);
    if (!sizeValidation.isValid) {
      return res.status(400).json({ 
        message: `Document size (${Math.round(sizeValidation.size/1024)}KB) exceeds limit (${Math.round(sizeValidation.maxSize/1024)}KB). Please use a smaller image.` 
      });
    }

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
    { name: 'images', maxCount: 10 } // Reduced from 20 to 10
  ]),
  body('year').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('thumbnailUrl').optional().isString(),
  body('imageUrls').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, name, description, thumbnailUrl, imageUrls } = req.body;
    const db = admin.firestore();

    let thumbnailUrlFinal = '';
    let uploadedImages = [];

    // Handle thumbnail - either uploaded file or URL
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      try {
        // Compress and convert thumbnail to base64
        thumbnailUrlFinal = await bufferToBase64Compressed(req.files.thumbnail[0].buffer, req.files.thumbnail[0].mimetype);
      } catch (uploadError) {
        console.error('Thumbnail compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process thumbnail' });
      }
    } else if (thumbnailUrl && thumbnailUrl.trim()) {
      // Use provided URL
      thumbnailUrlFinal = thumbnailUrl.trim();
    } else {
      return res.status(400).json({ message: 'Thumbnail image is required (upload file or provide URL)' });
    }

    // Handle multiple images - either uploaded files or URLs
    if (req.files && req.files.images && req.files.images.length > 0) {
      try {
        for (let i = 0; i < req.files.images.length; i++) {
          // Compress and convert image to base64
          const imageUrl = await bufferToBase64Compressed(req.files.images[i].buffer, req.files.images[i].mimetype);
          uploadedImages.push({
            id: `img-${Date.now()}-${i}`,
            src: imageUrl,
            alt: `${name} - Image ${i + 1}`
          });
        }
      } catch (uploadError) {
        console.error('Images compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process images' });
      }
    }

    // Handle URL images
    if (imageUrls) {
      try {
        const urlImages = JSON.parse(imageUrls);
        for (let i = 0; i < urlImages.length; i++) {
          uploadedImages.push({
            id: `url-img-${Date.now()}-${i}`,
            src: urlImages[i].url,
            alt: urlImages[i].alt || `${name} - Image ${uploadedImages.length + 1}`
          });
        }
      } catch (parseError) {
        console.error('Failed to parse image URLs:', parseError);
        return res.status(400).json({ message: 'Invalid image URLs data' });
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({ message: 'At least one image is required (upload files or provide URLs)' });
    }

    const eventData = {
      year,
      name,
      description,
      thumbnail: thumbnailUrlFinal,
      images: uploadedImages,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.id || req.user.uid
    };

    // Validate document size
    const sizeValidation = validateDocumentSize(eventData);
    if (!sizeValidation.isValid) {
      return res.status(400).json({ 
        message: `Document size (${Math.round(sizeValidation.size/1024)}KB) exceeds limit (${Math.round(sizeValidation.maxSize/1024)}KB). Please reduce the number of images or use smaller images.` 
      });
    }

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
  ])
], async (req, res) => {
  try {
    const { eventId } = req.params;
    const db = admin.firestore();



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
        // Compress and convert new thumbnail to base64
        const thumbnailUrl = await bufferToBase64Compressed(req.files.thumbnail[0].buffer, req.files.thumbnail[0].mimetype);
        updateData.thumbnail = thumbnailUrl;
      } catch (uploadError) {
        console.error('Thumbnail compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process thumbnail' });
      }
    } else if (req.body.thumbnailUrl && req.body.thumbnailUrl.trim()) {
      // Use provided thumbnail URL
      updateData.thumbnail = req.body.thumbnailUrl.trim();
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
          // Compress and convert new image to base64
          const imageUrl = await bufferToBase64Compressed(req.files.images[i].buffer, req.files.images[i].mimetype);
          finalImages.push({
            id: `img-${Date.now()}-${i}`,
            src: imageUrl,
            alt: `${req.body.name || currentEvent.name} - Image ${finalImages.length + 1}`
          });
        }
      } catch (uploadError) {
        console.error('Images compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process images' });
      }
    }

    // Handle URL images
    if (req.body.imageUrls) {
      try {
        const urlImages = JSON.parse(req.body.imageUrls);
        console.log('Processing URL images:', urlImages.length);
        for (let i = 0; i < urlImages.length; i++) {
          finalImages.push({
            id: `url-img-${Date.now()}-${i}`,
            src: urlImages[i].url,
            alt: urlImages[i].alt || `${req.body.name || currentEvent.name} - Image ${finalImages.length + 1}`
          });
        }
      } catch (parseError) {
        console.error('Failed to parse image URLs:', parseError);
        return res.status(400).json({ message: 'Invalid image URLs data' });
      }
    }

    // Always update images if we have any (including URL-only images)
    if (finalImages.length > 0) {
      updateData.images = finalImages;
    }

    // Also handle the case where we want to clear all images (empty array)
    if (req.body.clearImages === 'true') {
      updateData.images = [];
    }

    // Validate document size before updating
    const updatedEventData = { ...currentEvent, ...updateData };
    const sizeValidation = validateDocumentSize(updatedEventData);
    if (!sizeValidation.isValid) {
      return res.status(400).json({ 
        message: `Document size (${Math.round(sizeValidation.size/1024)}KB) exceeds limit (${Math.round(sizeValidation.maxSize/1024)}KB). Please reduce the number of images or use smaller images.` 
      });
    }

    // Check if we have any data to update
    if (Object.keys(updateData).length <= 2) { // Only has updatedAt and updatedBy
      return res.status(400).json({ message: 'No data provided for update' });
    }

    await eventRef.update(updateData);

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

    // Hard delete - completely remove the document
    await eventRef.delete();

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
        // Compress and convert new image to base64
        const imageUrl = await bufferToBase64Compressed(req.file.buffer, req.file.mimetype);
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('Image compression error:', uploadError);
        return res.status(500).json({ message: 'Failed to process image' });
      }
    }

    // Validate document size before updating
    const updatedYearData = { ...yearDoc.data(), ...updateData };
    const sizeValidation = validateDocumentSize(updatedYearData);
    if (!sizeValidation.isValid) {
      return res.status(400).json({ 
        message: `Document size (${Math.round(sizeValidation.size/1024)}KB) exceeds limit (${Math.round(sizeValidation.maxSize/1024)}KB). Please use a smaller image.` 
      });
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

    const yearData = yearDoc.data();
    const yearValue = yearData.year;

    // Check if there are any associated events for this year
    const eventsSnapshot = await db.collection('gallery_events')
      .where('year', '==', yearValue)
      .get();

    if (!eventsSnapshot.empty) {
      const eventCount = eventsSnapshot.size;
      return res.status(400).json({ 
        message: `Cannot delete year "${yearValue}" because it has ${eventCount} associated event(s). Please delete all events for this year first.`,
        eventCount: eventCount
      });
    }

    // Hard delete - completely remove the document
    await yearRef.delete();

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
// @desc    Get all active years for admin
// @access  Private (Editor)
router.get('/admin/years', [
  authenticateToken
], async (req, res) => {
  try {
    const db = admin.firestore();
    
    const yearsSnapshot = await db.collection('gallery_years')
      .where('isActive', '==', true)
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
// @desc    Get all active events for admin
// @access  Private (Editor)
router.get('/admin/events', [
  authenticateToken
], async (req, res) => {
  try {
    const { year } = req.query;
    const db = admin.firestore();
    
    let eventsQuery = db.collection('gallery_events')
      .where('isActive', '==', true);
    
    if (year) {
      eventsQuery = eventsQuery.where('year', '==', year);
    }
    
    try {
      const eventsSnapshot = await eventsQuery
        .orderBy('createdAt', 'desc')
        .get();

      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ events });
    } catch (indexError) {
      // Fallback: if compound index doesn't exist, filter client-side
      console.log('Compound index not available, using client-side filtering');
      const eventsSnapshot = await db.collection('gallery_events')
        .where('isActive', '==', true)
        .get();

      let events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by year if specified
      if (year) {
        events = events.filter(event => event.year === year);
      }

      // Sort by createdAt
      events.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bTime - aTime;
      });

      res.json({ events });
    }
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gallery/compress-existing
// @desc    Compress existing gallery data (admin only)
// @access  Private (Admin)
router.post('/compress-existing', [
  authenticateToken
], async (req, res) => {
  try {
    const db = admin.firestore();
    
    console.log('Starting compression of existing gallery data...');
    
    // Compress gallery events
    const eventsSnapshot = await db.collection('gallery_events').get();
    let eventsCompressed = 0;
    let eventsProcessed = 0;
    
    for (const doc of eventsSnapshot.docs) {
      const eventData = doc.data();
      const originalSize = estimateDocumentSize(eventData);
      
      let needsUpdate = false;
      const updatedData = { ...eventData };
      
      // Compress thumbnail
      if (eventData.thumbnail && eventData.thumbnail.startsWith('data:image/')) {
        try {
          const base64Data = eventData.thumbnail.replace(/^data:image\/[a-z]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const compressedBuffer = await compressImage(buffer);
          updatedData.thumbnail = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
          needsUpdate = true;
        } catch (error) {
          console.error('Failed to compress thumbnail:', error);
        }
      }
      
      // Compress event images
      if (eventData.images && eventData.images.length > 0) {
        for (let i = 0; i < eventData.images.length; i++) {
          if (eventData.images[i].src && eventData.images[i].src.startsWith('data:image/')) {
            try {
              const base64Data = eventData.images[i].src.replace(/^data:image\/[a-z]+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const compressedBuffer = await compressImage(buffer);
              updatedData.images[i].src = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
              needsUpdate = true;
            } catch (error) {
              console.error('Failed to compress event image:', error);
            }
          }
        }
      }
      
      if (needsUpdate) {
        const newSize = estimateDocumentSize(updatedData);
        if (newSize <= 900000) { // Only update if size is acceptable
          await doc.ref.update(updatedData);
          eventsCompressed++;
        }
      }
      
      eventsProcessed++;
    }
    
    // Compress gallery years
    const yearsSnapshot = await db.collection('gallery_years').get();
    let yearsCompressed = 0;
    let yearsProcessed = 0;
    
    for (const doc of yearsSnapshot.docs) {
      const yearData = doc.data();
      let needsUpdate = false;
      const updatedData = { ...yearData };
      
      // Compress year image
      if (yearData.image && yearData.image.startsWith('data:image/')) {
        try {
          const base64Data = yearData.image.replace(/^data:image\/[a-z]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const compressedBuffer = await compressImage(buffer);
          updatedData.image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
          needsUpdate = true;
        } catch (error) {
          console.error('Failed to compress year image:', error);
        }
      }
      
      if (needsUpdate) {
        const newSize = estimateDocumentSize(updatedData);
        if (newSize <= 900000) { // Only update if size is acceptable
          await doc.ref.update(updatedData);
          yearsCompressed++;
        }
      }
      
      yearsProcessed++;
    }
    
    res.json({
      message: 'Compression completed successfully',
      summary: {
        events: {
          processed: eventsProcessed,
          compressed: eventsCompressed
        },
        years: {
          processed: yearsProcessed,
          compressed: yearsCompressed
        }
      }
    });
  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ message: 'Server error during compression' });
  }
});

module.exports = router; 