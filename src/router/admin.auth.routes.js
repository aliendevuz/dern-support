const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/admin.auth.middleware');
const { login, logout, refresh, addAdmin } = require('../controller/admin.auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', verifyAdmin, refresh);
router.post('/add-admin', addAdmin);

module.exports = router;
