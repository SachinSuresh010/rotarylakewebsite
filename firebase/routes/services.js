const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');

// Get all services data
router.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.get();
    
    if (snapshot.empty) {
      // Return default services structure if no data exists
      const defaultServices = {
        services: [
          {
            id: "community-service",
            title: "Community Service",
            description: "Serving our local community through various initiatives and projects that address local needs.",
            icon: "🏘️",
            projects: []
          },
          {
            id: "vocational-service",
            title: "Vocational Service",
            description: "Promoting vocational excellence and professional development through mentorship and training programs.",
            icon: "💼",
            projects: []
          },
          {
            id: "international-service",
            title: "International Service",
            description: "Building international understanding and cooperation through global projects and partnerships.",
            icon: "🌍",
            projects: []
          },
          {
            id: "youth-service",
            title: "Youth Service",
            description: "Empowering young people through leadership development, scholarships, and service opportunities.",
            icon: "👨‍🎓",
            projects: []
          },
          {
            id: "club-service",
            title: "Club Service",
            description: "Strengthening our club through effective administration, fellowship, and member development.",
            icon: "🤝",
            projects: []
          }
        ]
      };
      
      return res.json(defaultServices);
    }
    
    // Check if data is in old format (single document with services array)
    const docs = snapshot.docs;
    let servicesData = { services: [] };
    
    if (docs.length === 1) {
      // Single document - check if it contains services array
      const docData = docs[0].data();
      if (docData.services && Array.isArray(docData.services)) {
        // Old format - single document with services array
        servicesData = docData;
      } else {
        // Single service document
        servicesData.services = [docData];
      }
    } else {
      // Multiple documents - each is a service
      servicesData.services = docs.map(doc => doc.data());
    }
    
    // Ensure we have all 5 Rotary service avenues
    const expectedServices = [
      {
        id: "community-service",
        title: "Community Service",
        description: "Serving our local community through various initiatives and projects that address local needs.",
        icon: "🏘️",
        projects: []
      },
      {
        id: "vocational-service",
        title: "Vocational Service",
        description: "Promoting vocational excellence and professional development through mentorship and training programs.",
        icon: "💼",
        projects: []
      },
      {
        id: "international-service",
        title: "International Service",
        description: "Building international understanding and cooperation through global projects and partnerships.",
        icon: "🌍",
        projects: []
      },
      {
        id: "youth-service",
        title: "Youth Service",
        description: "Empowering young people through leadership development, scholarships, and service opportunities.",
        icon: "👨‍🎓",
        projects: []
      },
      {
        id: "club-service",
        title: "Club Service",
        description: "Strengthening our club through effective administration, fellowship, and member development.",
        icon: "🤝",
        projects: []
      }
    ];
    
    // Merge existing data with expected services
    const mergedServices = expectedServices.map(expectedService => {
      const existingService = servicesData.services.find(s => s.id === expectedService.id);
      if (existingService) {
        return {
          ...expectedService,
          projects: existingService.projects || []
        };
      }
      return expectedService;
    });
    
    servicesData.services = mergedServices;
    

    res.json(servicesData);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services data' });
  }
});

// Update services data (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { services } = req.body;
    
    if (!services || !Array.isArray(services)) {
      return res.status(400).json({ message: 'Invalid services data' });
    }
    
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    
    // Update each service as a separate document
    for (const service of services) {
      await servicesRef.doc(service.id).set(service);
    }
    
    res.json({ message: 'Services updated successfully', services });
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ message: 'Failed to update services' });
  }
});

// Add a new project to a service
router.post('/projects', authenticateToken, async (req, res) => {
  try {
    const { serviceId, project } = req.body;
    
    if (!serviceId || !project) {
      return res.status(400).json({ message: 'Service ID and project data are required' });
    }
    
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    
    // Check if the service document exists
    const serviceDoc = servicesRef.doc(serviceId);
    const serviceSnapshot = await serviceDoc.get();
    
    let serviceData;
    if (!serviceSnapshot.exists) {
      // Create new service document with default structure
      const defaultServices = {
        community_service: {
          id: "community-service",
          title: "Community Service",
          description: "Serving our local community through various initiatives and projects that address local needs.",
          icon: "🏘️",
          projects: []
        },
        vocational_service: {
          id: "vocational-service",
          title: "Vocational Service",
          description: "Promoting vocational excellence and professional development through mentorship and training programs.",
          icon: "💼",
          projects: []
        },
        international_service: {
          id: "international-service",
          title: "International Service",
          description: "Building international understanding and cooperation through global projects and partnerships.",
          icon: "🌍",
          projects: []
        },
        youth_service: {
          id: "youth-service",
          title: "Youth Service",
          description: "Empowering young people through leadership development, scholarships, and service opportunities.",
          icon: "👨‍🎓",
          projects: []
        },
        club_service: {
          id: "club-service",
          title: "Club Service",
          description: "Strengthening our club through effective administration, fellowship, and member development.",
          icon: "🤝",
          projects: []
        }
      };
      
      serviceData = defaultServices[serviceId.replace('-', '_')] || {
        id: serviceId,
        title: serviceId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: "Service description",
        icon: "📋",
        projects: []
      };
    } else {
      serviceData = serviceSnapshot.data();
    }
    
    // Generate unique ID for the project
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newProject = {
      id: projectId,
      ...project
    };
    
    serviceData.projects.push(newProject);
    
    // Save to database
    await serviceDoc.set(serviceData);
    
    res.json({ message: 'Project added successfully', project: newProject });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: 'Failed to add project' });
  }
});

