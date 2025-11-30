# MongoDB Setup Guide

## Problem: MongoDB Connection Error

If you're seeing `ECONNREFUSED ::1:27017` or `MongoDB connection error`, it means MongoDB is not running on your computer.

## Solution Options

### Option 1: Install MongoDB Locally (Recommended for Development)

#### Windows:

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and install

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - MongoDB will start automatically

3. **Verify Installation:**
   ```bash
   # Open new terminal/PowerShell
   mongod --version
   ```

4. **Start MongoDB Service (if not running):**
   ```powershell
   # Option 1: Start via Services
   # Press Win + R, type: services.msc
   # Find "MongoDB" service and start it

   # Option 2: Start via Command (if installed as service)
   net start MongoDB
   ```

#### macOS:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: Use MongoDB Atlas (Free Cloud Database) - Easiest!

1. **Create Free Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (it's free!)

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose FREE (M0) tier
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (remember these!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File:**
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/attendance_db?retryWrites=true&w=majority
   ```
   - Replace `yourusername` with your database username
   - Replace `yourpassword` with your database password
   - Replace `cluster0.xxxxx` with your cluster address
   - Add database name before `?`: `/attendance_db?`

### Option 3: Use Docker (If you have Docker installed)

```bash
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Your connection string will be: mongodb://localhost:27017/attendance_db
```

## After Setup

1. **Create .env file** in `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/attendance_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

   Or if using MongoDB Atlas:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendance_db?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

## Verify MongoDB is Running

### Check Local MongoDB:
```bash
# Open MongoDB shell
mongosh

# Or check if service is running
# Windows:
sc query MongoDB

# Linux/macOS:
sudo systemctl status mongod
```

## Quick Fix for Windows

If MongoDB is installed but not starting:

```powershell
# 1. Check if MongoDB service exists
Get-Service | Where-Object {$_.Name -like "*mongo*"}

# 2. Start MongoDB service
Start-Service MongoDB

# 3. If service doesn't exist, start manually
mongod --dbpath "C:\data\db"
# (Create C:\data\db folder first if it doesn't exist)
```

## Need Help?

- MongoDB Installation: https://www.mongodb.com/docs/manual/installation/
- MongoDB Atlas Setup: https://www.mongodb.com/docs/atlas/getting-started/
- Connection String Format: https://www.mongodb.com/docs/manual/reference/connection-string/

