const { verifyAdminRefreshToken, verifyAdminReadAccessToken } = require("../utils/jwt");

const technicianMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;
  const accessToken = req.cookies.adminReadAccessToken;

  const refresh =  verifyAdminRefreshToken(refreshToken);
  const access = verifyAdminReadAccessToken(accessToken);
  
  if (!access || !refresh) {
    return res.status(403).send({ msg: "Unauthorized" });
  }
  
  req.admin = access;
  next();
};

module.exports = technicianMiddleware;
