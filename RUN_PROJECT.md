# Step-by-Step Guide to Run KrishiConnect

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ **Node.js** installed (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **MongoDB** installed and running - [Download here](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Step-by-Step Instructions

### **Step 1: Install Server Dependencies**

Open terminal/command prompt in the project root directory and run:

```bash
npm install
```

**Expected output:** Should install all server dependencies (express, mongoose, etc.)

---

### **Step 2: Install Client Dependencies**

Navigate to the client folder and install React dependencies:

```bash
cd client
npm install
cd ..
```

**Expected output:** Should install all React dependencies (react, react-router, etc.)

---

### **Step 3: Set Up MongoDB**

#### **Option A: Local MongoDB**

1. **Start MongoDB Service:**
   - **Windows:** MongoDB should start automatically as a service
   - **Mac/Linux:** Run `mongod` in terminal or start MongoDB service
   - **Verify:** MongoDB should be running on `mongodb://localhost:27017`

#### **Option B: MongoDB Atlas (Cloud - Recommended for beginners)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier is fine)
4. Create a database user
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/krishiconnect`)
6. Whitelist your IP address (or use 0.0.0.0/0 for all IPs - only for development)

---

### **Step 4: Create Environment Variables File**

1. In the **root directory** of the project, create a file named `.env`
2. Add the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishiconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For MongoDB Atlas, replace MONGODB_URI with:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krishiconnect?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your actual MongoDB Atlas credentials.

---

### **Step 5: Start MongoDB (If using local MongoDB)**

Make sure MongoDB is running:

**Windows:**
- Check Services (services.msc) - MongoDB should be running
- Or open Command Prompt as Administrator and run: `net start MongoDB`

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

**Verify MongoDB is running:**
- You should see MongoDB listening on port 27017
- Or test connection: `mongosh` (should connect successfully)

---

### **Step 6: Run the Application**

From the **root directory**, run:

```bash
npm run dev
```

This command will:
- Start the backend server on port **5000**
- Start the React frontend on port **3000**

**Expected output:**
```
Server running on port 5000
MongoDB Connected
Compiled successfully!
```

---

### **Step 7: Access the Application**

Open your web browser and go to:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

You should see the KrishiConnect homepage! 🎉

---

## 🔧 Alternative: Run Server and Client Separately

If you prefer to run them in separate terminals:

### **Terminal 1 - Backend Server:**
```bash
npm run server
```

### **Terminal 2 - Frontend Client:**
```bash
npm run client
```

---

## ✅ Verify Everything is Working

1. **Check Backend:**
   - Open http://localhost:5000/api/products
   - Should return an empty array `[]` (no products yet)

2. **Check Frontend:**
   - Open http://localhost:3000
   - Should see the KrishiConnect homepage

3. **Test Registration:**
   - Click "Sign Up" or go to http://localhost:3000/register
   - Register as a Farmer or Consumer
   - Should redirect to dashboard after registration

---

## 🐛 Troubleshooting

### **Error: MongoDB Connection Failed**

**Solution:**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env` file
- For Atlas: Check if IP is whitelisted and credentials are correct

### **Error: Port 5000 already in use**

**Solution:**
- Change `PORT=5000` to `PORT=5001` in `.env` file
- Or stop the process using port 5000

### **Error: Port 3000 already in use**

**Solution:**
- React will automatically ask to use a different port (like 3001)
- Or manually set: `PORT=3001` in `client/.env` (create if doesn't exist)

### **Error: Module not found**

**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### **Error: Cannot find module 'react-scripts'**

**Solution:**
```bash
cd client
npm install
```

---

## 📝 Next Steps After Running

1. **Create an Admin Account:**
   - Register a user normally
   - Then manually change role to 'admin' in MongoDB:
     ```javascript
     db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
     )
     ```

2. **Test the Application:**
   - Register as Farmer → Add products
   - Register as Consumer → Browse and order
   - Login as Admin → Verify farmers and approve products

---

## 🎯 Quick Command Reference

```bash
# Install all dependencies
npm install
cd client && npm install && cd ..

# Run both server and client
npm run dev

# Run only server
npm run server

# Run only client
npm run client

# Build for production
npm run build
```

---

## 📞 Need Help?

- Check the `README.md` for detailed documentation
- Check the `SETUP.md` for advanced setup
- Review server logs in terminal for errors
- Check browser console (F12) for frontend errors

---

**Happy Coding! 🌾**

