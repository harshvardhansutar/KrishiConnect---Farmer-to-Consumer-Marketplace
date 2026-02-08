const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, farmerAuth } = require('../middleware/auth');

const router = express.Router();

// Get farmer profile
router.get('/profile', farmerAuth, async (req, res) => {
  try {
    const farmer = await User.findById(req.user._id).select('-password');
    res.json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update farmer profile
router.put('/profile', farmerAuth, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('farmName').optional().trim(),
  body('farmLocation').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const farmer = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's products
router.get('/products', farmerAuth, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's orders
router.get('/orders', farmerAuth, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('consumer', 'name email phone address')
      .populate('items.product', 'name images')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer earnings
router.get('/earnings', farmerAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 
      farmer: req.user._id,
      paymentStatus: 'paid'
    });

    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = await Order.countDocuments({ 
      farmer: req.user._id,
      status: { $in: ['pending', 'confirmed', 'processing'] }
    });

    res.json({
      totalEarnings,
      totalOrders,
      pendingOrders,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

