-- Database Setup Script for Fullstack Auth App
-- Run this script to set up your database

-- Create the database (if using PostgreSQL)
-- CREATE DATABASE fullstack_auth;

-- Use the database
-- \c fullstack_auth;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'store_owner', 'admin')) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo users (passwords are hashed for: Password123!)
-- Note: In production, use the signup endpoint or create users through the application

-- Demo Admin User
INSERT INTO users (name, email, password, role, is_verified) VALUES 
('Admin User', 'admin@demo.com', '$2a$10$CkaR3J9bllqbGdPEW4Mc..Y9Khg4xp.GKB5Gpw82Hxuf602fQ091y', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Demo Store Owner
INSERT INTO users (name, email, password, role, is_verified) VALUES 
('Store Owner', 'store@demo.com', '$2a$10$4paTmfV7QB0RhyCgnlMZxer7n2odjIwrxd.gUp6ZUDqe3EXR5kRsu', 'store_owner', true)
ON CONFLICT (email) DO NOTHING;

-- Demo Regular User
INSERT INTO users (name, email, password, role, is_verified) VALUES 
('Regular User', 'user@demo.com', '$2a$10$LCyUhphr86RbD3izdhjvguVQUiWbpClUn9k9brc6aN4kyQwblbNl6', 'user', true)
ON CONFLICT (email) DO NOTHING;

-- View all users
SELECT id, name, email, role, is_verified, created_at FROM users;

-- Additional useful queries:

-- Update user role
-- UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Verify a store owner
-- UPDATE users SET is_verified = true WHERE role = 'store_owner' AND email = 'store@example.com';

-- Delete a user
-- DELETE FROM users WHERE email = 'user@example.com';