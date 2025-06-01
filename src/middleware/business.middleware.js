const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwt");

const businessMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;

  const refresh =  verifyRefreshToken(refreshToken);
  const access = verifyAccessToken(accessToken);
  
  if (!access || !refresh) {
    return res.status(403).send({ msg: "Unauthorized" });
  }
  
  req.user = access;
  next();
};

module.exports = businessMiddleware;
