const Alert = require('../models/Alert');
const { runAlertEngine } = require('../services/alertEngineService');

// @desc    Get all system alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    // Run alert engine on check to keep alerts fresh
    await runAlertEngine();

    const { status, severity, readStatus } = req.query;
    let query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (readStatus !== undefined) query.readStatus = readStatus === 'true';

    const alerts = await Alert.find(query)
      .populate('equipmentId', 'equipmentName assetId category department location')
      .sort({ generatedDate: -1 });

    const unreadCount = await Alert.countDocuments({ readStatus: false });

    res.status(200).json({
      success: true,
      unreadCount,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
const markAlertAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.readStatus = true;
    await alert.save();

    res.status(200).json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all alerts as read
// @route   PUT /api/alerts/read-all
// @access  Private
const markAllAlertsAsRead = async (req, res, next) => {
  try {
    await Alert.updateMany({ readStatus: false }, { readStatus: true });
    res.status(200).json({ success: true, message: 'All alerts marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
};
