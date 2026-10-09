const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { equipmentValidation } = require('../validators/equipmentValidator');

router.use(protect);

router
  .route('/')
  .get(getEquipment)
  .post(authorize('Admin', 'Technician'), upload.single('equipmentImage'), equipmentValidation, createEquipment);

router
  .route('/:id')
  .get(getEquipmentById)
  .put(authorize('Admin', 'Technician'), upload.single('equipmentImage'), updateEquipment)
  .delete(authorize('Admin'), deleteEquipment);

module.exports = router;