// Update a project
router.put('/projects/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { serviceId, project } = req.body;
    
    if (!serviceId || !project) {
      return res.status(400).json({ message: 'Service ID and project data are required' });
    }
    
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    const serviceDoc = servicesRef.doc(serviceId);
    const serviceSnapshot = await serviceDoc.get();
    
    if (!serviceSnapshot.exists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const serviceData = serviceSnapshot.data();
    
    // Find and update the project
    const projectIndex = serviceData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    serviceData.projects[projectIndex] = {
      id: projectId,
      ...project
    };
    
    // Save to database
    await serviceDoc.set(serviceData);
    
    res.json({ message: 'Project updated successfully', project: serviceData.projects[projectIndex] });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/projects/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { serviceId } = req.query;
    
    if (!serviceId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }
    
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    const serviceDoc = servicesRef.doc(serviceId);
    const serviceSnapshot = await serviceDoc.get();
    
    if (!serviceSnapshot.exists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const serviceData = serviceSnapshot.data();
    
    // Find and remove the project
    const projectIndex = serviceData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const deletedProject = serviceData.projects[projectIndex];
    serviceData.projects.splice(projectIndex, 1);
    
    // Save to database
    await serviceDoc.set(serviceData);
    
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Initialize services data in Firebase (one-time setup)
router.post('/init', async (req, res) => {
  try {
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    
    // Check if data already exists
    const snapshot = await servicesRef.get();
    if (!snapshot.empty) {
      return res.json({ message: 'Services data already exists in Firebase' });
    }
    
    // Initialize with the current static data - store each service as separate document
    const initialServices = [
      {
        id: "community-service",
        title: "Community Service",
        description: "Serving our local community through various initiatives and projects that address local needs.",
        icon: "🏘️",
        projects: [
          {
            id: "project-karuthal",
            title: "Project Karuthal",
            date: "July 02, 2022",
            description: "Breakfast with inmates of AGCM Karunalayam Old Age Home, Pazhoor",
            image: "/assets/images/whatsapp-image-2022-07-02-at-11.34.53-am-816x612.jpg",
            alt: "Project Karuthal"
          },
          {
            id: "go-green",
            title: "Go Green",
            date: "July 02, 2022",
            description: "Planting of Guava Tree by President K J Saju.",
            image: "/assets/images/whatsapp-image-2022-07-02-at-4.57.32-pm-816x1088.jpg",
            alt: "Go Green Project"
          },
          {
            id: "eye-screening-camp",
            title: "Eye Screening Camp",
            date: "August 11, 2022",
            description: "Eye Screening Camp for Students of Govt. LP School Maneed in association with Giridhar Eye Hospital.",
            image: "/assets/images/d3429051-ada3-4f15-a3b0-8131e831543a-816x368.jpg",
            alt: "Eye Screening Camp"
          },
          {
            id: "care-for-cancer-patient",
            title: "Care for Cancer Patient",
            date: "September 06, 2022",
            description: "Donated to Mr. Jayan who is suffering from cancer in the sinus",
            image: "/assets/images/852d22f1-0624-4b11-a456-fd0b96627c85-1156x521.jpg",
            alt: "Care for Cancer Patient"
          },
          {
            id: "herbal-garden-project",
            title: "Herbal Garden Project",
            date: "November 28, 2022",
            description: "Inaugurated the Herbal Garden Project at Maradu Mangayil School by DG Rtn. Rajmohan Nair",
            image: "/assets/images/e047cb98-342a-4490-9cf0-3e3443aa692c-960x1280.jpeg",
            alt: "Herbal Garden Project"
          },
          {
            id: "laptop-donation",
            title: "Laptop Donation",
            date: "January 27, 2023",
            description: "Donated a laptop to Azad Memorial LP School, Puthencruz",
            image: "/assets/images/5078cb9f-5f5a-4cdf-9f73-8b6e720e9ecb-1040x468.jpg",
            alt: "Laptop Donation"
          }
        ]
      },
      {
        id: "vocational-service",
        title: "Vocational Service",
        description: "Promoting vocational excellence and professional development through mentorship and training programs.",
        icon: "💼",
        projects: [
          {
            id: "showroom-inauguration",
            title: "Attended the Inauguration of Showroom",
            date: "Sept 1, 2022",
            description: "Our members visited and participate in the inauguration of Rtn Jayaram's venture.",
            image: "/assets/images/01dfe298-3f1c-467e-84b5-c7f515c39563-1256x942.jpg",
            alt: "Showroom Inauguration"
          },
          {
            id: "vocational-excellence-award",
            title: "Vocational Excellence Award",
            date: "Jan 13, 2023",
            description: "Vocational Excellence Award was given to cine star Rtn Saju Navodaya.",
            image: "/assets/images/f2974069-f63a-459e-a783-3b7f24dca3e1-1600x1052.jpg",
            alt: "Vocational Excellence Award"
          }
        ]
      },
      {
        id: "international-service",
        title: "International Service",
        description: "Building international understanding and cooperation through global projects and partnerships.",
        icon: "🌍",
        projects: [
          {
            id: "flag-exchange-bad-vibel",
            title: "Flag Exchange with Rotary Club of Bad Vibel, Germany",
            date: "Oct 25, 2022",
            description: "Our members Rtn Pauls Kalarickal and Rtn Iby Pauls visited the club in germany and exchanged flags.",
            image: "/assets/images/f0a27bca-7379-47f0-a44d-3cfad8f53995-816x1170.jpg",
            alt: "Flag Exchange with Rotary Club of Bad Vibel"
          },
          {
            id: "flag-exchange-budingen",
            title: "Flag Exchange with Rotary Club of Budingen Deitschland",
            date: "Nov 03, 2022",
            description: "Our members Rtn. Pauls Kalarickal and Rtn Iby Pauls visited the club in germany and had dinner with the members",
            image: "/assets/images/93d04cbd-1c9b-47a7-a3b2-70adad3b716b-794x1280.jpg",
            alt: "Flag Exchange with Rotary Club of Budingen"
          }
        ]
      },
      {
        id: "youth-service",
        title: "Youth Service",
        description: "Empowering young people through leadership development, scholarships, and service opportunities.",
        icon: "👨‍🎓",
        projects: [
          {
            id: "tring-a-smile",
            title: "Tring A Smile",
            date: "July 25, 2022",
            description: "Sponsored 10 cycles to 10 girl students from 3 different schools",
            image: "/assets/images/267373f1-3210-4b65-9d87-7a2b27c3b294-816x368.jpg",
            alt: "Tring A Smile"
          },
          {
            id: "madhuram-malayalam",
            title: "Madhuram Malayalam",
            date: "July 29, 2022",
            description: "Sponsored Madhuram Malayalam Project at Maneed Govt. Higher Secondary School in association with Helsa Electricals",
            image: "/assets/images/madhuram-malayalam-816x644.jpg",
            alt: "Madhuram Malayalam"
          },
          {
            id: "eye-screening-camp-youth",
            title: "Eye Screening Camp",
            date: "Aug 11, 2022",
            description: "Eye Screening Camp for 220 Students of Govt. LP School Maneed in association with Giridhar Eye Hospital.",
            image: "/assets/images/01866e23-e5c1-4e1e-a4fa-a3e0cebb9f06-816x1088.jpg",
            alt: "Eye Screening Camp for Youth"
          },
          {
            id: "laptop-donation-youth",
            title: "Laptop Donation",
            date: "Jan 27, 2023",
            description: "Donated a laptop to Azad Memorial LP School, Puthencruz",
            image: "/assets/images/5078cb9f-5f5a-4cdf-9f73-8b6e720e9ecb-1040x468.jpg",
            alt: "Laptop Donation for Youth"
          }
        ]
      },
      {
        id: "club-service",
        title: "Club Service",
        description: "Strengthening our club through effective administration, fellowship, and member development.",
        icon: "🤝",
        projects: [
          {
            id: "club-meeting",
            title: "Regular Club Meetings",
            date: "Every Thursday",
            description: "The club meets every Thursday 8 PM at Classik Fort Hotel, Maradu, Tripunithura",
            image: "/assets/images/background3.jpg",
            alt: "Club Meetings"
          },
          {
            id: "fellowship-events",
            title: "Fellowship Events",
            date: "Monthly",
            description: "Regular fellowship events to strengthen club bonds and member relationships",
            image: "/assets/images/817d1ab1-18a1-449b-84b3-4b353be3fbee-1280x853.jpg",
            alt: "Fellowship Events"
          }
        ]
      }
    ];
    
    // Store each service as a separate document
    for (const service of initialServices) {
      await servicesRef.doc(service.id).set(service);
    }
    

    
    res.json({ message: 'Services data initialized in Firebase', data: { services: initialServices } });
  } catch (error) {
    console.error('Error initializing services:', error);
    res.status(500).json({ message: 'Failed to initialize services data' });
  }
});

// Migration endpoint to move from single document to separate documents
router.post('/migrate', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.get();
    
    if (snapshot.empty) {
      return res.json({ message: 'No data to migrate' });
    }
    
    // Check if data is in old format (single document with services array)
    const oldDoc = snapshot.docs[0];
    const oldData = oldDoc.data();
    
    if (!oldData.services || !Array.isArray(oldData.services)) {
      return res.json({ message: 'Data is already in new format' });
    }
    
    // Migrate each service to separate document
    for (const service of oldData.services) {
      await servicesRef.doc(service.id).set(service);
    }
    
    // Delete the old document
    await oldDoc.ref.delete();
    
    res.json({ message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Error during migration:', error);
    res.status(500).json({ message: 'Failed to migrate data' });
  }
});

module.exports = router; 