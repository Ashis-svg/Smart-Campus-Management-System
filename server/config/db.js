import mysql from 'mysql2';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

// Create a Pool instead of a single Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.SQLP,
  database: process.env.DB_NAME || 'student_media',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  timezone: '+05:30',
  dateStrings: true,
  
  // Pool specific settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// This ensures every time the pool creates a new connection, 
// it forces the Indian timezone automatically!
db.on('connection', (connection) => {
  connection.query("SET time_zone = '+05:30';", (err) => {
    if (err) {
      console.error('Failed to set timezone on new connection:', err);
    } else {
      console.log('New database connection established and timezone set to IST (+05:30)');
    }
  });
});

export const query = promisify(db.query).bind(db);

export default db;