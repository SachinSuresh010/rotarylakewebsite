# Local Development Setup

This guide explains how to run the Rotary Lake Website locally with the backend on port 5001.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project configured

## Quick Start

### Option 1: Using the Start Script (Recommended)

1. **Run the start script:**
   ```bash
   ./start-local.sh
   ```

This script will:
- Create the necessary `.env` files
- Start the backend server on port 5001
- Start the frontend server on port 3000
- Handle cleanup when you stop the servers

### Option 2: Manual Setup

1. **Configure Environment Files:**

   **Frontend (.env in root directory):**
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
   ```

   **Backend (firebase/.env):**
   ```bash
   # Copy the example file
   cp firebase/env.example firebase/.env
   
   # Edit the file to set your Firebase configuration
   # Make sure PORT=5001 is set
   ```

2. **Start the Backend:**
   ```bash
   cd firebase
   npm install
   npm start
   ```
   The backend will start on `http://localhost:5001`

3. **Start the Frontend (in a new terminal):**
   ```bash
   npm install
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## Configuration

### Backend Configuration (firebase/.env)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Default Credentials
ADMIN_EMAIL=admin@rotarylake.com
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin

# Access Keys for Member Setup
ACCESS_KEYS=ROTARY2024,LAKESIDE2024,COCHIN2024
```

### Frontend Configuration (.env in root directory)

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health
- **Member Auth:** http://localhost:3000/member-auth

## Development Features

### Member Account Setup

When testing the member account setup feature locally:

1. Add a member through the admin dashboard
2. Use the access key `ROTARY2024` (or any key from your ACCESS_KEYS)
3. Visit http://localhost:3000/member-auth
4. Use the "Account Setup" tab to complete the member's account

### Admin Access

- **URL:** http://localhost:3000/admin
- **Email:** admin@rotarylake.com
- **Password:** admin123

## Troubleshooting

### Backend Issues

1. **Port 5001 already in use:**
   ```bash
   # Find the process using port 5001
   lsof -i :5001
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Firebase configuration issues:**
   - Ensure `serviceAccountKey.json` is in the `firebase/` directory
   - Verify Firebase project ID in `.env` file

### Frontend Issues

1. **API connection errors:**
   - Verify `REACT_APP_API_URL=http://localhost:5001/api` in `.env`
   - Ensure backend is running on port 5001
   - Check browser console for CORS errors

2. **Environment variables not loading:**
   - Restart the React development server
   - Ensure `.env` file is in the root directory

### Common Commands

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :5001

# Kill processes by port
kill -9 $(lsof -t -i:5001)
kill -9 $(lsof -t -i:3000)

# Restart development servers
# Stop current servers (Ctrl+C) and run:
./start-local.sh
```

## Production vs Development

- **Development:** Uses local backend on port 5001
- **Production:** Uses deployed backend URL (configured via environment variables)

The application automatically detects the environment and uses the appropriate API URL. 