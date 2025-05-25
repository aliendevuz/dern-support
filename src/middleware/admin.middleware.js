const { verifyAdminRefreshToken } = require("../utils/jwt");

const adminMiddleware = async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return;
  }
  const adminRefreshToken = req.cookies.adminRefreshToken;

  if (!adminRefreshToken) {
    req.role = "login";
    return next();
  }

  const admin = await verifyAdminRefreshToken(adminRefreshToken);

  if (!admin?.role) {
    req.role = "login";
    res.clearCookie("adminRefreshToken");
    return next();
  }

  const adminRoles = ["super-admin", "manager", "technician"];
  req.role = adminRoles.includes(admin.role) ? admin.role : "login";

  next();
};

module.exports = adminMiddleware;
