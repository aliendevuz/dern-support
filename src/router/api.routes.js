const express = require('express');
const router = express.Router();
const { random, similar, allKnowledge, detailsKnowledge } = require('../controller/api.controller');
const authRouter = require('./auth.routes');
const indidualRouter = require('./individual.routes');
const businessRouter = require('./business.routes');

router.use('/auth', authRouter);
router.use('/individual', indidualRouter);
router.use('/business', businessRouter);

// get /random - get random knowledge article
router.get('/random', random)

// get /similar - get similar knowledge article
router.get('/similar', similar);

// get /all-knowledge - get knowledges list
router.get('/all-knowledge', allKnowledge);

// get /details-knowledge - get full article
router.get('/details-knowledge', detailsKnowledge);

router.use((req, res) => {
    res.status(404).send({ message: "API not found!" });
})

module.exports = router;
