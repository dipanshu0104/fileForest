const { UAParser } = require('ua-parser-js');

function getDeviceInfo(req) {
  const ip = req.ip || req.connection.remoteAddress;
  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();

  const deviceInfo = {
    ip,
    device: ua.device.model || 'Unknown Device',
    os: `${ua.os.name} ${ua.os.version}`,
    browser: `${ua.browser.name} ${ua.browser.version}`,
    time: new Date().toLocaleString(),
    requestedUrl: req.originalUrl,
    method: req.method,
  };

  return deviceInfo;
}

module.exports = getDeviceInfo;
