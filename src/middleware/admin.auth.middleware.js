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

module.exports = verifyAdmin;
