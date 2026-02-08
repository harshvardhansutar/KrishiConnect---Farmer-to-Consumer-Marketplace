const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Contact form submission
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // In a real application, you would save this to a database or send an email
    const { name, email, message, subject } = req.body;
    
    console.log('Contact form submission:', { name, email, subject, message });

    res.json({ 
      message: 'Thank you for contacting us! We will get back to you soon.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

