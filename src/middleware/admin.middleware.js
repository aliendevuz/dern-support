const adminMiddleware = (req, res, next) => {
    res.status(403).send("Access Denied");
};

module.exports = adminMiddleware;
