# Setup Guide for KrishiConnect

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishiconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Start MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your system
- Start MongoDB service
- Default connection: `mongodb://localhost:27017/krishiconnect`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Run the Application

**Development Mode (Recommended):**
```bash
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

**Or run separately:**

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run client
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Creating an Admin Account

### Method 1: Using MongoDB Shell

1. Start MongoDB shell:
```bash
mongosh
```

2. Switch to database:
```javascript
use krishiconnect
```

3. Update user role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `krishiconnect` database → `users` collection
4. Find your user document
5. Edit the `role` field to `"admin"`
6. Save the document

## Testing the Application

### 1. Register as Farmer
- Go to http://localhost:3000/register
- Select "Farmer" role
- Fill in the registration form
- Submit

### 2. Register as Consumer
- Go to http://localhost:3000/register
- Select "Consumer" role
- Fill in the registration form
- Submit

### 3. Login
- Go to http://localhost:3000/login
- Enter your credentials
- Access your dashboard

### 4. Test Admin Features
- Create an admin account (see above)
- Login as admin
- Access admin dashboard at http://localhost:3000/admin/dashboard

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity (for Atlas)

### Port Already in Use
- Change `PORT` in `.env` for server
- React app will prompt to use different port if 3000 is taken

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### CORS Errors
- Ensure backend is running on port 5000
- Check `proxy` setting in `client/package.json`

## Production Deployment

### 1. Build React App
```bash
cd client
npm run build
cd ..
```

### 2. Set Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret-key
```

### 3. Start Server
```bash
npm start
```

### 4. Serve Static Files (Optional)
The built React app is in `client/build`. You can:
- Serve it with Express static middleware
- Deploy to services like Vercel, Netlify, or AWS
- Use nginx or Apache

## Project Structure

```
KrishiConnect - Website/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── hooks/       # Custom hooks
│   └── package.json
├── server/              # Node.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Middleware
│   └── index.js
├── .env                 # Environment variables
├── package.json
└── README.md
```

## Next Steps

1. **Add Image Upload**: Implement file upload for product images
2. **Payment Integration**: Add payment gateway (Razorpay, Stripe)
3. **Email Service**: Send order confirmations and notifications
4. **SMS Service**: Send OTP and order updates
5. **Deploy**: Deploy to cloud platforms (Heroku, AWS, etc.)

## Support

For issues or questions:
- Check the README.md
- Review API documentation
- Check server logs for errors
- Verify database connections

Happy coding! 🌾

