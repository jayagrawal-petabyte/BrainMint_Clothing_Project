const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authController");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  authController.resetPassword
);

router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);
router.put(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  (req, res) => {

    res.status(200).json({
  success: true,
  message: "Admin access granted",
  data: {
    role: req.user.role
  }
});

  }
);

router.get("/", (req, res) => {
  res.send("Auth Route Working");
});

module.exports = router;