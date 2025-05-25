const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    ADMIN_REFRESH_SECRET: process.env.ADMIN_REFRESH_SECRET,
    ADMIN_READ_ACCESS_SECRET: process.env.ADMIN_READ_ACCESS_SECRET,
    ADMIN_WRITE_ACCESS_SECRET: process.env.ADMIN_WRITE_ACCESS_SECRET,
    ADMIN_SUPER_ACCESS_SECRET: process.env.ADMIN_SUPER_ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
};
