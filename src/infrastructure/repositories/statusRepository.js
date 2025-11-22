import pool from '../database/connection.js';

class StatusRepository {
  async findByName(statusName) {
    const query = 'SELECT * FROM statuses WHERE status = $1';
    const result = await pool.query(query, [statusName]);
    return result.rows[0] || null;
  }

  async findAll() {
    const query = 'SELECT * FROM statuses ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new StatusRepository();




