const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const { REFRESH_SECRET, ACCESS_SECRET } = require('../config/env');

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
    throw new Error('Invalid or expired refresh token');
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

module.exports = { generateRefreshToken, generateAccessToken, verifyRefreshToken };
