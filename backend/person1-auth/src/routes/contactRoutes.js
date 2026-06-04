const express =
require("express");

const router =
express.Router();

const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", contactController.createContact);
router.get("/", authMiddleware, adminMiddleware, contactController.getAllContacts);

module.exports = router;