const { verifyAdminRefreshToken, verifyAdminReadAccessToken } = require("../utils/jwt");

const managerMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;
  const accessToken = req.cookies.verifyAdminReadAccessToken;

  const refresh =  verifyAdminRefreshToken(refreshToken);
  const access = verifyAdminReadAccessToken(accessToken);
  
  if (!access || !refresh) {
    return res.status(403).send({ msg: "Unauthorized" });
  }
  
  req.admin = admin;
  next();
};

module.exports = managerMiddleware;
