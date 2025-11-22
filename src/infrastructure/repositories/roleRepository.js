import pool from '../database/connection.js';

class RoleRepository {
  async findByName(roleName) {
    const query = 'SELECT * FROM roles WHERE role = $1';
    const result = await pool.query(query, [roleName]);
    return result.rows[0] || null;
  }
}

export default new RoleRepository();




