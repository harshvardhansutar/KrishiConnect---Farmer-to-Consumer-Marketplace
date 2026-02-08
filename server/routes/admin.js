const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify farmer
router.put('/farmers/:id/verify', adminAuth, async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.isVerified = true;
    await farmer.save();

    res.json({ message: 'Farmer verified', farmer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products (including unapproved)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('farmer', 'name farmName email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve product
router.put('/products/:id/approve', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isApproved = true;
    await product.save();

    res.json({ message: 'Product approved', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('consumer', 'name email phone')
      .populate('farmer', 'name farmName')
      .populate('items.product', 'name')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics dashboard
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const verifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: true });

    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ isApproved: true });
    const totalOrders = await Order.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        consumers: totalConsumers,
        verifiedFarmers
      },
      products: {
        total: totalProducts,
        approved: approvedProducts
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus
      },
      revenue: totalRevenue[0]?.total || 0,
      productsByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

