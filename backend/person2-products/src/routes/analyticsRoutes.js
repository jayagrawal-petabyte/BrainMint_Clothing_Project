const express = require('express');
const { getSalesDashboard } = require('../controllers/analyticsController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getSalesDashboard);
router.get('/sales', getSalesDashboard);

module.exports = router;
