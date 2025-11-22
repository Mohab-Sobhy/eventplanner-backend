import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eventplanner',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'false' ? false : {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  }
});

export default pool;
