const express = require('express');
const router = express.Router();
const {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { maintenanceValidation } = require('../validators/maintenanceValidator');

router.use(protect);

router
  .route('/')
  .get(getMaintenance)
  .post(authorize('Admin', 'Technician'), upload.array('attachments', 5), maintenanceValidation, createMaintenance);

router
  .route('/:id')
  .get(getMaintenanceById)
  .put(authorize('Admin', 'Technician'), upload.array('attachments', 5), updateMaintenance)
  .delete(authorize('Admin'), deleteMaintenance);

module.exports = router;
