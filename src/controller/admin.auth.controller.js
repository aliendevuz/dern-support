const bcrypt = require("bcrypt");
const AdminRefreshToken = require("../models/AdminRefreshToken");
const Admin = require("../models/Admin");
const { NODE_ENV } = require("../config/env");
const {
  generateAdminRefreshToken,
  generateAdminReadAccessToken,
  generateAdminWriteAccessToken,
  generateAdminSuperAccessToken,
  verifyAdminRefreshToken,
} = require("../utils/jwt");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ error: "Admin not found!" });
    }

    // Parolni tekshiramiz
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(403).json({ error: "Invalid password!" });
    }

    // Refresh token generatsiyasi
    const refreshToken = await generateAdminRefreshToken(admin);

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production", // production muhitda true qiling
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
    });

    // Frontendga redirect yo‘llash
    return res.status(200).json({ redirect: "/admin/" });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const clearCookies = (res) => {
  res.clearCookie("adminRefreshToken");
  res.clearCookie("adminReadAccessToken");
  res.clearCookie("adminWriteAccessToken");
  res.clearCookie("adminSuperAccessToken");
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.adminRefreshToken;
    if (token) {
      await AdminRefreshToken.deleteOne({ token });
      clearCookies(res);
    }
    return res.status(200).send({ redirect: "/admin/" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

const refreshRead = async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const accessToken = generateAdminReadAccessToken(admin);
  res.cookie("adminReadAccessToken", accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 5 * 60 * 1000,
  });
  return res.status(200).send("Success!");
};

const refreshWrite = async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const newAdmin = await Admin.findOne({ _id: admin._id });
  const isValidPinCode = bcrypt.compareSync(req.pinCode, newAdmin.pinCode);

  if (!isValidPinCode) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const accessToken = generateAdminWriteAccessToken(admin);
  res.cookie("adminWriteAccessToken", accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 2 * 60 * 1000,
  });
  return res.status(200).send("Success!");
};

const refreshSuper = async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin) {
    clearCookies(res);
    return res.sendStatus(403);
  }

  const newAdmin = await Admin.findOne({ _id: admin.id });
  const isValidPassword = bcrypt.compareSync(req.password, newAdmin.password);

  if (!isValidPassword) {
    clearCookies(res);
    return res.sendStatus(403);
  }
  
  const accessToken = generateAdminSuperAccessToken(admin);
  res.cookie("adminSuperAccessToken", accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 1 * 60 * 1000,
  });
  return res.status(200).send("Success!");
};

module.exports = {
  login,
  logout,
  refreshRead,
  refreshWrite,
  refreshSuper,
};
