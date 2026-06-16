const db = require("../config/db");

exports.createBooking = (req, res) => {
  const { schedule_id } = req.body;

  const bookingCode =
    "BK-" + Date.now();

  db.query(
    "SELECT * FROM schedules WHERE id = ?",
    [schedule_id],
    (err, scheduleResult) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (scheduleResult.length === 0) {
        return res.status(404).json({
          message: "Schedule tidak ditemukan"
        });
      }

      const schedule = scheduleResult[0];

      db.query(
        `INSERT INTO bookings
        (booking_code,user_id,schedule_id,total_price)
        VALUES (?,?,?,?)`,
        [
          bookingCode,
          req.user.id,
          schedule_id,
          schedule.price
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "Booking berhasil",
            booking_id: result.insertId,
            booking_code: bookingCode
          });
        }
      );
    }
  );
};

exports.getMyHistory = (req, res) => {
  db.query(
    `
    SELECT
      b.*,
      s.origin,
      s.destination,
      s.departure_time
    FROM bookings b
    JOIN schedules s
      ON s.id = b.schedule_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
    `,
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
};