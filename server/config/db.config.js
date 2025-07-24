import mysql from 'mysql2/promise';
import 'dotenv/config';

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sharemyrentDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('Database pool created successfully.'); // Indicate successful pool creation

} catch (error) {
  console.error('Error creating database pool:', error);
  // You might want to exit the application here if the database connection is critical
  process.exit(1);
}

export default pool;