const express = require('express');
const router = express.Router();
const {
    about,
    allAdmin,
    assignRequest,
    refreshAccessToken,
    allInventory,
    addInventory,
    updateInventory,
    deleteInventory,
    myRequests
} = require('../controller/admin.manager.controller');

const adminManagerMiddleware = require('../middleware/admin.manager.middleware');

// Admin
// get /about - about admin's profile
router.get('/about', adminManagerMiddleware, about);

// get /all-admin - get admins list
router.get('/all-admin', adminManagerMiddleware, allAdmin);

// post /assign-request - assign request to technician
router.post('/assign-request', adminManagerMiddleware, assignRequest);

// AdminRefreshToken
// post /refresh-access-token - refresh access token
router.post('/refresh-access-token', adminManagerMiddleware, refreshAccessToken);

// get /all-inventory - get inventory list
router.get('/all-inventory', adminManagerMiddleware, allInventory);

// post /add-inventory - add inventory
router.post('/add-inventory', adminManagerMiddleware, addInventory);

// post /update-inventory - update inventory
router.post('/update-inventory', adminManagerMiddleware, updateInventory);

// post /delete-inventory - delete inventory
router.post('/delete-inventory', adminManagerMiddleware, deleteInventory);

// Request
// get /my-requests - get requests that assigned to technician
router.get('/my-requests', adminManagerMiddleware, myRequests);


module.exports = router;
