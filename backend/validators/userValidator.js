const { check, validationResult } = require('express-validator');

const createUserValidation = [
  check('fullName', 'Full name is required').notEmpty().trim(),
  check('email', 'Valid email is required').isEmail().normalizeEmail(),
  check('employeeId', 'Employee ID is required').notEmpty().trim(),
  check('department', 'Department is required').notEmpty().trim(),
  check('role', 'Role must be Admin, Technician, or Staff').isIn(['Admin', 'Technician', 'Staff']),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const updateUserValidation = [
  check('fullName', 'Full name cannot be empty').optional().notEmpty().trim(),
  check('email', 'Valid email required').optional().isEmail().normalizeEmail(),
  check('role', 'Role must be Admin, Technician, or Staff').optional().isIn(['Admin', 'Technician', 'Staff']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  createUserValidation,
  updateUserValidation,
};
