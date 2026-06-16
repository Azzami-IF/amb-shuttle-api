const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/schedules", authMiddleware, adminMiddleware, adminController.createSchedule);
router.delete("/schedules/:id", authMiddleware, adminMiddleware, adminController.deleteSchedule);

router.get("/fleets", authMiddleware, adminMiddleware, adminController.getFleets);
router.post("/fleets", authMiddleware, adminMiddleware, adminController.addFleet);

router.get("/bookings", authMiddleware, adminMiddleware, adminController.getAllBookings);
router.patch("/bookings/:id/status", authMiddleware, adminMiddleware, adminController.updateBookingStatus);

module.exports = router;
