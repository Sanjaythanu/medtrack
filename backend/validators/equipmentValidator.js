const { check, validationResult } = require('express-validator');

const equipmentValidation = [
  check('assetId', 'Asset ID is required').notEmpty().trim(),
  check('equipmentName', 'Equipment name is required').notEmpty().trim(),
  check('category', 'Category is required').notEmpty().trim(),
  check('department', 'Department is required').notEmpty().trim(),
  check('manufacturer', 'Manufacturer is required').notEmpty().trim(),
  check('model', 'Model is required').notEmpty().trim(),
  check('serialNumber', 'Serial number is required').notEmpty().trim(),
  check('purchaseDate', 'Valid purchase date is required').isISO8601(),
  check('warrantyExpiry', 'Valid warranty expiry date is required').isISO8601(),
  check('purchaseCost', 'Purchase cost must be a positive number').isFloat({ min: 0 }),
  check('nextMaintenance', 'Valid next maintenance date is required').isISO8601(),
  check('location', 'Location is required').notEmpty().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  equipmentValidation,
};
