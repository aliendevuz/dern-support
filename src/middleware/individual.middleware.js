const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config/env");

const individualMiddleware = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;

  if (!refreshToken) {
    res.clearCookie("accessToken");
  }
  
  if (!accessToken || !refreshToken) {
    return res.status(403).send({ msg: "Unauthorized" });
  }

  jwt.verify(accessToken, ACCESS_SECRET, (err, user) => {
    if (err || !user?.role) {
      return res.sendStatus(403);
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = individualMiddleware;
