CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  qty INT NOT NULL,
  pricing_mode ENUM('standard','bulk','clearance') NOT NULL DEFAULT 'standard',
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
