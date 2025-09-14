const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All store routes require authentication
router.use(authMiddleware);

// Get all stores
router.get('/', storeController.getAllStores);

// Get stores for current user (with user's ratings)
router.get('/for-user', storeController.getStoresForUser);

// Get stores owned by current user
router.get('/my-stores', storeController.getMyStores);

// Get single store owned by current user
router.get('/my-store', storeController.getMyStore);

// Search stores
router.get('/search', storeController.searchStores);

// Get store by ID
router.get('/:id', storeController.getStoreById);

// Create new store
router.post('/', storeController.createStore);

// Update store
router.put('/:id', storeController.updateStore);

// Delete store
router.delete('/:id', storeController.deleteStore);

module.exports = router;