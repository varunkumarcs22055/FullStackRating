const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All rating routes require authentication
router.use(authMiddleware);

// Get all ratings (admin only)
router.get('/', ratingController.getAllRatings);

// Get rating statistics (admin only)
router.get('/stats', ratingController.getRatingStats);

// Get ratings by current user
router.get('/my-ratings', ratingController.getMyRatings);

// Get ratings for stores owned by current user (store owner only)
router.get('/my-store-ratings', ratingController.getMyStoreRatings);

// Get ratings for specific store
router.get('/store/:storeId', ratingController.getStoreRatings);

// Submit or update rating
router.post('/', ratingController.submitRating);

// Delete rating
router.delete('/store/:storeId', ratingController.deleteRating);

module.exports = router;