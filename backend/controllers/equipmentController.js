const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const { calculateEquipmentStatus } = require('../services/statusCalculationService');
const { logActivity } = require('../utils/logger');

// @desc    Get all medical equipment with search, filter, sort, pagination
// @route   GET /api/equipment
// @access  Private
const getEquipment = async (req, res, next) => {
  try {
    const {
      search,
      department,
      category,
      status,
      manufacturer,
      assignedTechnician,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (department) query.department = department;
    if (category) query.category = category;
    if (status) query.equipmentStatus = status;
    if (manufacturer) query.manufacturer = { $regex: manufacturer, $options: 'i' };
    if (assignedTechnician) query.assignedTechnician = assignedTechnician;

    if (search) {
      query.$or = [
        { equipmentName: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const total = await Equipment.countDocuments(query);
    const equipmentList = await Equipment.find(query)
      .populate('assignedTechnician', 'fullName email employeeId phone')
      .populate('createdBy', 'fullName email')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limitNum);

    // Calculate dynamically updated status for each returned item
    const itemsWithStatus = equipmentList.map((item) => {
      const computedStatus = calculateEquipmentStatus(item);
      const itemObj = item.toObject();
      if (item.equipmentStatus !== 'Under Repair' && item.equipmentStatus !== 'Retired') {
        itemObj.equipmentStatus = computedStatus;
      }
      return itemObj;
    });

    res.status(200).json({
      success: true,
      count: equipmentList.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      equipment: itemsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment by ID (Includes maintenance history)
// @route   GET /api/equipment/:id
// @access  Private
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('assignedTechnician', 'fullName email phone department employeeId')
      .populate('createdBy', 'fullName email');

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const maintenanceHistory = await Maintenance.find({ equipmentId: equipment._id })
      .populate('technicianId', 'fullName email')
      .sort({ scheduledDate: -1 });

    const computedStatus = calculateEquipmentStatus(equipment);
    const equipmentObj = equipment.toObject();
    if (equipment.equipmentStatus !== 'Under Repair' && equipment.equipmentStatus !== 'Retired') {
      equipmentObj.equipmentStatus = computedStatus;
    }

    res.status(200).json({
      success: true,
      equipment: equipmentObj,
      maintenanceHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medical equipment
// @route   POST /api/equipment
// @access  Private (Admin / Technician)
const createEquipment = async (req, res, next) => {
  try {
    const {
      assetId,
      equipmentName,
      category,
      department,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      installationDate,
      warrantyExpiry,
      vendorName,
      purchaseCost,
      serviceInterval,
      nextMaintenance,
      location,
      assignedTechnician,
      remarks,
    } = req.body;

    const existingAsset = await Equipment.findOne({ assetId: assetId.toUpperCase() });
    if (existingAsset) {
      return res.status(400).json({ success: false, message: `Equipment with Asset ID '${assetId}' already exists.` });
    }

    const existingSerial = await Equipment.findOne({ serialNumber });
    if (existingSerial) {
      return res.status(400).json({ success: false, message: `Equipment with Serial Number '${serialNumber}' already exists.` });
    }

    let equipmentImage = '';
    if (req.file) {
      equipmentImage = `/uploads/${req.file.filename}`;
    }

    const newEquipment = new Equipment({
      assetId: assetId.toUpperCase(),
      equipmentName,
      category,
      department,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      installationDate: installationDate || Date.now(),
      warrantyExpiry,
      vendorName: vendorName || 'Authorized Medical Supplier',
      purchaseCost,
      serviceInterval: serviceInterval || 90,
      nextMaintenance,
      location,
      assignedTechnician: assignedTechnician || null,
      equipmentImage,
      remarks: remarks || '',
      createdBy: req.user._id,
    });

    newEquipment.equipmentStatus = calculateEquipmentStatus(newEquipment);
    await newEquipment.save();

    await logActivity(req, 'Equipment Added', `Registered equipment: ${newEquipment.equipmentName} (${newEquipment.assetId})`);

    res.status(201).json({ success: true, equipment: newEquipment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical equipment details
// @route   PUT /api/equipment/:id
// @access  Private (Admin / Technician)
const updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.equipmentImage = `/uploads/${req.file.filename}`;
    }

    Object.keys(updateFields).forEach((key) => {
      equipment[key] = updateFields[key];
    });

    if (equipment.equipmentStatus !== 'Under Repair' && equipment.equipmentStatus !== 'Retired') {
      equipment.equipmentStatus = calculateEquipmentStatus(equipment);
    }

    await equipment.save();

    await logActivity(req, 'Equipment Updated', `Updated equipment details for ${equipment.equipmentName} (${equipment.assetId})`);

    res.status(200).json({ success: true, equipment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medical equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Admin)
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    // Remove related maintenance records
    await Maintenance.deleteMany({ equipmentId: equipment._id });
    await equipment.deleteOne();

    await logActivity(req, 'Equipment Deleted', `Deleted equipment asset: ${equipment.equipmentName} (${equipment.assetId})`);

    res.status(200).json({ success: true, message: 'Equipment and associated maintenance logs deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
