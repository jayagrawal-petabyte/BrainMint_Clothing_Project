const express =
require("express");

const router =
express.Router();

const contactController = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", contactController.createContact);
router.get("/", protect, adminOnly, contactController.getAllContacts);

module.exports = router;