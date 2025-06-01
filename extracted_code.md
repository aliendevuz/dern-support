admin.api.routes.js
```
const express = require('express');
const router = express.Router();
const authRouter = require('./admin.auth.routes');
const superAdminRouter = require('./admin.super-admin.routes');
const managerRouter = require('./admin.manager.routes');
const technicianRouter = require('./admin.technician.routes');

router.use('/auth', authRouter);
router.use('/super-admin', superAdminRouter);
router.use('/manager', managerRouter);
router.use('/technician', technicianRouter);

router.use((req, res) => {
    res.status(404).send({ message: "API not found!" });
})

module.exports = router;

```

admin.auth.routes.js
```
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

```

admin.manager.routes.js
```
const express = require('express');
const router = express.Router();
const {
    about,
    assignRequest,
    refreshAccessToken,
    allInventory,
    addInventory,
    updateInventory,
    deleteInventory,
    myRequests
} = require('../controller/admin.manager.controller');

const adminManagerMiddleware = require('../middleware/admin.manager.middleware');

// Admin
// get /about - about admin's profile
router.get('/about', adminManagerMiddleware, about);

// post /assign-request - assign request to technician
router.post('/assign-request', adminManagerMiddleware, assignRequest);

// AdminRefreshToken
// post /refresh-access-token - refresh access token
router.post('/refresh-access-token', adminManagerMiddleware, refreshAccessToken);

// get /all-inventory - get inventory list
router.get('/all-inventory', adminManagerMiddleware, allInventory);

// post /add-inventory - add inventory
router.post('/add-inventory', adminManagerMiddleware, addInventory);

// post /update-inventory - update inventory
router.post('/update-inventory', adminManagerMiddleware, updateInventory);

// post /delete-inventory - delete inventory
router.post('/delete-inventory', adminManagerMiddleware, deleteInventory);

// Request
// get /my-requests - get requests that assigned to technician
router.get('/my-requests', adminManagerMiddleware, myRequests);


module.exports = router;

```

admin.routes.js
```
const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(adminMiddleware, adminController);

module.exports = router;

```

admin.super-admin.routes.js
```
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

```

admin.technician.routes.js
```
const express = require('express');
const router = express.Router();
const {
    about,
    doneRequest,
    refreshAccessToken,
    allInventory,
    useInventories,
    myRequests
} = require('../controller/admin.technician.controller');

const adminTechnicianMiddleware = require('../middleware/admin.technician.middleware');

// Admin
// get /about - about admin's profile
router.get('/about', adminTechnicianMiddleware, about);

// post /done-request - done request
router.post('/done-request', adminTechnicianMiddleware, doneRequest);

// post /refresh-access-token - refresh access token
router.post('/refresh-access-token', adminTechnicianMiddleware, refreshAccessToken);

// get /all-inventory - get inventory list
router.get('/all-inventory', adminTechnicianMiddleware, allInventory);

// post /use-inventories - use inventories
router.post('/use-inventories', adminTechnicianMiddleware, useInventories);

// Request
// get /my-requests - get requests that assigned to technician
router.get('/my-requests', adminTechnicianMiddleware, myRequests);


module.exports = router;

```

api.routes.js
```
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

```

auth.routes.js
```
const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth.middleware');
const { login, logout, refresh, register } = require('../controller/auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', verifyUser, refresh);
router.post('/register', register);

module.exports = router;

```

business.routes.js
```
const express = require('express');
const router = express.Router();
const {
    aboutMe,
    editProfile,
    refreshAccessToken,
    sendSupportRequest,
    getSupportRequests
} = require('../controller/business.controller');
const businessMiddleware = require('../middleware/business.middleware');

// post /about - about user
router.post('/about', businessMiddleware, aboutMe);

// post /edit-profile - edit user's profile
router.post('/edit-profile', businessMiddleware, editProfile);

// post /refresh-access-token - refresh access token
// post for restricted for refresh from browser
router.post('/refresh-access-token', businessMiddleware, refreshAccessToken);

// post /send_support_request - send support request
router.post('/send-support-request', businessMiddleware, sendSupportRequest);

// get /get-support-request - get support requests list
router.get('/get-support-requests', businessMiddleware, getSupportRequests);


module.exports = router;

```

general.routes.js
```
const express = require('express');
const router = express.Router();
const generalController = require('../controller/general.controller');
const generalMiddleware = require('../middleware/general.middleware');

router.use(generalMiddleware, generalController);

module.exports = router;

```

individual.routes.js
```
const express = require('express');
const router = express.Router();
const {
    aboutMe,
    editProfile,
    refreshAccessToken,
    sendSupportRequest,
    getSupportRequests
} = require('../controller/individual.controller');
const individualMiddleware = require('../middleware/individual.middleware');

// post /about - about user
router.post('/about', individualMiddleware, aboutMe);

// post /edit-profile - edit user's profile
router.post('/edit-profile', individualMiddleware, editProfile);

// post /refresh-access-token - refresh access token
// post for restricted for refresh from browser
router.post('/refresh-access-token', individualMiddleware, refreshAccessToken);

// post /send_support_request - send support request
router.post('/send-support-request', individualMiddleware, sendSupportRequest);

// get /get-support-request - get support requests list
router.get('/get-support-requests', individualMiddleware, getSupportRequests);


module.exports = router;

```

