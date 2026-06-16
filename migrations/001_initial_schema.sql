-- Initial schema for AMB Shuttle API
-- Run with: mysql -u <user> -p <database> < migrations/001_initial_schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer','driver','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fleets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_name VARCHAR(191) NOT NULL,
  license_plate VARCHAR(50) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin VARCHAR(191) NOT NULL,
  destination VARCHAR(191) NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME,
  fleet_id INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  status ENUM('scheduled','cancelled','completed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fleet_id) REFERENCES fleets(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT NOT NULL,
  status ENUM('scheduled','on-going','completed') DEFAULT 'scheduled',
  driver_id INT,
  started_at DATETIME,
  ended_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(100) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  payment_status ENUM('pending','paid','failed') DEFAULT 'pending',
  status ENUM('booked','cancelled','completed') DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  UNIQUE KEY booking_seat_unique (booking_id, seat_number)
);

CREATE TABLE IF NOT EXISTS trip_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  INDEX (trip_id, recorded_at)
);
