const express = require('express');
const router = express.Router();
const { getReports, generateReport } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getReports);
router.post('/generate', generateReport);

module.exports = router;
