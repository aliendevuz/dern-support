const express = require('express');
const router = express.Router();
const {
    addAdmin,
    allAdmin,
    about,
    updateAdmin,
    deleteAdmin,
    refreshAccessToken,
    allKnowledge,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    detailsKnowledge,
    analytics,
    getKpi
} = require('../controller/admin.super-admin.controller');
const adminSuperAdminMiddleware = require('../middleware/admin.super-admin.middleware');

// post /add-admin - add admin
router.post('/add-admin', adminSuperAdminMiddleware, addAdmin);

// get /all-admin - get admins list
router.get('/all-admin', adminSuperAdminMiddleware, allAdmin);

// get /about - about admin's profile
router.get('/about', adminSuperAdminMiddleware, about);

// post /update-admin - update admin
router.post('/update-admin', adminSuperAdminMiddleware, updateAdmin);

// post /delete-admin - delete admin
router.post('/delete-admin', adminSuperAdminMiddleware, deleteAdmin);

// AdminRefreshToken
// post /refresh-access-token - refresh access token
router.post('/refresh-access-token', adminSuperAdminMiddleware, refreshAccessToken);

// Knowledge
// get /all-knowledge - get knowledges list
router.get('/all-knowledge', adminSuperAdminMiddleware, allKnowledge);

// post /add-knowledge - add knowledge
router.post('/add-knowledge', adminSuperAdminMiddleware, addKnowledge);

// post /update-knowledge - update knowledge
router.post('/update-knowledge', adminSuperAdminMiddleware, updateKnowledge);

// post /delete-knowledge - delete knowledge
router.post('/delete-knowledge', adminSuperAdminMiddleware, deleteKnowledge);

// KnowledgeArticle
// get /details-knowledge - get full article
router.get('/details-knowledge', adminSuperAdminMiddleware, detailsKnowledge);

// get /analytics - get analytics
router.get('/analytics', adminSuperAdminMiddleware, analytics);

// get /get-kpi - get kpi
router.get('/get-kpi', adminSuperAdminMiddleware, getKpi);


module.exports = router;
