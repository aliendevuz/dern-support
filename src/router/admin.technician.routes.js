const express = require('express');
const router = express.Router();
const {
    about,
    doneRequest,
    refreshAccessToken,
    allInventory,
    useInventories,
    myRequests
} = require('../controller/admin.technician.controller');

const adminTechnicianMiddleware = require('../middleware/admin.technician.middleware');

// Admin
// get /about - about admin's profile
router.get('/about', adminTechnicianMiddleware, about);

// post /done-request - done request
router.post('/done-request', adminTechnicianMiddleware, doneRequest);

// post /refresh-access-token - refresh access token
router.post('/refresh-access-token', adminTechnicianMiddleware, refreshAccessToken);

// get /all-inventory - get inventory list
router.get('/all-inventory', adminTechnicianMiddleware, allInventory);

// post /use-inventories - use inventories
router.post('/use-inventories', adminTechnicianMiddleware, useInventories);

// Request
// get /my-requests - get requests that assigned to technician
router.get('/my-requests', adminTechnicianMiddleware, myRequests);


module.exports = router;
