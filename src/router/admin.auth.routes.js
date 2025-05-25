const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyAdminPinCode, verifyAdminPassword } = require('../middleware/admin.auth.middleware');
const { login, logout, refreshRead, refreshWrite, refreshSuper } = require('../controller/admin.auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-read', verifyAdmin, refreshRead);
router.post('/refresh-write', verifyAdminPinCode, refreshWrite);
router.post('/refresh-super', verifyAdminPassword, refreshSuper);

module.exports = router;
