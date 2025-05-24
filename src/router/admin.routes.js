const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(adminMiddleware, adminController);

module.exports = router;
