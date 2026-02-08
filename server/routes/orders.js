const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    let totalAmount = 0;
    const orderItems = [];
    let farmerId = null;

    // Validate products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (!product.isAvailable || product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient quantity for ${product.name}` 
        });
      }

      if (!farmerId) {
        farmerId = product.farmer;
      } else if (farmerId.toString() !== product.farmer.toString()) {
        return res.status(400).json({ 
          message: 'All products must be from the same farmer' 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Update product quantity
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.isAvailable = false;
      }
      await product.save();
    }

    const order = new Order({
      consumer: req.user._id,
      farmer: farmerId,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || req.user.address,
      paymentMethod: paymentMethod || 'cash'
    });

    await order.save();
    await order.populate('items.product', 'name images');
    await order.populate('farmer', 'name farmName');

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate('farmer', 'name farmName farmLocation')
      .populate('items.product', 'name images')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumer', 'name email phone address')
      .populate('farmer', 'name farmName farmLocation phone')
      .populate('items.product', 'name images description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (order.consumer._id.toString() !== req.user._id.toString() && 
        order.farmer._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only farmer or admin can update status
    if (order.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = req.body.status;
    if (req.body.status === 'delivered') {
      order.deliveryDate = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

