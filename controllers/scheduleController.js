const db = require("../config/db");

exports.getSchedules = (req, res) => {
  db.query(
    "SELECT * FROM schedules ORDER BY departure_time ASC",
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(results);
    }
  );
};