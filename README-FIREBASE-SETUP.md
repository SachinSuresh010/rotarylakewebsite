# Firebase Integration Setup Guide

This guide will help you set up Firebase for your Rotary website with Firestore database and authentication.

## 🚀 Firebase Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `rotary-lake-website`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### 3. Enable Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 4. Get Service Account Key

1. Go to Project Settings (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file as `firebase/serviceAccountKey.json`

### 5. Configure Environment Variables

Create `firebase/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Default Credentials
ADMIN_EMAIL=admin@rotarylake.com
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

### 6. Install Dependencies

```bash
# Navigate to firebase directory
cd firebase

# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### 7. Initialize Database

```bash
# Run setup script
node setup.js
```

This will:
- Create default admin user
- Import existing member data
- Set up Firestore collections

## 🛠️ Development Setup

### Start Firebase Server

```bash
cd firebase
npm run dev
```

Server will run on: http://localhost:5000

### Start Frontend

```bash
# In another terminal
npm start
```

Frontend will run on: http://localhost:3000

### Access Admin Panel

- Go to: http://localhost:3000/admin
- Login with:
  - Email: admin@rotarylake.com
  - Password: admin123

## 🔐 Firebase Security Rules

### Firestore Rules

Go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Members collection (public read, authenticated write)
    match /members/{memberId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
    
    // Gallery collection
    match /gallery/{galleryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
  }
}
```

### Storage Rules

Go to Storage > Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🌐 Deployment Options

### Option 1: Firebase Hosting + Functions

1. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```

2. **Select services:**
   - Hosting
   - Functions
   - Firestore

3. **Deploy:**
   ```bash
   firebase deploy
   ```

### Option 2: Vercel

1. **Deploy Backend:**
   ```bash
   cd firebase
   vercel --prod
   ```

2. **Deploy Frontend:**
   ```bash
   vercel --prod
   ```

### Option 3: Railway

1. Connect GitHub repository
2. Railway will auto-detect and deploy
3. Set environment variables in Railway dashboard

## 🔧 Environment Variables for Production

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://your-frontend-url.com
```

## 📊 Firebase Features Used

### Firestore Database
- **Collections**: users, members, events, gallery
- **Real-time updates**: Automatic data synchronization
- **Offline support**: Works without internet
- **Scalable**: Handles millions of documents

### Authentication
- **Email/Password**: Secure user authentication
- **JWT Tokens**: Stateless authentication
- **Role-based Access**: Admin, Editor, Viewer roles

### Storage
- **File Uploads**: Profile images, gallery photos
- **CDN**: Fast global delivery
- **Security**: Protected file access

## 🚀 Firebase Advantages

### Free Tier Benefits
- **1GB Firestore storage**
- **50,000 reads/day**
- **20,000 writes/day**
- **10GB hosting storage**
- **10,000 users/month authentication**

### Scalability
- **Automatic scaling**: No server management
- **Global CDN**: Fast worldwide access
- **Real-time**: Live data updates
- **Offline**: Works without internet

### Security
- **Built-in security**: Firebase handles authentication
- **SSL by default**: All connections encrypted
- **Security rules**: Fine-grained access control

## 🔄 Migration from MongoDB

### Data Migration
1. Export data from MongoDB
2. Use Firebase setup script to import
3. Update API endpoints to use Firestore
4. Test all functionality

### Code Changes
- Replace MongoDB queries with Firestore queries
- Update authentication to use Firebase Auth
- Modify file uploads to use Firebase Storage

## 🐛 Troubleshooting

### Common Issues

1. **Service Account Key Error**
   - Ensure `serviceAccountKey.json` is in firebase directory
   - Check file permissions

2. **Firestore Permission Error**
   - Update Firestore security rules
   - Check authentication status

3. **CORS Errors**
   - Verify FRONTEND_URL in .env
   - Check Firebase project settings

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in .env
   - Verify admin user exists

### Debug Commands

```bash
# Check Firebase connection
cd firebase && node setup.js

# Test API endpoints
curl http://localhost:5000/api/health

# Check Firestore data
firebase firestore:get /users
```

## 📈 Monitoring & Analytics

### Firebase Console
- **Real-time database**: Monitor Firestore usage
- **Authentication**: Track user sign-ins
- **Performance**: Monitor app performance
- **Crashlytics**: Track app crashes

### Custom Analytics
- **User activity**: Track admin panel usage
- **Member statistics**: Monitor member growth
- **Performance metrics**: API response times

## 🔒 Security Best Practices

1. **Strong JWT Secret**: Use cryptographically strong secret
2. **Environment Variables**: Never commit secrets to Git
3. **Firestore Rules**: Implement proper access control
4. **HTTPS Only**: Use HTTPS in production
5. **Regular Backups**: Export data regularly
6. **Monitor Usage**: Track Firebase usage limits

## 🎉 Next Steps

After successful Firebase setup:

1. **Customize Admin Panel**: Add your branding
2. **Add More Features**: Events, gallery management
3. **Implement Notifications**: Firebase Cloud Messaging
4. **Add Analytics**: Google Analytics integration
5. **Mobile App**: React Native with Firebase
6. **SEO Optimization**: Meta tags and sitemap

---

**Happy Firebase Development! 🔥** 