const { check, validationResult } = require('express-validator');

const maintenanceValidation = [
  check('equipmentId', 'Valid equipment reference ID is required').isMongoId(),
  check('technicianId', 'Valid technician reference ID is required').isMongoId(),
  check('maintenanceType', 'Maintenance type must be Preventive, Corrective, Emergency, or Routine').isIn([
    'Preventive',
    'Corrective',
    'Emergency',
    'Routine',
  ]),
  check('scheduledDate', 'Valid scheduled date is required').isISO8601(),
  check('priority', 'Priority must be Low, Medium, High, or Critical').isIn(['Low', 'Medium', 'High', 'Critical']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  maintenanceValidation,
};
