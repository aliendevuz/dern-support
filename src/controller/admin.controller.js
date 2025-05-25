const path = require('path');
const fs = require('fs');

const adminController = (req, res) => {
    const role = req.role || "login";
    const baseDir = path.resolve(process.cwd(), 'public/admin', role);

    let reqPath = '.' + req.path;
    let filePath = path.resolve(baseDir, reqPath);

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        } else if (err) {
            const fallbackPath = path.join(filePath, 'index.html');
            return fs.stat(fallbackPath, (err2, stats2) => {
                if (!err2 && stats2.isFile()) {
                    return res.sendFile(fallbackPath);
                } else {
                    return send404(res);
                }
            });
        }

        if (!filePath.startsWith(baseDir)) {
            return res.status(403).send('Access Denied');
        }

        fs.stat(filePath, (err2, stats2) => {
            if (!err2 && stats2.isFile()) {
                return res.sendFile(filePath);
            } else {
                return send404(res);
            }
        });
    });
};

function send404(res) {
    const fallback404 = path.resolve(process.cwd(), 'public/admin', '404.html');
    fs.stat(fallback404, (err, stats) => {
        if (!err && stats.isFile()) {
            return res.status(404).sendFile(fallback404);
        } else {
            return res.status(404).send('404: Not Found');
        }
    });
}

module.exports = adminController;
