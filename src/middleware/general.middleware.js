const { verifyRefreshToken } = require("../utils/jwt");

const generalMiddleware = async (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/admin")) {
    return;
  }
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    req.role = "visitor";
    return next();
  }

  const user = await verifyRefreshToken(refreshToken);

  if (!user?.role) {
    req.role = "visitor";
    res.clearCookie("refreshToken");
    return next();
  }

  const userRoles = ["individual", "business"];
  req.role = userRoles.includes(user.role) ? user.role : "visitor";

  next();
};

module.exports = generalMiddleware;
