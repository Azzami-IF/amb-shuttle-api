const express = require("express");
const router = express.Router();

const bookingController =
  require("../controllers/bookingController");

const authMiddleware =
  require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  bookingController.createBooking
);

router.get(
  "/my-history",
  authMiddleware,
  bookingController.getMyHistory
);

router.get("/:id", authMiddleware, bookingController.getBookingDetails);

module.exports = router;