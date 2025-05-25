const { verifyAdminRefreshToken } = require("../utils/jwt");

const verifyAdmin = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;

  if (!refreshToken) {
    console.log("Admin not found 401");
    return res.sendStatus(401);
  }

  admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin?.role) {
    return res.sendStatus(403);
  } else {
    req.admin = admin;
    next();
  }
};

const verifyAdminPinCode = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;

  if (!refreshToken) {
    console.log("Admin not found 401");
    return res.sendStatus(401);
  }

  admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin?.role) {
    return res.sendStatus(403);
  } else {
    if (req.body.pinCode) {
      req.pinCode = req.body.pinCode;
      req.admin = admin;
      next();
    } else {
      return res.sendStatus(403).send("Password not found");
    }
  }
};

const verifyAdminPassword = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;

  if (!refreshToken) {
    console.log("Admin not found 401");
    return res.sendStatus(401);
  }

  admin = await verifyAdminRefreshToken(refreshToken);

  if (!admin?.role) {
    return res.sendStatus(403);
  } else {
    if (req.body.password) {
      req.password = req.body.password;
      req.admin = admin;
      next();
    } else {
      return res.sendStatus(403).send("Password not found");
    }
  }
};

module.exports = { verifyAdmin, verifyAdminPinCode, verifyAdminPassword };
