const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminRefreshToken = require("../models/AdminRefreshToken");
const Admin = require("../models/Admin");
const { ADMIN_REFRESH_SECRET } = require("../config/env");
const {
  generateAdminRefreshToken,
  generateAdminAccessToken,
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
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(403).json({ error: "Invalid password!" });
    }

    // Refresh token generatsiyasi
    const refreshToken = await generateAdminRefreshToken(admin);

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // production muhitda true qiling
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

const logout = async (req, res) => {
  try {
    const token = req.cookies.adminRefreshToken;
    if (token) {
      await AdminRefreshToken.deleteOne({ token });
      res.clearCookie("adminRefreshToken");
      res.clearCookie("adminAccessToken");
    }
    return res.status(200).send({ redirect: "/admin/" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    res.clearCookie("adminRefreshToken");
    res.clearCookie("adminAccessToken");
    return res.sendStatus(403);
  }

  admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin) {
    console.log("Admin not found 403 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    res.clearCookie("adminRefreshToken");
    res.clearCookie("adminAccessToken");
    return res.sendStatus(403);
  }

  const accessToken = generateAdminAccessToken(admin);
  res.cookie("adminAccessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 2 * 60 * 1000,
  });
  return res.status(200).send("Success!");
};

const addAdmin = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    email,
    password
  } = req.body;

  try {
    // Avval email borligini tekshiramiz
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(409).json({ error: "Email already registered" });

    // Parolni hash qilamiz
    const passwordHash = await bcrypt.hash(password, 12);

    // Yangi foydalanuvchini yaratamiz
    const newAdmin = new Admin({
      role,
      firstName,
      lastName,
      email,
      passwordHash
    });

    await newAdmin.save();

    // Frontendni redirect qilish uchun success qaytaramiz
    return res.status(200).json({ message: "Success!"});
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  login,
  logout,
  refresh,
  addAdmin,
};
