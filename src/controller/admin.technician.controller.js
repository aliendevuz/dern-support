const Admin = require('../models/Admin');
const Request = require('../models/Request');
const Inventory = require('../models/Inventory');
const bcrypt = require('bcrypt');

const aboutMe = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const admin = await Admin.findById(req.admin.id).select('email role _id firstName lastName kpi assignedTasks');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName,
      kpi: admin.kpi,
      assignedTasks: admin.assignedTasks,
    });
  } catch (err) {
    console.error('❌ aboutMe error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const addAdmin = async (req, res) => {
  const { role, firstName, lastName, email, password, pinCode } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const pinCodeHash = await bcrypt.hash(pinCode, 12);

    if (!['super-admin', 'manager', 'technician'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const newAdmin = new Admin({
      role,
      firstName,
      lastName,
      email,
      password: passwordHash,
      pinCode: pinCodeHash,
    });

    await newAdmin.save();

    return res.status(200).json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    console.error('❌ addAdmin error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const about = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const admin = await Admin.findById(req.admin.id).select('email role firstName lastName kpi assignedTasks');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (admin.role !== 'technician') {
      return res.status(403).json({ error: 'Access restricted to technicians' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
        kpi: admin.kpi,
        assignedTasks: admin.assignedTasks,
      },
    });
  } catch (err) {
    console.error('❌ about error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const doneRequest = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.assignedTo.toString() !== req.admin.id) {
      return res.status(403).json({ error: 'Request not assigned to this technician' });
    }

    const timeTaken = request.assignedAt
      ? (new Date() - new Date(request.assignedAt)) / (1000 * 60) // minutes
      : 0;

    request.status = 'done';
    request.completedAt = new Date();
    await request.save();

    const admin = await Admin.findById(req.admin.id);
    if (admin.role === 'technician') {
      admin.kpi.totalCompleted += 1;
      const totalTime = admin.kpi.avgCompletionTime * (admin.kpi.totalCompleted - 1);
      admin.kpi.avgCompletionTime = (totalTime + timeTaken) / admin.kpi.totalCompleted;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        status: request.status,
        completedAt: request.completedAt,
      },
    });
  } catch (err) {
    console.error('❌ doneRequest error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const refreshAccessToken = async (req, res) => {
  // Bu funksiya autentifikatsiya bilan ishlaydi, shuning uchun dummy sifatida qoldiramiz
  res.status(200).json({ success: true, message: 'Access token refreshed (dummy)' });
};

const allInventory = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const inventories = await Inventory.find().select('name partNumber quantity description updatedAt');

    res.status(200).json({
      success: true,
      data: inventories.map((inv) => ({
        id: inv._id,
        name: inv.name,
        partNumber: inv.partNumber,
        quantity: inv.quantity,
        description: inv.description,
        updatedAt: inv.updatedAt,
      })),
    });
  } catch (err) {
    console.error('❌ allInventory error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const useInventories = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { requestId, inventories } = req.body; // inventories: [{ inventoryId, quantity }]
    if (!requestId || !inventories || !Array.isArray(inventories)) {
      return res.status(400).json({ error: 'requestId and inventories array are required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.assignedTo.toString() !== req.admin.id) {
      return res.status(403).json({ error: 'Request not assigned to this technician' });
    }

    for (const item of inventories) {
      const { inventoryId, quantity } = item;
      if (!inventoryId || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid inventoryId or quantity' });
      }

      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        return res.status(404).json({ error: `Inventory ${inventoryId} not found` });
      }

      if (inventory.quantity < quantity) {
        return res.status(400).json({ error: `Insufficient quantity for ${inventory.name}` });
      }

      inventory.quantity -= quantity;
      inventory.updatedAt = new Date();
      await inventory.save();

      request.usedInventories.push({ inventory: inventoryId, quantity });
    }

    await request.save();

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        usedInventories: request.usedInventories,
      },
    });
  } catch (err) {
    console.error('❌ useInventories error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const myRequests = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const requests = await Request.find({ assignedTo: req.admin.id })
      .populate('user', 'firstName lastName email')
      .select('type issueDescription preferredMethod status submittedAt assignedAt completedAt usedInventories');

    res.status(200).json({
      success: true,
      data: requests.map((req) => ({
        id: req._id,
        user: {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        },
        type: req.type,
        issueDescription: req.issueDescription,
        preferredMethod: req.preferredMethod,
        status: req.status,
        submittedAt: req.submittedAt,
        assignedAt: req.assignedAt,
        completedAt: req.completedAt,
        usedInventories: req.usedInventories,
      })),
    });
  } catch (err) {
    console.error('❌ myRequests error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  about,
  doneRequest,
  refreshAccessToken,
  allInventory,
  useInventories,
  myRequests,
};