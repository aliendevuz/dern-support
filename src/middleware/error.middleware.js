const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ message: "Ichki server xatosi!" })
};

module.exports = errorHandler;
