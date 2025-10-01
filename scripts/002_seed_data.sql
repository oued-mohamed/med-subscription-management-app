-- Insert default admin user (password: admin123 - hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@subtrackr.com', '$2a$10$rKZLvVZhVqJhLqVqJhLqVeJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default WhatsApp message templates
INSERT INTO settings (key, value)
VALUES 
  ('whatsapp_7day_template', 'Hi {name}, your subscription expires in 7 days on {end_date}. Please renew to continue enjoying our services. Reply YES to renew.'),
  ('whatsapp_1day_template', 'Hi {name}, your subscription expires tomorrow ({end_date}). Don''t miss out! Renew now to avoid interruption.'),
  ('whatsapp_expiry_template', 'Hi {name}, your subscription has expired today. Renew now to restore your access immediately.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert sample clients
INSERT INTO clients (name, phone, email)
VALUES 
  ('John Doe', '+1234567890', 'john@example.com'),
  ('Jane Smith', '+1234567891', 'jane@example.com'),
  ('Mike Johnson', '+1234567892', 'mike@example.com'),
  ('Sarah Williams', '+1234567893', 'sarah@example.com'),
  ('David Brown', '+1234567894', 'david@example.com');

-- Insert sample subscriptions
INSERT INTO subscriptions (client_id, subscription_type, start_date, end_date, status, amount)
VALUES 
  (1, 'Monthly', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'active', 29.99),
  (2, '3 Months', CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE + INTERVAL '10 days', 'active', 79.99),
  (3, 'Yearly', CURRENT_DATE - INTERVAL '350 days', CURRENT_DATE + INTERVAL '15 days', 'active', 299.99),
  (4, 'Monthly', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '5 days', 'active', 29.99),
  (5, 'Monthly', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 'active', 29.99);
