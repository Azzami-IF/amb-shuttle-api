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

exports.getBookingDetails = (req, res) => {
  const { id } = req.params; // can be numeric id or booking_code

  const sql = `
    SELECT b.id AS booking_id, b.booking_code, b.total_price, b.payment_status, b.status,
      u.name AS user_name, u.phone AS user_phone,
      s.origin, s.destination, s.departure_time, f.vehicle_name
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN schedules s ON s.id = b.schedule_id
    LEFT JOIN fleets f ON f.id = s.fleet_id
    WHERE b.id = ? OR b.booking_code = ?
    LIMIT 1
  `;

  db.query(sql, [id, id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: "Booking tidak ditemukan" });

    const booking = results[0];

    db.query("SELECT seat_number FROM booking_seats WHERE booking_id = ?", [booking.booking_id], (err2, seats) => {
      if (err2) return res.status(500).json(err2);
      booking.seat_numbers = seats.map((s) => s.seat_number);
      res.json(booking);
    });
  });
};