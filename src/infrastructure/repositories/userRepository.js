import pool from '../database/connection.js';

class UserRepository {
  async create(email, passwordHash, firstName, lastName) {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name
    `;
    const result = await pool.query(query, [email, passwordHash, firstName, lastName]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const query = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

export default new UserRepository();




