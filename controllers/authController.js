const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Data tidak lengkap"
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email sudah digunakan"
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (name,email,phone,password)
          VALUES (?,?,?,?)`,
          [name, email, phone, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "Register berhasil",
              userId: result.insertId
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email dan password wajib diisi"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Email tidak ditemukan"
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Password salah"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  );
};

exports.profile = (req, res) => {
  db.query(
    "SELECT id,name,email,phone,role FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan"
        });
      }

      res.json(results[0]);
    }
  );
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, old_password, new_password } = req.body;
    const userId = req.user.id;

    // If changing password, verify old_password
    if (new_password) {
      if (!old_password) return res.status(400).json({ message: "Old password diperlukan" });

      db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(old_password, results[0].password);
        if (!isMatch) return res.status(400).json({ message: "Old password salah" });

        const hashed = await bcrypt.hash(new_password, 10);
        db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId], (err2) => {
          if (err2) return res.status(500).json(err2);
          // continue to update name/phone if provided
        });
      });
    }

    // Update name and phone (and password already updated above if any)
    db.query(
      "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), updated_at = NOW() WHERE id = ?",
      [name || null, phone || null, userId],
      (err3) => {
        if (err3) return res.status(500).json(err3);
        res.json({ message: "Profil diperbarui" });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};