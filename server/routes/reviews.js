const express = require('express');
const router = express.Router();
const axios = require('axios');
const { google } = require('google-auth-library');

// Cache mechanism
let reviewsCache = {
    data: null,
    lastFetched: null
};

const CACHE_DURATION = 1800000; // 30 minutes in milliseconds

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_PLACES_API_KEY; // Updated to match .env
const PLACE_ID = process.env.GOOGLE_PLACE_ID; // Your business Place ID

// Get Google Reviews
router.get('/google-reviews', async (req, res) => {
    try {
        console.log('Fetching Google Reviews...');
        
        // Check cache first
        if (reviewsCache.data && reviewsCache.lastFetched && 
            (Date.now() - reviewsCache.lastFetched) < CACHE_DURATION) {
            console.log('Returning cached reviews');
            return res.json({ success: true, reviews: reviewsCache.data });
        }

        const placeId = process.env.GOOGLE_PLACE_ID;
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;

        console.log('Environment variables:');
        console.log('GOOGLE_PLACE_ID:', placeId);
        console.log('GOOGLE_PLACES_API_KEY:', apiKey ? 'Present' : 'Missing');

        if (!placeId || !apiKey) {
            throw new Error('Missing required environment variables');
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
        console.log('Making request to Google Places API:', url.replace(apiKey, 'API_KEY_HIDDEN'));
        
        const response = await axios.get(url);
        console.log('Google Places API Response:', response.data);

        if (response.data.result && response.data.result.reviews) {
            const reviews = response.data.result.reviews.map(review => ({
                content: review.text,
                name: review.author_name,
                rating: review.rating,
                time: review.time,
                profileUrl: review.profile_photo_url,
                relativeTime: review.relative_time_description
            }));

            // Update cache
            reviewsCache = {
                data: reviews,
                lastFetched: Date.now()
            };
            
            console.log('Successfully fetched and processed reviews');
            res.json({ success: true, reviews });
        } else {
            console.log('No reviews found in API response:', response.data);
            res.status(404).json({ 
                success: false, 
                message: 'No reviews found',
                error: 'No reviews data in response' 
            });
        }
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching reviews',
            error: error.message,
            details: error.response?.data
        });
    }
});

module.exports = router;
