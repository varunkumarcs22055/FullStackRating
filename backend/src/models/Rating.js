const { pool } = require('../config/database');

class Rating {
    // Get all ratings
    static async findAll() {
        try {
            const result = await pool.query(`
                SELECT 
                    r.*,
                    u.name as user_name,
                    u.email as user_email,
                    s.name as store_name,
                    s.address as store_address
                FROM ratings r
                JOIN users u ON r.user_id = u.id
                JOIN stores s ON r.store_id = s.id
                ORDER BY r.created_at DESC
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get ratings for a specific store
    static async findByStoreId(storeId) {
        try {
            const result = await pool.query(`
                SELECT 
                    r.*,
                    u.name as user_name,
                    u.email as user_email
                FROM ratings r
                JOIN users u ON r.user_id = u.id
                WHERE r.store_id = $1
                ORDER BY r.created_at DESC
            `, [storeId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get ratings by a specific user
    static async findByUserId(userId) {
        try {
            const result = await pool.query(`
                SELECT 
                    r.*,
                    s.name as store_name,
                    s.address as store_address
                FROM ratings r
                JOIN stores s ON r.store_id = s.id
                WHERE r.user_id = $1
                ORDER BY r.created_at DESC
            `, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get specific rating by user and store
    static async findByUserAndStore(userId, storeId) {
        try {
            const result = await pool.query(
                'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
                [userId, storeId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Create or update rating
    static async createOrUpdate(ratingData) {
        try {
            const { user_id, store_id, rating } = ratingData;
            
            // Check if rating exists
            const existingRating = await this.findByUserAndStore(user_id, store_id);
            
            if (existingRating) {
                // Update existing rating
                const result = await pool.query(
                    'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING *',
                    [rating, user_id, store_id]
                );
                return { rating: result.rows[0], isUpdate: true };
            } else {
                // Create new rating
                const result = await pool.query(
                    'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
                    [user_id, store_id, rating]
                );
                return { rating: result.rows[0], isUpdate: false };
            }
        } catch (error) {
            throw error;
        }
    }

    // Delete rating
    static async delete(userId, storeId) {
        try {
            const result = await pool.query(
                'DELETE FROM ratings WHERE user_id = $1 AND store_id = $2 RETURNING *',
                [userId, storeId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get store statistics
    static async getStoreStats(storeId) {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_ratings,
                    AVG(rating::DECIMAL) as average_rating,
                    COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                    COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                    COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                    COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
                    COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
                FROM ratings 
                WHERE store_id = $1
            `, [storeId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get overall system statistics
    static async getSystemStats() {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_ratings,
                    AVG(rating::DECIMAL) as overall_average,
                    COUNT(DISTINCT store_id) as rated_stores,
                    COUNT(DISTINCT user_id) as active_raters
                FROM ratings
            `);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Rating;