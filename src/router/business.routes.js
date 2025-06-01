const express = require('express');
const router = express.Router();
const {
    aboutMe,
    editProfile,
    refreshAccessToken,
    sendSupportRequest,
    getSupportRequests
} = require('../controller/business.controller');
const businessMiddleware = require('../middleware/business.middleware');

// post /about - about user
router.post('/about', businessMiddleware, aboutMe);

// post /edit-profile - edit user's profile
router.post('/edit-profile', businessMiddleware, editProfile);

// post /refresh-access-token - refresh access token
// post for restricted for refresh from browser
router.post('/refresh-access-token', businessMiddleware, refreshAccessToken);

// post /send_support_request - send support request
router.post('/send-support-request', businessMiddleware, sendSupportRequest);

// get /get-support-request - get support requests list
router.get('/get-support-requests', businessMiddleware, getSupportRequests);


module.exports = router;
