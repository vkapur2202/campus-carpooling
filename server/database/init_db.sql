DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  year VARCHAR(100), 
  gender VARCHAR(100),
  can_drive BOOLEAN NOT NULL,
  max_capacity INTEGER DEFAULT 0,
  created_on TIMESTAMP DEFAULT NOW(),  
  updated_on TIMESTAMP DEFAULT NOW(),
  confirmed_on TIMESTAMP,
  confirmed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "active event" (
  id SERIAL PRIMARY KEY,
  max_participants INTEGER NOT NULL,
  start_location VARCHAR(255) NOT NULL,
  end_location VARCHAR(255) NOT NULL,
  event_date TIMESTAMP NOT NULL,
  created_on TIMESTAMP DEFAULT NOW(),  
  updated_on TIMESTAMP DEFAULT NOW(),  
  user_id INTEGER NOT NULL REFERENCES "user"
);
