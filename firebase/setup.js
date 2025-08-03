const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const setupFirebase = async () => {
  try {
    // Initialize Firebase Admin
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    const db = admin.firestore();
  

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rotarylake.com';
    const usersRef = db.collection('users');
    const adminSnapshot = await usersRef.where('email', '==', adminEmail).limit(1).get();
    
    if (adminSnapshot.empty) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
      
      const adminUser = {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await usersRef.add(adminUser);
    } else {
      // Admin user already exists
    }

    // Import sample members from existing JSON data
    const fs = require('fs');
    const path = require('path');
    
    const membersJsonPath = path.join(__dirname, '../public/assets/data/members.json');
    
    if (fs.existsSync(membersJsonPath)) {
      const membersData = JSON.parse(fs.readFileSync(membersJsonPath, 'utf8'));
      
      let importedCount = 0;
      let skippedCount = 0;
      
      for (const memberData of membersData.members) {
        try {
          // Check if member already exists
          const existingMemberSnapshot = await db.collection('members')
            .where('email', '==', memberData.email)
            .limit(1)
            .get();
          
          if (existingMemberSnapshot.empty) {
            // Convert the JSON data to match our schema
            const member = {
              name: memberData.name,
              email: `${memberData.id}@rotarylake.com`, // Generate email from ID
              phone: memberData.phone || '',
              classification: memberData.profession || 'Member',
              classificationDetail: memberData.profession || '',
              sponsor: memberData.sponsor || '',
              joinDate: new Date('2020-01-01'),
              memberSince: '2020',
              currentDesignation: memberData.currentPosition || '',
              positions: memberData.currentPosition ? [{
                title: memberData.currentPosition,
                year: '2024-2025',
                isCurrent: true
              }] : [],
              isPastPresident: memberData.isPastPresident || false,
              pastPresidentYears: memberData.presidentialYears || [],
              profileImage: memberData.image || '',
              bio: memberData.bio || '',
              socialLinks: {},
              isActive: true,
              status: 'active',
              contactInfo: {},
              additionalInfo: memberData.hobbies || '',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            await db.collection('members').add(member);
            importedCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          console.error(`Error importing member ${memberData.name}:`, error.message);
        }
      }
      
          // Members imported successfully
  } else {
    // No members.json file found
  }
    
  } catch (error) {
    console.error('❌ Firebase setup failed:', error);
  } finally {
    process.exit(0);
  }
};

setupFirebase(); 