const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const bookingRoutes =
  require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tripsRoutes = require("./routes/tripsRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trips", tripsRoutes);

// alias for user profile per spec
app.use("/api/user", authRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AMB Shuttle API Running"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});