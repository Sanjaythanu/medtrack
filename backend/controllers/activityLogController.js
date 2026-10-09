const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin)
const getActivityLogs = async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const total = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityLogs };
