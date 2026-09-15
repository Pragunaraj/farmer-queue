CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    center_id INTEGER NOT NULL REFERENCES procurement_centers(id),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    booked_count INTEGER DEFAULT 0 CHECK (booked_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    slot_id INTEGER NOT NULL REFERENCES slots(id),
    booking_status VARCHAR(20) DEFAULT 'confirmed'
        CHECK (booking_status IN ('confirmed', 'completed', 'cancelled')),
    booking_token VARCHAR(50) UNIQUE,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);