CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nominees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS airports (
  code TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  nominee_id INTEGER REFERENCES nominees(id) ON DELETE SET NULL,
  pnr TEXT UNIQUE NOT NULL,
  from_airport TEXT NOT NULL,
  to_airport TEXT NOT NULL,
  airline TEXT NOT NULL,
  fare NUMERIC NOT NULL,
  travel_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_queries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO airports (code, city, name) VALUES
('DEL', 'Delhi', 'Indira Gandhi International Airport'),
('BLR', 'Bengaluru', 'Kempegowda International Airport'),
('BOM', 'Mumbai', 'Chhatrapati Shivaji Maharaj International Airport'),
('HYD', 'Hyderabad', 'Rajiv Gandhi International Airport'),
('CCU', 'Kolkata', 'Netaji Subhas Chandra Bose International Airport')
ON CONFLICT (code) DO NOTHING;
