const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth.middleware');
const { login, logout, refresh, register } = require('../controller/auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', verifyUser, refresh);
router.post('/register', register);

module.exports = router;
