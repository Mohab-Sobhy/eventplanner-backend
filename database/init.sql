-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25)
);

-- ===============================
-- EVENTS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location TEXT,
    description TEXT
);

-- ===============================
-- ROLES TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL UNIQUE
);

-- ===============================
-- STATUSES TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS statuses (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL UNIQUE
);

-- ===============================
-- EVENT ATTENDANCE TABLE
-- JOIN TABLE (Many-to-Many)
-- ===============================
CREATE TABLE IF NOT EXISTS event_attendance (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    role_id INT NOT NULL,            -- as requested
    status_id INT,
    invited_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Composite primary key (user attends an event once)
    CONSTRAINT pk_event_attendance PRIMARY KEY (event_id, user_id),

    -- Foreign Keys
    CONSTRAINT fk_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_status
        FOREIGN KEY (status_id)
        REFERENCES statuses(id)
        ON DELETE SET NULL
);

-- ===============================
-- INSERT INITIAL DATA
-- ===============================

-- Insert roles
INSERT INTO roles (role) VALUES ('organizer'), ('attendee')
    ON CONFLICT (role) DO NOTHING;

-- Insert statuses
INSERT INTO statuses (status) VALUES ('Going'), ('Maybe'), ('Not Going')
    ON CONFLICT (status) DO NOTHING;
