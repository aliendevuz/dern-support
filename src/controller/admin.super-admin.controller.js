const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const superAdminController = (req, res) => {
    res.status(200).send({ message: "Hello Super Admin!" });
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

const allAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select('email role _id');
    return res.status(200).json({ admins });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const about = async (req, res) => {
  res.status(200).send({ message: "API About!" });
};

const updateAdmin = async (req, res) => {
  res.status(200).send({ message: "API Update Admin!" });
};

const deleteAdmin = async (req, res) => {
  res.status(200).send({ message: "API Delete Admin!" });
};

const refreshAccessToken = async (req, res) => {
  res.status(200).send({ message: "API Refresh Access Token!" });
};

const allKnowledge = async (req, res) => {
  res.status(200).send({ message: "API All Knowledge!" });
};

const addKnowledge = async (req, res) => {
  res.status(200).send({ message: "API Add Knowledge!" });
};

const updateKnowledge = async (req, res) => {
  res.status(200).send({ message: "API Update Knowledge!" });
};

const deleteKnowledge = async (req, res) => {
  res.status(200).send({ message: "API Delete Knowledge!" });
};

const detailsKnowledge = async (req, res) => {
  res.status(200).send({ message: "API Details Knowledge!" });
};

const analytics = async (req, res) => {
  res.status(200).send({ message: "API Analytics!" });
};

const getKpi = async (req, res) => {
  res.status(200).send({ message: "API Get KPI!" });
};

module.exports = {
    aboutMe,
    superAdminController,
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
};
