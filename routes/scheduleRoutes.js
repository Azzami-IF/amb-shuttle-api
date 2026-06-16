const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", scheduleController.getSchedules);

// Create schedule (admin)
router.post("/", authMiddleware, adminMiddleware, adminController.createSchedule);

module.exports = router;