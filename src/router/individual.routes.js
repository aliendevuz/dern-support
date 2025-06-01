const express = require('express');
const router = express.Router();
const {
    aboutMe,
    editProfile,
    sendSupportRequest,
    getSupportRequests
} = require('../controller/individual.controller');
const individualMiddleware = require('../middleware/individual.middleware');

// post /about - about user
router.post('/about', individualMiddleware, aboutMe);

// post /edit-profile - edit user's profile
router.post('/edit-profile', individualMiddleware, editProfile);

// post /send_support_request - send support request
router.post('/send-support-request', individualMiddleware, sendSupportRequest);

// get /get-support-request - get support requests list
router.get('/get-support-requests', individualMiddleware, getSupportRequests);


module.exports = router;
