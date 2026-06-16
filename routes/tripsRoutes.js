const express = require("express");
const router = express.Router();

const tripsController = require("../controllers/tripsController");
const authMiddleware = require("../middleware/authMiddleware");

router.patch("/:id/status", authMiddleware, tripsController.updateTripStatus);
router.post("/:id/location", authMiddleware, tripsController.updateLocation);
router.get("/:id/track", authMiddleware, tripsController.trackTrip);
router.get("/:id/location", authMiddleware, tripsController.updateLocationGet);

module.exports = router;
