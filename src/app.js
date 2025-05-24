const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();


const NODE_ENV = require('./config/env');

if (NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const path = require('path');

app.use('/global.js', (req, res) => {
    const filePath = path.resolve(process.cwd(), 'public', 'global.js');
    res.sendFile(filePath);
});

app.use('/404.html', (req, res) => {
    const filePath = path.resolve(process.cwd(), 'public', '404.html');
    res.sendFile(filePath);
});

app.use('/404.css', (req, res) => {
    const filePath = path.resolve(process.cwd(), 'public', '404.css');
    res.sendFile(filePath);
});

app.use('/404.js', (req, res) => {
    const filePath = path.resolve(process.cwd(), 'public', '404.js');
    res.sendFile(filePath);
});


// const apiRoutes = require('./router/api.routes');
// const generalRoutes = require('./router/general.routes');
// const adminRoutes = require('./router/admin.routes');

// app.use('/api', apiRoutes);
// app.use('/admin', adminRoutes);
// app.use('/', generalRoutes);


// const errorHandler = require('./middleware/error.middleware');

// app.use(errorHandler);


module.exports = app;
