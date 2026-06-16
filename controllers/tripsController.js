const db = require("../config/db");

exports.updateTripStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status diperlukan" });

  db.query(
    "UPDATE trips SET status = ?, ended_at = CASE WHEN ?='completed' THEN NOW() ELSE ended_at END WHERE id = ?",
    [status, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Trip tidak ditemukan" });
      res.json({ message: "Status trip diperbarui" });
    }
  );
};

exports.updateLocation = (req, res) => {
  const { id } = req.params; // trip id
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) return res.status(400).json({ message: "Koordinat diperlukan" });

  db.query(
    "INSERT INTO trip_locations (trip_id, latitude, longitude) VALUES (?,?,?)",
    [id, latitude, longitude],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Lokasi diterima" });
    }
  );
};

// Support GET updates (some clients may send coords as query params per spec)
exports.updateLocationGet = (req, res) => {
  const { id } = req.params;
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return res.status(400).json({ message: "Koordinat (latitude, longitude) diperlukan sebagai query params" });
  }

  db.query(
    "INSERT INTO trip_locations (trip_id, latitude, longitude) VALUES (?,?,?)",
    [id, latitude, longitude],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Lokasi diterima (query)" });
    }
  );
};

exports.trackTrip = (req, res) => {
  const { id } = req.params; // trip id

  const sql = `
    SELECT t.id AS trip_id, t.status, s.origin, s.destination, u.name AS driver_name,
      tl.latitude, tl.longitude, tl.recorded_at
    FROM trips t
    LEFT JOIN schedules s ON s.id = t.schedule_id
    LEFT JOIN users u ON u.id = t.driver_id
    LEFT JOIN trip_locations tl ON tl.trip_id = t.id
    WHERE t.id = ?
    ORDER BY tl.recorded_at DESC
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results || results.length === 0) return res.status(404).json({ message: "Trip tidak ditemukan" });
    res.json(results[0]);
  });
};
