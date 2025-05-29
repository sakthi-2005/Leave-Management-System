-- USERS: stores employees and managers
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'manager', 'admin') NOT NULL DEFAULT 'employee',
  reporting_manager_id INT,
  FOREIGN KEY (reporting_manager_id) REFERENCES users(id)
);

-- LEAVE TYPES: stores types like sick leave, casual etc.
CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  monthly_allocation INT NOT NULL DEFAULT 0,
  confirmation_steps INT NOT NULL DEFAULT 1
);

-- LEAVE BALANCE: tracks available leaves per user/type
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  balance INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  UNIQUE KEY (user_id, leave_type_id)
);

-- LEAVE REQUESTS: tracks actual leave applications
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  description TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  step_completed INT DEFAULT 0,
  steps_required INT DEFAULT 1,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
);

-- NOTIFY RECIPIENTS: multi-user notification
CREATE TABLE IF NOT EXISTS notify_recipients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leave_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (leave_id) REFERENCES leave_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

