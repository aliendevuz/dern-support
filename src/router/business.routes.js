const express = require('express');
const router = express.Router();
const {
    aboutMe,
    editProfile,
    sendSupportRequest,
    getSupportRequests
} = require('../controller/business.controller');
const businessMiddleware = require('../middleware/business.middleware');

// post /about - about user
router.post('/about', businessMiddleware, aboutMe);

// post /edit-profile - edit user's profile
router.post('/edit-profile', businessMiddleware, editProfile);

// post /send_support_request - send support request
router.post('/send-support-request', businessMiddleware, sendSupportRequest);

// get /get-support-request - get support requests list
router.get('/get-support-requests', businessMiddleware, getSupportRequests);


module.exports = router;
