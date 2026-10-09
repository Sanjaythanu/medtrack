const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

const generateReportData = async (reportType, filters = {}) => {
  let query = {};
  if (filters.department) query.department = filters.department;
  if (filters.category) query.category = filters.category;
  if (filters.status) query.equipmentStatus = filters.status;

  let reportContent = {};

  switch (reportType) {
    case 'Equipment': {
      const items = await Equipment.find(query).populate('assignedTechnician', 'fullName email');
      reportContent = {
        title: 'Complete Medical Equipment Inventory Report',
        totalItems: items.length,
        data: items,
      };
      break;
    }
    case 'Maintenance': {
      const maintQuery = {};
      if (filters.status) maintQuery.status = filters.status;
      if (filters.priority) maintQuery.priority = filters.priority;
      const items = await Maintenance.find(maintQuery)
        .populate('equipmentId', 'equipmentName assetId category department')
        .populate('technicianId', 'fullName email employeeId');
      reportContent = {
        title: 'Maintenance Operations & Service Log Report',
        totalItems: items.length,
        data: items,
      };
      break;
    }
    case 'Warranty': {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const items = await Equipment.find({
        warrantyExpiry: { $lte: thirtyDaysFromNow },
      });
      reportContent = {
        title: 'Expiring & Expired Warranty Medical Devices Report',
        totalItems: items.length,
        data: items,
      };
      break;
    }
    case 'CriticalEquipment': {
      const items = await Equipment.find({
        equipmentStatus: { $in: ['Critical', 'Maintenance Overdue'] },
      }).populate('assignedTechnician', 'fullName phone email');
      reportContent = {
        title: 'Critical & Overdue Maintenance Equipment Report',
        totalItems: items.length,
        data: items,
      };
      break;
    }
    case 'Cost': {
      const maintenanceRecords = await Maintenance.find({ status: 'Completed' }).populate(
        'equipmentId',
        'equipmentName assetId department'
      );
      const totalCost = maintenanceRecords.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
      reportContent = {
        title: 'Maintenance Expenses & Cost Analysis Report',
        totalRecords: maintenanceRecords.length,
        totalMaintenanceCost: totalCost,
        data: maintenanceRecords,
      };
      break;
    }
    case 'Technician': {
      const technicians = await User.find({ role: 'Technician' });
      const stats = await Promise.all(
        technicians.map(async (tech) => {
          const assignedEquip = await Equipment.countDocuments({ assignedTechnician: tech._id });
          const pendingMaint = await Maintenance.countDocuments({
            technicianId: tech._id,
            status: { $in: ['Scheduled', 'In Progress'] },
          });
          const completedMaint = await Maintenance.countDocuments({
            technicianId: tech._id,
            status: 'Completed',
          });
          return {
            technician: tech,
            assignedEquipmentCount: assignedEquip,
            pendingMaintenanceCount: pendingMaint,
            completedMaintenanceCount: completedMaint,
          };
        })
      );
      reportContent = {
        title: 'Bio-Medical Technician Workload & Performance Report',
        totalTechnicians: technicians.length,
        data: stats,
      };
      break;
    }
    case 'Department': {
      const deptStats = await Equipment.aggregate([
        {
          $group: {
            _id: '$department',
            totalEquipment: { $sum: 1 },
            totalValue: { $sum: '$purchaseCost' },
            healthyCount: {
              $sum: { $cond: [{ $eq: ['$equipmentStatus', 'Healthy'] }, 1, 0] },
            },
            criticalCount: {
              $sum: { $cond: [{ $in: ['$equipmentStatus', ['Critical', 'Maintenance Overdue']] }, 1, 0] },
            },
          },
        },
      ]);
      reportContent = {
        title: 'Hospital Department Equipment Assets Report',
        totalDepartments: deptStats.length,
        data: deptStats,
      };
      break;
    }
    default:
      reportContent = {
        title: 'General System Report',
        data: [],
      };
  }

  return reportContent;
};

module.exports = { generateReportData };
