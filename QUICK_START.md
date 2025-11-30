# 🚀 Quick Start Guide - Run Backend

## Step-by-Step to Run Backend

### Step 1: Open Terminal/PowerShell in Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 3: Create .env File

Create a file named `.env` in the `backend` folder with this content:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/attendance_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Or if using MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendance_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 4: Make Sure MongoDB is Running

**Option A: If MongoDB is installed locally**
```powershell
# Windows - Start MongoDB service
Start-Service MongoDB

# Or check if it's running
Get-Service MongoDB
```

**Option B: Use MongoDB Atlas (Free Cloud - Recommended)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster
4. Get connection string
5. Update MONGODB_URI in .env file

### Step 5: Run Backend Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📍 API endpoint: http://localhost:5000/api
```

### Step 6: Keep Backend Running

**Keep this terminal window open!** The backend must stay running for the frontend to work.

### Step 7: Open New Terminal for Frontend

Open a **NEW** terminal window and run:

```bash
cd frontend
npm install  # First time only
npm run dev
```

### Step 8: Test the Connection

1. Open browser: http://localhost:3000
2. Try to register or login
3. If you see errors, check:
   - Backend terminal shows "Server is running on port 5000"
   - MongoDB is connected (shows "✅ Connected to MongoDB")
   - Frontend is running on port 3000

## Common Issues

### Issue: "Registration failed" or "Cannot connect to backend"

**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check backend terminal shows "Server is running on port 5000"
3. Make sure MongoDB is connected
4. Check .env file exists in backend folder

### Issue: "MongoDB connection error"

**Solution:**
- Use MongoDB Atlas (cloud) - it's free and easier
- Or install MongoDB locally and start the service
- See MONGODB_SETUP.md for details

### Issue: Port 5000 already in use

**Solution:**
- Change PORT in .env file to another number (e.g., 5001)
- Update frontend/vite.config.js proxy target to match

## Complete Command List

```bash
# Terminal 1 - Backend
cd backend
npm install
# Create .env file manually
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

## Verify Everything Works

1. ✅ Backend running → See "Server is running on port 5000"
2. ✅ MongoDB connected → See "Connected to MongoDB successfully"
3. ✅ Frontend running → Open http://localhost:3000
4. ✅ Registration works → Create new account
5. ✅ Login works → Login with credentials

That's it! Your application is now running! 🎉

