const express = require('express');
const router = express.Router();
const { aboutMe } = require('../controller/individual.controller');
const individualMiddleware = require('../middleware/individual.middleware');

router.post('/about', individualMiddleware, aboutMe);

module.exports = router;
