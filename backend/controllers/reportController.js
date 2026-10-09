const Report = require('../models/Report');
const { generateReportData } = require('../services/reportGeneratorService');
const { logActivity } = require('../utils/logger');

// @desc    Get generated reports list
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({})
      .populate('generatedBy', 'fullName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a new report dynamically
// @route   POST /api/reports/generate
// @access  Private
const generateReport = async (req, res, next) => {
  try {
    const { reportName, reportType, filters } = req.body;

    const reportContent = await generateReportData(reportType, filters);

    const report = await Report.create({
      reportName: reportName || `${reportType} Summary Report`,
      reportType,
      generatedBy: req.user._id,
      filters: filters || {},
      summary: reportContent,
    });

    await logActivity(req, 'Report Generated', `Generated ${reportType} report: ${report.reportName}`);

    res.status(201).json({
      success: true,
      report,
      data: reportContent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  generateReport,
};
