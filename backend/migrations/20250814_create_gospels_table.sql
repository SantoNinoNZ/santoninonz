CREATE TABLE IF NOT EXISTS gospels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    verse TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add an index for faster lookups by date
CREATE INDEX IF NOT EXISTS idx_gospels_date ON gospels (date);
