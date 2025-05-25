const express = require('express');
const router = express.Router();
const { addAdmin } = require('../controller/admin.super-admin.controller');
const adminSuperAdminMiddleware = require('../middleware/admin.super-admin.middleware');

router.post('/add-admin', adminSuperAdminMiddleware, addAdmin);

module.exports = router;
