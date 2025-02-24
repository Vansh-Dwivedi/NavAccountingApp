const express = require('express');
const router = express.Router();
const { getGoogleReviewsScraper } = require('../controllers/googleReviews');

router.get('/google-reviews', getGoogleReviewsScraper);

module.exports = router;
