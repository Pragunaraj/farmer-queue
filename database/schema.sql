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

CREATE TABLE procurement_records (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    produce_type VARCHAR(100) NOT NULL,
    quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg > 0),
    quality_grade VARCHAR(20),
    procurement_status VARCHAR(20) DEFAULT 'accepted'
        CHECK (procurement_status IN ('accepted', 'rejected', 'pending')),
    price_per_kg NUMERIC(10,2) CHECK (price_per_kg >= 0),
    total_amount NUMERIC(12,2) CHECK (total_amount >= 0),
    procurement_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);