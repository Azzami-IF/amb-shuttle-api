const db = require("../config/db");

exports.createSchedule = (req, res) => {
  const { origin, destination, departure_time, arrival_time, fleet_id, price } = req.body;

  if (!origin || !destination || !departure_time || !fleet_id || !price) {
    return res.status(400).json({ message: "Data jadwal tidak lengkap" });
  }

  db.query(
    `INSERT INTO schedules (origin,destination,departure_time,arrival_time,fleet_id,price)
     VALUES (?,?,?,?,?,?)`,
    [origin, destination, departure_time, arrival_time, fleet_id, price],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Jadwal berhasil dibuat", id: result.insertId });
    }
  );
};

exports.deleteSchedule = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM schedules WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    res.json({ message: "Jadwal berhasil dihapus" });
  });
};

exports.getFleets = (req, res) => {
  db.query("SELECT * FROM fleets ORDER BY id", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.addFleet = (req, res) => {
  const { vehicle_name, license_plate, capacity, status } = req.body;
  if (!vehicle_name || !license_plate || !capacity) {
    return res.status(400).json({ message: "Data armada tidak lengkap" });
  }

  db.query(
    "INSERT INTO fleets (vehicle_name,license_plate,capacity,status) VALUES (?,?,?,?)",
    [vehicle_name, license_plate, capacity, status || "active"],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Armada ditambahkan", id: result.insertId });
    }
  );
};

exports.getAllBookings = (req, res) => {
  const sql = `
    SELECT b.id, b.booking_code, b.user_id, u.name AS user_name, b.schedule_id, s.origin, s.destination, b.total_price, b.status, b.created_at
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN schedules s ON s.id = b.schedule_id
    ORDER BY b.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status diperlukan" });

  db.query("UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?", [status, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking tidak ditemukan" });
    res.json({ message: "Status booking diperbarui" });
  });
};
