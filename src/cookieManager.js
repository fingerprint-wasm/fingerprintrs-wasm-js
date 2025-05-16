const { v4: uuidv4 } = require('uuid');

function getOrCreateDeviceId(req, res) {
  let deviceId = req.cookies.deviceId;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie('deviceId', deviceId, { httpOnly: true });
    console.log(`Novo deviceId gerado: ${deviceId}`);
  }
  return deviceId;
}

module.exports = { getOrCreateDeviceId };
