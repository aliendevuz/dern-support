const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const AdminRefreshToken = require('../models/AdminRefreshToken');
const { REFRESH_SECRET, ACCESS_SECRET, ADMIN_REFRESH_SECRET, ADMIN_ACCESS_SECRET } = require('../config/env');

async function generateRefreshToken(user) {
  const expiresIn = 30 * 24 * 60 * 60 * 1000; // 30 kun
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  // Token DB'ga saqlanadi
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + expiresIn)
  });

  return refreshToken;
}

async function generateAdminRefreshToken(admin) {
  const expiresIn = 7 * 24 * 60 * 60 * 1000;
  const refreshToken = jwt.sign(
    { id: admin._id, role: admin.role },
    ADMIN_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Token DB'ga saqlanadi
  await AdminRefreshToken.create({
    token: refreshToken,
    adminId: admin._id,
    expiresAt: new Date(Date.now() + expiresIn)
  });

  return refreshToken;
}

async function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    console.log(decoded);

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

async function verifyAdminRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, ADMIN_REFRESH_SECRET);
    console.log(decoded);

    const storedToken = await AdminRefreshToken.findOne({ token });
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

function generateAccessToken(user) {
    const accessToken = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        ACCESS_SECRET,
        { expiresIn: '5m' }
    );
    return accessToken;
}

function generateAdminAccessToken(admin) {
    const accessToken = jwt.sign(
        {
            id: admin.id,
            role: admin.role
        },
        ADMIN_ACCESS_SECRET,
        { expiresIn: '2m' }
    );
    return accessToken;
}

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  generateAdminRefreshToken,
  generateAdminAccessToken,
  verifyAdminRefreshToken
};
