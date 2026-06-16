const mysql = require("mysql2");

let connection;

function createConnection() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  connection.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      // Try to reconnect after a short delay
      setTimeout(createConnection, 2000);
      return;
    }

    console.log("Database connected");
  });

  connection.on("error", (err) => {
    console.error("Database error", err);
    // Reconnect on common fatal errors to avoid crashing the app
    if (err && (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET" || err.fatal)) {
      console.log("Attempting to reconnect to database...");
      createConnection();
    } else {
      console.error("Unexpected DB error:", err);
    }
  });
}

createConnection();

module.exports = {
  query: (...args) => connection.query(...args),
  execute: (...args) => connection.execute(...args),
};