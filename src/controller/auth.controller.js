const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const { REFRESH_SECRET } = require("../config/env");
const {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Email bo'yicha userni topamiz
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "User not found!" });
    }

    // Parolni tekshiramiz
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({ error: "Invalid password!" });
    }

    // Refresh token generatsiyasi
    const refreshToken = await generateRefreshToken(user);

    // Cookie orqali yuborish
    console.log("Login: ", refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // production muhitda true qiling
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
    });

    // Frontendga redirect yo‘llash
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
    }
    return res.status(200).send({ redirect: "/" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.sendStatus(403);
  }

  user = await verifyRefreshToken(refreshToken);

  if (!user) {
    console.log("User not found 403 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.sendStatus(403);
  }

  const accessToken = generateAccessToken(user);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 5 * 60 * 1000,
  });
  return res.status(200).send("Success!");
};

const register = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    email,
    phone,
    address,
    companyName,
    employeeCount,
    password,
    confirmPassword,
    termsAccept,
  } = req.body;

  // Input tekshiruvlar
  if (!termsAccept)
    return res
      .status(400)
      .json({ error: "Please accept terms and conditions" });
  if (password !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    // Avval email borligini tekshiramiz
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered" });

    // Parolni hash qilamiz
    const passwordHash = await bcrypt.hash(password, 12);

    // Yangi foydalanuvchini yaratamiz
    const newUser = new User({
      role,
      firstName,
      lastName,
      email,
      phone,
      address,
      companyName: role === "business" ? companyName : undefined,
      employeeCount: role === "business" ? employeeCount : undefined,
      password: passwordHash,
    });

    await newUser.save();

    // JWT Refresh Token yaratamiz
    const refreshToken = await generateRefreshToken(newUser);

    // Cookie orqali tokenni yuboramiz
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // productionda true qiling
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
    });

    // Frontendni redirect qilish uchun success qaytaramiz
    return res.status(201).json({ redirect: "/" });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  login,
  logout,
  refresh,
  register,
};
