const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/profile",
  authMiddleware,
  authController.profile
);

router.patch(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

module.exports = router;