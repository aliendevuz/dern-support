const express = require('express');
const router = express.Router();
const generalController = require('../controller/general.controller');
const generalMiddleware = require('../middleware/general.middleware');

router.use(generalMiddleware, generalController);

module.exports = router;
