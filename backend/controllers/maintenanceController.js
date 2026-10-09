const Maintenance = require('../models/Maintenance');
const Equipment = require('../models/Equipment');
const { calculateEquipmentStatus } = require('../services/statusCalculationService');
const { logActivity } = require('../utils/logger');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getMaintenance = async (req, res, next) => {
  try {
    const { status, priority, maintenanceType, technicianId, equipmentId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (maintenanceType) query.maintenanceType = maintenanceType;
    if (technicianId) query.technicianId = technicianId;
    if (equipmentId) query.equipmentId = equipmentId;

    // Technician role filtering: if technician, optionally show assigned
    if (req.user.role === 'Technician' && !req.query.all) {
      query.technicianId = req.user._id;
    }

    const records = await Maintenance.find(query)
      .populate('equipmentId', 'equipmentName assetId category department location model serialNumber')
      .populate('technicianId', 'fullName email phone employeeId')
      .sort({ scheduledDate: -1 });

    res.status(200).json({ success: true, count: records.length, maintenance: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single maintenance record by ID
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate('equipmentId')
      .populate('technicianId', 'fullName email phone department employeeId');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    res.status(200).json({ success: true, maintenance: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule new maintenance task
// @route   POST /api/maintenance
// @access  Private (Admin / Technician)
const createMaintenance = async (req, res, next) => {
  try {
    const {
      equipmentId,
      technicianId,
      maintenanceType,
      scheduledDate,
      priority,
      estimatedCost,
      notes,
    } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const maintenanceId = 'MNT-' + Date.now().toString().slice(-6);

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: `/uploads/${file.filename}`,
        });
      });
    }

    const maintenance = await Maintenance.create({
      maintenanceId,
      equipmentId,
      technicianId,
      maintenanceType: maintenanceType || 'Preventive',
      scheduledDate,
      priority: priority || 'Medium',
      estimatedCost: estimatedCost || 0,
      notes: notes || '',
      attachments,
    });

    // Update equipment status to Under Repair if Emergency or Immediate Action
    if (maintenanceType === 'Emergency') {
      equipment.equipmentStatus = 'Under Repair';
      await equipment.save();
    }

    await logActivity(req, 'Maintenance Scheduled', `Scheduled ${maintenanceType} maintenance for ${equipment.equipmentName} (${maintenanceId})`);

    res.status(201).json({ success: true, maintenance });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance record status, notes, costs, completion
// @route   PUT /api/maintenance/:id
// @access  Private (Admin / Technician)
const updateMaintenance = async (req, res, next) => {
  try {
    const { status, actualCost, notes, priority, completedDate } = req.body;

    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    if (status) record.status = status;
    if (actualCost !== undefined) record.actualCost = actualCost;
    if (notes) record.notes = notes;
    if (priority) record.priority = priority;

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        record.attachments.push({
          filename: file.originalname,
          path: `/uploads/${file.filename}`,
        });
      });
    }

    // If marked Completed
    if (status === 'Completed') {
      record.completedDate = completedDate || Date.now();

      const equipment = await Equipment.findById(record.equipmentId);
      if (equipment) {
        equipment.lastMaintenance = record.completedDate;
        
        // Recalculate next maintenance based on service interval
        const intervalDays = equipment.serviceInterval || 90;
        const nextDate = new Date(record.completedDate);
        nextDate.setDate(nextDate.getDate() + intervalDays);
        equipment.nextMaintenance = nextDate;

        equipment.equipmentStatus = calculateEquipmentStatus(equipment);
        await equipment.save();
      }
    }

    await record.save();

    await logActivity(req, 'Maintenance Updated', `Updated maintenance record ${record.maintenanceId} status to '${record.status}'`);

    res.status(200).json({ success: true, maintenance: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin)
const deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    await record.deleteOne();
    await logActivity(req, 'Maintenance Deleted', `Deleted maintenance log ${record.maintenanceId}`);

    res.status(200).json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
