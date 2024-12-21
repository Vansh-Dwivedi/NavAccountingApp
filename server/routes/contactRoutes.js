const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');

// Validate contact form submission
const validateContactForm = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

// Contact form submission route
router.post('/submit', validateContactForm, contactController.submitContactForm);

module.exports = router;
