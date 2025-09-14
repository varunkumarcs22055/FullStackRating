const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Find user by email
    static async findByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all users (for admin)
    static async findAll() {
        try {
            const result = await pool.query(`
                SELECT 
                    u.*,
                    CASE 
                        WHEN u.role = 'store_owner' THEN 
                            COALESCE(AVG(r.rating::DECIMAL), 0)
                        ELSE NULL 
                    END as store_average_rating,
                    CASE 
                        WHEN u.role = 'store_owner' THEN 
                            COUNT(r.rating)
                        ELSE NULL 
                    END as store_total_ratings
                FROM users u
                LEFT JOIN stores s ON u.id = s.owner_id
                LEFT JOIN ratings r ON s.id = r.store_id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Create new user
    static async create(userData) {
        try {
            const { name, email, password, role = 'user', address = '' } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const result = await pool.query(
                'INSERT INTO users (name, email, password, role, address, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, email, hashedPassword, role, address, true]
            );
            
            // Remove password from returned object
            const user = result.rows[0];
            delete user.password;
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update user
    static async update(id, userData) {
        try {
            const { name, email, address, role } = userData;
            const result = await pool.query(
                'UPDATE users SET name = $1, email = $2, address = $3, role = $4 WHERE id = $5 RETURNING *',
                [name, email, address, role, id]
            );
            
            const user = result.rows[0];
            delete user.password;
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update password
    static async updatePassword(id, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, email, role',
                [hashedPassword, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static async delete(id) {
        try {
            const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
            const user = result.rows[0];
            if (user) {
                delete user.password;
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Search users by name, email, or address
    static async search(searchTerm) {
        try {
            const result = await pool.query(`
                SELECT 
                    u.*,
                    CASE 
                        WHEN u.role = 'store_owner' THEN 
                            COALESCE(AVG(r.rating::DECIMAL), 0)
                        ELSE NULL 
                    END as store_average_rating
                FROM users u
                LEFT JOIN stores s ON u.id = s.owner_id
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR u.address ILIKE $1
                GROUP BY u.id
                ORDER BY u.name
            `, [`%${searchTerm}%`]);
            
            // Remove passwords from results
            const users = result.rows.map(user => {
                delete user.password;
                return user;
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Get user statistics for admin dashboard
    static async getStats() {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
                    COUNT(CASE WHEN role = 'store_owner' THEN 1 END) as store_owners,
                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
                FROM users
            `);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update user password
    static async updatePassword(userId, hashedPassword) {
        try {
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email, role',
                [hashedPassword, userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;