const { verifyAdminRefreshToken, verifyAdminSuperAccessToken } = require("../utils/jwt");

const superAdminMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.adminRefreshToken;
  const accessToken = req.cookies.adminSuperAccessToken;

  const refresh =  verifyAdminRefreshToken(refreshToken);
  const access = verifyAdminSuperAccessToken(accessToken);
  
  if (!access || !refresh) {
    return res.status(403).send({ msg: "Unauthorized" });
  }
  
  req.admin = admin;
  next();
};

module.exports = superAdminMiddleware;
