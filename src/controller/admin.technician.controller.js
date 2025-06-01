const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const technicianController = (req, res) => {
    res.status(200).send({ message: "Hello Technician!" });
};

const aboutMe = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const admin = await Admin.findById(req.admin.id).select('email role _id');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });
  } catch (err) {
    console.error('❌ aboutMe error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const addAdmin = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    email,
    password,
    pinCode
  } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 12);
    const pinCodeHash = await bcrypt.hash(pinCode, 12);

    roles = ["super-admin", "manager", "technician"];

    if (!['super-admin', 'manager', 'technician'].includes(role)) res.status(400).json({ error: "Invalid role" });

    const newAdmin = new Admin({
      role,
      firstName,
      lastName,
      email,
      password: passwordHash,
      pinCode: pinCodeHash
    });

    await newAdmin.save();

    return res.status(200).json({ message: "Success!"});
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const about = (req, res) => {
    res.status(200).send({ message: "API About!" });
};

const doneRequest = (req, res) => {
    res.status(200).send({ message: "API Done Request!" });
};

const refreshAccessToken = (req, res) => {
    res.status(200).send({ message: "API Refresh Access Token!" });
};

const allInventory = (req, res) => {
    res.status(200).send({ message: "API All Inventory!" });
};

const useInventories = (req, res) => {
    res.status(200).send({ message: "API Use Inventories!" });
};

const myRequests = (req, res) => {
    res.status(200).send({ message: "API My Requests!" });
};

module.exports = {
    about,
    doneRequest,
    refreshAccessToken,
    allInventory,
    useInventories,
    myRequests
};
