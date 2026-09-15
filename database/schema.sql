CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE procurement_centers (
    id SERIAL PRIMARY KEY,
    center_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    contact_number VARCHAR(15),
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);