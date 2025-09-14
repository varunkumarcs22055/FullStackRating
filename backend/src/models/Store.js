const { pool } = require('../config/database');

class Store {
    // Get all stores with their average ratings
    static async findAll() {
        try {
            const result = await pool.query(`
                SELECT 
                    s.*,
                    u.name as owner_name,
                    COALESCE(AVG(r.rating::DECIMAL), 0) as average_rating,
                    COUNT(r.rating) as total_ratings
                FROM stores s
                LEFT JOIN users u ON s.owner_id = u.id
                LEFT JOIN ratings r ON s.id = r.store_id
                GROUP BY s.id, u.name
                ORDER BY s.name
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get store by ID with statistics
    static async findById(id) {
        try {
            const result = await pool.query(`
                SELECT 
                    s.*,
                    u.name as owner_name,
                    COALESCE(AVG(r.rating::DECIMAL), 0) as average_rating,
                    COUNT(r.rating) as total_ratings
                FROM stores s
                LEFT JOIN users u ON s.owner_id = u.id
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.id = $1
                GROUP BY s.id, u.name
            `, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get stores by owner ID
    static async findByOwnerId(ownerId) {
        try {
            const result = await pool.query(`
                SELECT 
                    s.*,
                    COALESCE(AVG(r.rating::DECIMAL), 0) as average_rating,
                    COUNT(r.rating) as total_ratings
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.owner_id = $1
                GROUP BY s.id
                ORDER BY s.name
            `, [ownerId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Create new store
    static async create(storeData) {
        try {
            const { name, email, address, owner_id } = storeData;
            const result = await pool.query(
                'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, address, owner_id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update store
    static async update(id, storeData) {
        try {
            const { name, email, address } = storeData;
            const result = await pool.query(
                'UPDATE stores SET name = $1, email = $2, address = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [name, email, address, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete store
    static async delete(id) {
        try {
            const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Search stores by name or address
    static async search(searchTerm) {
        try {
            const result = await pool.query(`
                SELECT 
                    s.*,
                    u.name as owner_name,
                    COALESCE(AVG(r.rating::DECIMAL), 0) as average_rating,
                    COUNT(r.rating) as total_ratings
                FROM stores s
                LEFT JOIN users u ON s.owner_id = u.id
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.name ILIKE $1 OR s.address ILIKE $1
                GROUP BY s.id, u.name
                ORDER BY s.name
            `, [`%${searchTerm}%`]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get stores with ratings from specific user
    static async findAllWithUserRatings(userId) {
        try {
            const result = await pool.query(`
                SELECT 
                    s.*,
                    u.name as owner_name,
                    COALESCE(AVG(r.rating::DECIMAL), 0) as average_rating,
                    COUNT(r.rating) as total_ratings,
                    ur.rating as user_rating
                FROM stores s
                LEFT JOIN users u ON s.owner_id = u.id
                LEFT JOIN ratings r ON s.id = r.store_id
                LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
                GROUP BY s.id, u.name, ur.rating
                ORDER BY s.name
            `, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Store;