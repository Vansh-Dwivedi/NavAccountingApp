const express = require('express');
const router = express.Router();
const { getGoogleReviews } = require('../../controllers/googleReviews');

router.get('/', getGoogleReviews);

module.exports = router;
