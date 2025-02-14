const axios = require('axios');

const getGoogleReviews = async (req, res) => {
    try {
        const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
        const PLACE_ID = process.env.GOOGLE_PLACE_ID;

        if (!GOOGLE_API_KEY || !PLACE_ID) {
            console.error('Missing API key or Place ID');
            return res.status(500).json({ 
                error: 'Google API key or Place ID not configured' 
            });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`;
        
        console.log('Fetching reviews from Google Places API...');
        const response = await axios.get(url);
        
        if (response.data.result && response.data.result.reviews) {
            const reviews = response.data.result.reviews.map(review => ({
                name: review.author_name,
                initial: review.author_name.charAt(0).toUpperCase(),
                date: review.relative_time_description,
                rating: review.rating,
                content: review.text
            }));
            
            console.log(`Successfully fetched ${reviews.length} reviews`);
            res.json(reviews);
        } else {
            console.log('No reviews found in API response');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching Google reviews:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch Google reviews' });
    }
};

module.exports = {
    getGoogleReviews
};
