const express = require('express');
const router = express.Router();
const hello = require('../controller/api.controller');
const authRouter = require('./auth.routes');
const indidualRouter = require('./individual.routes');

router.use('/auth', authRouter);
router.use('/individual', indidualRouter);
router.use('/hello', hello);

router.use((req, res) => {
    res.status(404).send({ message: "API not found!" });
})

module.exports = router;
