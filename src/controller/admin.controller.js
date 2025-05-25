const path = require('path');
const fs = require('fs').promises;

const adminController = async (req, res) => {
  const role = req.role || 'login';
  const baseDir = path.resolve(process.cwd(), 'public/admin', role);
  let reqPath = path.normalize('.' + req.path);
  let filePath = path.resolve(baseDir, reqPath);

  try {
    if (!filePath.startsWith(baseDir)) {
      return res.status(403).send('Access Denied');
    }

    let stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stats = await fs.stat(filePath);
    }

    if (stats.isFile()) {
      return res.sendFile(filePath);
    }

    return send404(res);
  } catch (err) {
    const fallbackPath = path.join(filePath, 'index.html');
    try {
      const stats = await fs.stat(fallbackPath);
      if (stats.isFile()) {
        return res.sendFile(fallbackPath);
      }
      return send404(res);
    } catch {
      return send404(res);
    }
  }
};

async function send404(res) {
  const fallback404 = path.resolve(process.cwd(), 'public/admin', '404.html');
  try {
    const stats = await fs.stat(fallback404);
    if (stats.isFile()) {
      return res.status(404).sendFile(fallback404);
    }
    return res.status(404).send('404: Not Found');
  } catch {
    return res.status(404).send('404: Not Found');
  }
}

module.exports = adminController;