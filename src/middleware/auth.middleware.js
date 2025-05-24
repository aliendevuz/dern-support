const { verifyRefreshToken } = require("../utils/jwt");

const verifyUser = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("User not found 401");
    return res.sendStatus(401);
  }

  user = await verifyRefreshToken(refreshToken);

  if (!user?.role) {
    return res.sendStatus(403);
  } else {
    req.user = user;
    next();
  }
};

module.exports = verifyUser;
