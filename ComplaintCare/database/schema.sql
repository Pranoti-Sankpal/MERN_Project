-- ============================================================
-- ComplaintCare - Customer Complaint Management System
-- Database Schema (MySQL)
-- ============================================================

DROP DATABASE IF EXISTS complaint_management;
CREATE DATABASE complaint_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE complaint_management;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,       -- bcrypt hash
  phone VARCHAR(20),
  role ENUM('ADMIN', 'EMPLOYEE', 'CUSTOMER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users (role);

-- ------------------------------------------------------------
-- complaint_categories
-- ------------------------------------------------------------
CREATE TABLE complaint_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_category_name UNIQUE (name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- complaints
-- ------------------------------------------------------------
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  category_id INT,
  assigned_employee_id INT,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
  status ENUM('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'SUBMITTED',
  resolution_remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL DEFAULT NULL,
  closed_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_complaints_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_complaints_category FOREIGN KEY (category_id) REFERENCES complaint_categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_complaints_employee FOREIGN KEY (assigned_employee_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_complaints_status ON complaints (status);
CREATE INDEX idx_complaints_priority ON complaints (priority);
CREATE INDEX idx_complaints_customer ON complaints (customer_id);
CREATE INDEX idx_complaints_employee ON complaints (assigned_employee_id);
CREATE INDEX idx_complaints_category ON complaints (category_id);
CREATE INDEX idx_complaints_created ON complaints (created_at);

-- ------------------------------------------------------------
-- complaint_comments
-- ------------------------------------------------------------
CREATE TABLE complaint_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_comments_complaint ON complaint_comments (complaint_id);
