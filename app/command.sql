-- Create the users table
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(255),
    company VARCHAR(255),
    user_type ENUM('agent', 'renter') NOT NULL
);

-- Create the addresses table
CREATE TABLE addresses (
    address_id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create the credit_cards table
CREATE TABLE credit_cards (
    card_id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    expiry DATE NOT NULL,
    -- cvv VARCHAR(10) NOT NULL,
    billing_address_id VARCHAR(255),
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (billing_address_id) REFERENCES addresses(address_id) ON DELETE SET NULL
);

-- Create the renter_preferences table
CREATE TABLE renter_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    move_in_start DATE,
    move_in_end DATE,
    preferred_city VARCHAR(255),
    preferred_state VARCHAR(255),
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);