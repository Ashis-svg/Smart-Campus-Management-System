import mysql from 'mysql2';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.SQLP,
  database: process.env.DB_NAME || 'student_media',
  // 1. We must explicitly tell it to use the custom Aiven port
  port: process.env.DB_PORT || 3306,
  // 2. Cloud databases require SSL to connect securely
  ssl: {
    rejectUnauthorized: false
  },

  timezone: '+05:30',
  dateStrings: true
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed!', err);
    return;
  }
  console.log('Database connected successfully!');
});

export const query = promisify(db.query).bind(db);

export default db;