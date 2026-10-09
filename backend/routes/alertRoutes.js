const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
} = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getAlerts);
router.put('/read-all', markAllAlertsAsRead);
router.put('/:id/read', markAlertAsRead);

module.exports = router;
