const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');
const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');
const { runAlertEngine } = require('../services/alertEngineService');

// @desc    Get comprehensive SaaS dashboard metrics, KPIs, aggregations, and widgets
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    // Run background status calculation & alert check
    await runAlertEngine();

    // 1. KPI Counts
    const totalEquipment = await Equipment.countDocuments();
    const healthyEquipment = await Equipment.countDocuments({ equipmentStatus: 'Healthy' });
    const dueSoonEquipment = await Equipment.countDocuments({ equipmentStatus: 'Due Soon' });
    const warrantyExpiringEquipment = await Equipment.countDocuments({ equipmentStatus: 'Warranty Expiring' });
    const overdueEquipment = await Equipment.countDocuments({ equipmentStatus: 'Maintenance Overdue' });
    const criticalEquipment = await Equipment.countDocuments({ equipmentStatus: 'Critical' });
    const underRepairEquipment = await Equipment.countDocuments({ equipmentStatus: 'Under Repair' });

    const totalTechnicians = await User.countDocuments({ role: 'Technician', isActive: true });
    const totalStaff = await User.countDocuments({ role: 'Staff', isActive: true });

    // Total Asset Value ($)
    const totalAssetValueAgg = await Equipment.aggregate([
      { $group: { _id: null, total: { $sum: '$purchaseCost' } } },
    ]);
    const totalAssetValue = totalAssetValueAgg.length > 0 ? totalAssetValueAgg[0].total : 0;

    // Maintenance Stats
    const totalMaintenanceTasks = await Maintenance.countDocuments();
    const pendingMaintenance = await Maintenance.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } });
    const completedMaintenance = await Maintenance.countDocuments({ status: 'Completed' });
    
    // Maintenance Completion Rate (%)
    const maintenanceCompletionRate = totalMaintenanceTasks > 0 ? Math.round((completedMaintenance / totalMaintenanceTasks) * 100) : 100;

    // Total & Average Repair Cost
    const totalMaintenanceCostAgg = await Maintenance.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$actualCost' }, avg: { $avg: '$actualCost' } } },
    ]);
    const totalMaintenanceCost = totalMaintenanceCostAgg.length > 0 ? totalMaintenanceCostAgg[0].total : 0;
    const averageRepairCost = totalMaintenanceCostAgg.length > 0 ? Math.round(totalMaintenanceCostAgg[0].avg) : 0;

    // Equipment Downtime (Count of Under Repair & Critical devices)
    const equipmentDowntime = underRepairEquipment + criticalEquipment;

    // 2. Top 5 Frequently Serviced Equipment
    const topServicedEquipmentAgg = await Maintenance.aggregate([
      { $group: { _id: '$equipmentId', maintenanceCount: { $sum: 1 }, totalCost: { $sum: '$actualCost' } } },
      { $sort: { maintenanceCount: -1 } },
      { $limit: 5 },
    ]);

    const topServicedEquipment = await Promise.all(
      topServicedEquipmentAgg.map(async (item) => {
        const eq = await Equipment.findById(item._id).select('equipmentName assetId category department location');
        return {
          equipment: eq,
          maintenanceCount: item.maintenanceCount,
          totalCost: item.totalCost,
        };
      })
    );

    // 3. Department Breakdown
    const departmentStats = await Equipment.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          totalValue: { $sum: '$purchaseCost' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 4. Equipment Categories Breakdown
    const categoryStats = await Equipment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // 5. Equipment Health Distribution
    const healthDistribution = {
      Healthy: healthyEquipment,
      'Due Soon': dueSoonEquipment,
      'Warranty Expiring': warrantyExpiringEquipment,
      'Maintenance Overdue': overdueEquipment,
      Critical: criticalEquipment,
      'Under Repair': underRepairEquipment,
    };

    // 6. Monthly Maintenance Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyMaintenanceTrend = await Maintenance.aggregate([
      { $match: { scheduledDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledDate' },
            month: { $month: '$scheduledDate' },
          },
          scheduled: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 7. Recent Lists & Widgets
    const recentEquipments = await Equipment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTechnician', 'fullName');

    const upcomingMaintenance = await Maintenance.find({ status: { $in: ['Scheduled', 'In Progress'] } })
      .sort({ scheduledDate: 1 })
      .limit(5)
      .populate('equipmentId', 'equipmentName assetId category location')
      .populate('technicianId', 'fullName email');

    const recentActivities = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(8);

    const recentLogins = await ActivityLog.find({ action: 'User Login' })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAlerts = await Alert.find({ status: 'Active' })
      .sort({ generatedDate: -1 })
      .limit(5)
      .populate('equipmentId', 'equipmentName assetId');

    res.status(200).json({
      success: true,
      stats: {
        totalEquipment,
        healthyEquipment,
        dueSoonEquipment,
        warrantyExpiringEquipment,
        overdueEquipment,
        criticalEquipment,
        underRepairEquipment,
        totalTechnicians,
        totalStaff,
        pendingMaintenance,
        completedMaintenance,
        totalMaintenanceCost,
        totalAssetValue,
        maintenanceCompletionRate,
        averageRepairCost,
        equipmentDowntime,
      },
      analytics: {
        departmentStats,
        categoryStats,
        healthDistribution,
        monthlyMaintenanceTrend,
        topServicedEquipment,
      },
      recentData: {
        recentEquipments,
        upcomingMaintenance,
        recentActivities,
        recentLogins,
        recentAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
