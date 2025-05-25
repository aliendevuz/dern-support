const express = require('express');
const router = express.Router();
const authRouter = require('./admin.auth.routes');
const superAdminRouter = require('./admin.super-admin.routes');

router.use('/auth', authRouter);
router.use('/super-admin', superAdminRouter);

router.use((req, res) => {
    res.status(404).send({ message: "API not found!" });
})

module.exports = router;
