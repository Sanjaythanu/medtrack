const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, details = '') => {
  try {
    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.fullName : 'System / Guest';
    const userRole = req.user ? req.user.role : 'System';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    await ActivityLog.create({
      userId,
      userName,
      userRole,
      action,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error(`[Activity Logger Error]: ${error.message}`);
  }
};

module.exports = { logActivity };
