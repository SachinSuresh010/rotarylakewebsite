const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get home page content
router.get('/content', async (req, res) => {
  try {
    const homeDoc = await req.app.locals.db.collection('homepage').doc('content').get();
    
    if (!homeDoc.exists) {
      // Return default content if no custom content exists
      const defaultContent = {
        hero: {
          title: "Welcome to Rotary Lake",
          subtitle: "Service Above Self",
          description: "Join us in making a difference in our community and around the world.",
          images: [
            "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1280x853.jpg",
            "/assets/images/a7eac4de-03fe-4f44-893a-b80d7af1b098-1280x853.jpg",
            "/assets/images/817d1ab1-18a1-449b-84b3-4b353be3fbee-1280x853.jpg"
          ],
          isActive: true
        },
        services: {
          title: "Services",
          subtitle: "Rotary avenues of service",
          description: "Discover our various service initiatives and projects.",
          items: [
            {
              title: "Community Service",
              image: "/assets/images/whatsapp-image-2022-07-02-at-11.34.51-am-2-1256x942.jpg",
              description: "Serving our local community through various initiatives and projects.",
              link: "/services",
              isActive: true
            },
            {
              title: "Vocational Service",
              image: "/assets/images/01dfe298-3c1c-467e-84b5-c7f515c39563-1256x942.jpg",
              description: "Promoting vocational excellence and professional development.",
              link: "/services",
              isActive: true
            },
            {
              title: "International Service",
              image: "/assets/images/b6b2b5b2-89ec-42a7-b24e-39ae7aa74696-1024x576.jpg",
              description: "Building international understanding and cooperation.",
              link: "/services",
              isActive: true
            },
            {
              title: "Youth Service",
              image: "/assets/images/1063984c-9732-4052-ab2a-332df3f973c6-1600x721.jpg",
              description: "Empowering young people through leadership and service opportunities.",
              link: "/services",
              isActive: true
            },
            {
              title: "Club Service",
              image: "/assets/images/532bbc11-85c6-4296-8b42-b940726854b9-1256x707.jpg",
              description: "Strengthening our club through fellowship and effective administration.",
              link: "/gallery",
              isActive: true
            }
          ],
          isActive: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return res.json(defaultContent);
    }

    res.json(homeDoc.data());
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ message: 'Error fetching home content' });
  }
});

// Update hero section
router.put('/hero', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, subtitle, description, images, isActive } = req.body;
    
    const heroData = {
      title: title || "Welcome to Rotary Lake",
      subtitle: subtitle || "Service Above Self",
      description: description || "Join us in making a difference in our community and around the world.",
      images: images || [],
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    await req.app.locals.db.collection('homepage').doc('content').set({
      hero: heroData,
      updatedAt: new Date()
    }, { merge: true });

    res.json({ message: 'Hero section updated successfully', hero: heroData });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ message: 'Error updating hero section' });
  }
});

// Update services section
router.put('/services', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, subtitle, description, items, isActive } = req.body;
    
    const servicesData = {
      title: title || "Services",
      subtitle: subtitle || "Rotary avenues of service",
      description: description || "Discover our various service initiatives and projects.",
      items: items || [],
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    await req.app.locals.db.collection('homepage').doc('content').set({
      services: servicesData,
      updatedAt: new Date()
    }, { merge: true });

    res.json({ message: 'Services section updated successfully', services: servicesData });
  } catch (error) {
    console.error('Error updating services section:', error);
    res.status(500).json({ message: 'Error updating services section' });
  }
});

// Helper function to convert buffer to base64 (for multer files)
const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Upload image for hero or services (using base64 instead of Firebase Storage)
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert image to base64 instead of uploading to Firebase Storage
    const imageUrl = bufferToBase64(req.file.buffer, req.file.mimetype);
    
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      fileName: `homepage/${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Delete image (for base64 images, this is just a placeholder since base64 images are stored in the content)
router.delete('/delete-image', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    // Since we're using base64, the image is stored in the content itself
    // This endpoint is kept for compatibility but doesn't actually delete anything
    // The image will be removed when the content is updated
    
    res.json({ message: 'Image deletion request received (base64 images are managed through content updates)' });
  } catch (error) {
    console.error('Error processing delete request:', error);
    res.status(500).json({ message: 'Error processing delete request' });
  }
});

// Reset to default content
router.post('/reset', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const defaultContent = {
      hero: {
        title: "Welcome to Rotary Lake",
        subtitle: "Service Above Self",
        description: "Join us in making a difference in our community and around the world.",
        images: [
          "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1280x853.jpg",
          "/assets/images/a7eac4de-03fe-4f44-893a-b80d7af1b098-1280x853.jpg",
          "/assets/images/817d1ab1-18a1-449b-84b3-4b353be3fbee-1280x853.jpg"
        ],
        isActive: true
      },
      services: {
        title: "Services",
        subtitle: "Rotary avenues of service",
        description: "Discover our various service initiatives and projects.",
        items: [
          {
            title: "Community Service",
            image: "/assets/images/whatsapp-image-2022-07-02-at-11.34.51-am-2-1256x942.jpg",
            description: "Serving our local community through various initiatives and projects.",
            link: "/services",
            isActive: true
          },
          {
            title: "Vocational Service",
            image: "/assets/images/01dfe298-3c1c-467e-84b5-c7f515c39563-1256x942.jpg",
            description: "Promoting vocational excellence and professional development.",
            link: "/services",
            isActive: true
          },
          {
            title: "International Service",
            image: "/assets/images/b6b2b5b2-89ec-42a7-b24e-39ae7aa74696-1024x576.jpg",
            description: "Building international understanding and cooperation.",
            link: "/services",
            isActive: true
          },
          {
            title: "Youth Service",
            image: "/assets/images/1063984c-9732-4052-ab2a-332df3f973c6-1600x721.jpg",
            description: "Empowering young people through leadership and service opportunities.",
            link: "/services",
            isActive: true
          },
          {
            title: "Club Service",
            image: "/assets/images/532bbc11-85c6-4296-8b42-b940726854b9-1256x707.jpg",
            description: "Strengthening our club through fellowship and effective administration.",
            link: "/gallery",
            isActive: true
          }
        ],
        isActive: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await req.app.locals.db.collection('homepage').doc('content').set(defaultContent);

    res.json({ message: 'Content reset to default successfully', content: defaultContent });
  } catch (error) {
    console.error('Error resetting content:', error);
    res.status(500).json({ message: 'Error resetting content' });
  }
});

// Update entire home page content
router.put('/content', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { hero, services } = req.body;
    
    const contentData = {
      hero: hero || {},
      services: services || {},
      updatedAt: new Date()
    };

    await req.app.locals.db.collection('homepage').doc('content').set(contentData);

    res.json({ message: 'Home page content updated successfully', content: contentData });
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({ message: 'Error updating home content' });
  }
});

module.exports = router; 