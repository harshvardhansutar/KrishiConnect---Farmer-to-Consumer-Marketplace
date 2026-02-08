# KrishiConnect - Farmer to Consumer Digital Marketplace

A modern, responsive web platform that directly connects farmers with consumers, eliminating middlemen and ensuring fair pricing for farmers and fresh produce for buyers.

## 🌾 Features

### For Farmers
- **Registration & Profile Management**: Easy registration with farm details
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage orders with status updates
- **Earnings Dashboard**: Track total earnings and order statistics
- **Verification System**: Get verified by admin for trust

### For Consumers
- **Browse Products**: Search and filter products by category, price, and location
- **Product Details**: View detailed product information with farmer details
- **Shopping Cart**: Add products to cart and checkout
- **Order Tracking**: Track order status from placement to delivery
- **Reviews & Ratings**: Rate and review products

### For Admins
- **User Management**: View and verify farmers
- **Product Approval**: Approve products before they go live
- **Order Monitoring**: Monitor all orders and transactions
- **Analytics Dashboard**: View sales, users, and demand insights

## 🚀 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling with agriculture-friendly theme

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "KrishiConnect - Website"
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/krishiconnect
   JWT_SECRET=your-secret-key-change-in-production
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

## 🎯 Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
KrishiConnect - Website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                  # Node.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware functions
│   └── index.js             # Server entry point
├── package.json
└── README.md
```

## 🔐 Default Admin Account

To create an admin account, you can either:
1. Register a new user and manually change the role to 'admin' in the database
2. Use MongoDB shell:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📱 Pages & Routes

### Public Pages
- `/` - Home page
- `/about` - About us
- `/contact` - Contact form
- `/products` - Browse products
- `/products/:id` - Product details
- `/login` - Login page
- `/register` - Registration page

### Protected Pages
- `/farmer/dashboard` - Farmer dashboard
- `/cart` - Shopping cart
- `/orders` - Order history
- `/admin/dashboard` - Admin dashboard

## 🎨 Design Features

- **Agriculture-friendly colors**: Green, white, and earthy tones
- **Fully responsive**: Works on mobile, tablet, and desktop
- **Indian rural-friendly**: Simple language, clear icons, minimal complexity
- **Modern UI**: Clean design with smooth animations

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all approved products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmer only)
- `PUT /api/products/:id` - Update product (farmer only)
- `DELETE /api/products/:id` - Delete product (farmer only)
- `POST /api/products/:id/ratings` - Add rating/review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Farmers
- `GET /api/farmers/profile` - Get farmer profile
- `PUT /api/farmers/profile` - Update farmer profile
- `GET /api/farmers/products` - Get farmer's products
- `GET /api/farmers/orders` - Get farmer's orders
- `GET /api/farmers/earnings` - Get farmer earnings

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/farmers/:id/verify` - Verify farmer
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/products/:id/approve` - Approve product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/analytics` - Get analytics

## 🚧 Future Enhancements

- [ ] Multi-language support (English, Hindi, Marathi)
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics with charts
- [ ] AI/ML integration for demand prediction
- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Image upload for products
- [ ] Advanced search with filters
- [ ] Wishlist functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👥 Support

For support, email info@krishiconnect.com or create an issue in the repository.

---

**Built with ❤️ for farmers and consumers**

