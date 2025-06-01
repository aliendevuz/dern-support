Admin.js
```
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  role: { type: String, enum: ['super-admin', 'manager', 'technician'], required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  pinCode:   { type: String, required: true },
  kpi: { // faqat technician uchun
    totalCompleted: { type: Number, default: 0 },
    avgCompletionTime: { type: Number, default: 0 }, // in minutes
  },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);

```

AdminRefreshToken.js
```
const mongoose = require("mongoose");

const adminRefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdminRefreshToken', adminRefreshTokenSchema);

```

Inventory.js
```
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: { type: String },
  quantity: { type: Number, default: 0 },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);

```

Knowledge.js
```
const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  similars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeArticle', default: [] }], // 3 ta o'xshash maqola ID'lari
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Knowledge', knowledgeSchema);
```

KnowledgeArticle.js
```
// KnowledgeArticle.js
const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  knowledge: { type: mongoose.Schema.Types.ObjectId, ref: 'Knowledge', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // markdown format
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);

```

RefreshToken.js
```
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);

```

Request.js
```
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['individual', 'business'], required: true },
  issueDescription: { type: String, required: true },
  preferredMethod: { type: String, enum: ['drop-off', 'courier', 'on-site'], required: true },
  status: { type: String, enum: ['pending', 'in-process', 'done'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // technician
  usedInventories: [{
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: { type: Number, default: 1 }
  }],
  priceQuote: { type: Number },
  submittedAt: { type: Date, default: Date.now },
  assignedAt: { type: Date },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Request', requestSchema);

```

User.js
```
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['individual', 'business'], required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  address:   { type: String, required: true },
  companyName:   { type: String },
  employeeCount: { type: String },
  password:  { type: String, required: true },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

```

