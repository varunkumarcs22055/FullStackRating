const Rating = require('../models/Rating');
const Store = require('../models/Store');
const { validateRating } = require('../utils/validation');

const ratingController = {
    // Get all ratings (admin only)
    getAllRatings: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const ratings = await Rating.findAll();
            res.json({
                success: true,
                ratings
            });
        } catch (error) {
            console.error('Get all ratings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch ratings'
            });
        }
    },

    // Get ratings for a specific store
    getStoreRatings: async (req, res) => {
        try {
            const { storeId } = req.params;

            // Verify store exists
            const store = await Store.findById(storeId);
            if (!store) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            const ratings = await Rating.findByStoreId(storeId);
            const stats = await Rating.getStoreStats(storeId);

            res.json({
                success: true,
                ratings,
                stats
            });
        } catch (error) {
            console.error('Get store ratings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch store ratings'
            });
        }
    },

    // Get ratings by current user
    getMyRatings: async (req, res) => {
        try {
            const userId = req.user.id;
            const ratings = await Rating.findByUserId(userId);
            res.json({
                success: true,
                ratings
            });
        } catch (error) {
            console.error('Get my ratings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch your ratings'
            });
        }
    },

    // Submit or update rating
    submitRating: async (req, res) => {
        try {
            const { error } = validateRating(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { store_id, rating } = req.body;
            const user_id = req.user.id;

            // Verify store exists
            const store = await Store.findById(store_id);
            if (!store) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            // Prevent store owners from rating their own stores
            if (store.owner_id === user_id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot rate your own store'
                });
            }

            const result = await Rating.createOrUpdate({
                user_id,
                store_id,
                rating
            });

            res.json({
                success: true,
                message: result.isUpdate ? 'Rating updated successfully' : 'Rating submitted successfully',
                rating: result.rating,
                isUpdate: result.isUpdate
            });
        } catch (error) {
            console.error('Submit rating error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit rating'
            });
        }
    },

    // Delete rating
    deleteRating: async (req, res) => {
        try {
            const { storeId } = req.params;
            const userId = req.user.id;

            const deletedRating = await Rating.delete(userId, storeId);
            
            if (!deletedRating) {
                return res.status(404).json({
                    success: false,
                    message: 'Rating not found'
                });
            }

            res.json({
                success: true,
                message: 'Rating deleted successfully'
            });
        } catch (error) {
            console.error('Delete rating error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete rating'
            });
        }
    },

    // Get rating statistics for admin dashboard
    getRatingStats: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const stats = await Rating.getSystemStats();
            res.json({
                success: true,
                stats
            });
        } catch (error) {
            console.error('Get rating stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch rating statistics'
            });
        }
    },

    // Get ratings for stores owned by current user (store owner)
    getMyStoreRatings: async (req, res) => {
        try {
            if (req.user.role !== 'store_owner') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Store owners only.'
                });
            }

            const ownerId = req.user.id;
            const stores = await Store.findByOwnerId(ownerId);
            
            const storeRatings = [];
            for (const store of stores) {
                const ratings = await Rating.findByStoreId(store.id);
                const stats = await Rating.getStoreStats(store.id);
                storeRatings.push({
                    store,
                    ratings,
                    stats
                });
            }

            res.json({
                success: true,
                storeRatings
            });
        } catch (error) {
            console.error('Get my store ratings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch store ratings'
            });
        }
    }
};

module.exports = ratingController;