const { Pool } = require('pg'); // For PostgreSQL
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fullstack_auth',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        
        // Create users table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) CHECK (role IN ('user', 'store_owner', 'admin')) DEFAULT 'user',
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create stores table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS stores (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                address TEXT NOT NULL,
                owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create ratings table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS ratings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, store_id)
            )
        `);

        // Insert sample stores if none exist
        const storeCount = await client.query('SELECT COUNT(*) FROM stores');
        if (parseInt(storeCount.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO stores (name, email, address, owner_id) VALUES 
                ('Tech World Electronics', 'contact@techworld.com', '123 Silicon Valley, San Francisco, CA', 5),
                ('Fashion Central', 'info@fashioncentral.com', '456 Fashion Ave, New York, NY', 5),
                ('Book Haven', 'books@bookhaven.com', '789 Literary Lane, Boston, MA', 5),
                ('Food Paradise', 'orders@foodparadise.com', '321 Gourmet Street, Chicago, IL', 5),
                ('Sports Zone', 'sales@sportszone.com', '654 Athletic Drive, Los Angeles, CA', 5),
                ('Home & Garden', 'service@homeandgarden.com', '987 Decorator Blvd, Miami, FL', 5),
                ('Music Store', 'info@musicstore.com', '147 Melody Avenue, Nashville, TN', 5),
                ('Auto Parts Plus', 'parts@autopartsplus.com', '258 Motor Way, Detroit, MI', 5),
                ('Pet World', 'care@petworld.com', '369 Animal Street, Portland, OR', 5),
                ('Beauty Salon', 'booking@beautysalon.com', '741 Glamour Road, Las Vegas, NV', 5),
                ('Coffee Corner', 'hello@coffeecorner.com', '852 Brew Street, Seattle, WA', 5),
                ('Pharmacy Plus', 'health@pharmacyplus.com', '963 Wellness Ave, Phoenix, AZ', 5)
            `);
            console.log('Sample stores inserted successfully');
        }
        
        console.log('Users table created/verified successfully');
        console.log('Stores table created/verified successfully');
        console.log('Ratings table created/verified successfully');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
        console.log('Server will continue running without database connection');
        console.log('Please check your PostgreSQL credentials in .env file');
        // Don't exit the process, just log the error
    }
};

module.exports = { pool, connectDB };