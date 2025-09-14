const Store = require('../models/Store');
const User = require('../models/User');
const { validateStore } = require('../utils/validation');

const storeController = {
    // Get all stores
    getAllStores: async (req, res) => {
        try {
            const stores = await Store.findAll();
            res.json({
                success: true,
                stores
            });
        } catch (error) {
            console.error('Get all stores error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch stores'
            });
        }
    },

    // Get stores for current user (with user's ratings)
    getStoresForUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const stores = await Store.findAllWithUserRatings(userId);
            res.json({
                success: true,
                stores
            });
        } catch (error) {
            console.error('Get stores for user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch stores'
            });
        }
    },

    // Get store by ID
    getStoreById: async (req, res) => {
        try {
            const { id } = req.params;
            const store = await Store.findById(id);
            
            if (!store) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            res.json({
                success: true,
                store
            });
        } catch (error) {
            console.error('Get store by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch store'
            });
        }
    },

    // Get stores owned by current user
    getMyStores: async (req, res) => {
        try {
            const ownerId = req.user.id;
            const stores = await Store.findByOwnerId(ownerId);
            res.json({
                success: true,
                stores
            });
        } catch (error) {
            console.error('Get my stores error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch your stores'
            });
        }
    },

    // Get single store owned by current user
    getMyStore: async (req, res) => {
        try {
            const ownerId = req.user.id;
            const stores = await Store.findByOwnerId(ownerId);
            
            if (stores.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No store found for this user'
                });
            }
            
            // Return the first store (assuming one store per owner)
            res.json({
                success: true,
                store: stores[0]
            });
        } catch (error) {
            console.error('Get my store error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch your store'
            });
        }
    },

    // Create new store
    createStore: async (req, res) => {
        try {
            const { error } = validateStore(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { name, email, address } = req.body;
            let ownerId = req.body.owner_id;

            // If not admin, set owner to current user
            if (req.user.role !== 'admin') {
                ownerId = req.user.id;
            }

            // Verify owner exists and is store_owner or admin
            const owner = await User.findById(ownerId);
            if (!owner) {
                return res.status(400).json({
                    success: false,
                    message: 'Store owner not found'
                });
            }

            if (owner.role !== 'store_owner' && owner.role !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Owner must be a store owner or admin'
                });
            }

            const store = await Store.create({
                name,
                email,
                address,
                owner_id: ownerId
            });

            res.status(201).json({
                success: true,
                message: 'Store created successfully',
                store
            });
        } catch (error) {
            console.error('Create store error:', error);
            if (error.code === '23505') { // Unique constraint violation
                return res.status(400).json({
                    success: false,
                    message: 'Store email already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to create store'
            });
        }
    },

    // Update store
    updateStore: async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = validateStore(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            // Check if store exists
            const existingStore = await Store.findById(id);
            if (!existingStore) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            // Check permissions
            if (req.user.role !== 'admin' && req.user.id !== existingStore.owner_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this store'
                });
            }

            const { name, email, address } = req.body;
            const store = await Store.update(id, { name, email, address });

            res.json({
                success: true,
                message: 'Store updated successfully',
                store
            });
        } catch (error) {
            console.error('Update store error:', error);
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'Store email already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to update store'
            });
        }
    },

    // Delete store
    deleteStore: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if store exists
            const existingStore = await Store.findById(id);
            if (!existingStore) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            // Check permissions (only admin or store owner can delete)
            if (req.user.role !== 'admin' && req.user.id !== existingStore.owner_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this store'
                });
            }

            await Store.delete(id);

            res.json({
                success: true,
                message: 'Store deleted successfully'
            });
        } catch (error) {
            console.error('Delete store error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete store'
            });
        }
    },

    // Search stores
    searchStores: async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const stores = await Store.search(q);
            res.json({
                success: true,
                stores
            });
        } catch (error) {
            console.error('Search stores error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search stores'
            });
        }
    }
};

module.exports = storeController;