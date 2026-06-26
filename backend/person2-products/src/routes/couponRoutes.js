const express = require('express');
const {
  createCoupon,
  deleteCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
  validateCoupon
} = require('../controllers/couponController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/validate/:code', validateCoupon);

router.use(protect, adminOnly);

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCouponById).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
