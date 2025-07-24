import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Load environment variables
import listingsRoutes from './routes/listings.routes.js'; // Import listings routes
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js'
import pool from './config/db.config.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Removed app.use(cookieParser());

app.get('/test-route/:id', (req, res) => {
  res.json({ message: `Test route hit with ID: ${req.params.id}` });
});
app.use('/propertydetails', propertyRoutes);
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); // Use the resolved path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error('Error testing database connection:', error);
    // Handle the error appropriately, maybe retry or exit
  }
}

testConnection();

// Mount Routes (pass the multer middleware to the specific route)
app.use('/createlisting', upload.array('images', 5), listingsRoutes); // 'images' is the field name in your FormData, 5 is the max number of files
app.use('/getlistings', listingsRoutes);
app.use('/propertydetails', propertyRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Rental Platform Backend is Running!');
});

// Start the Server

app.listen(port, host, () => {
  console.log(`Backend server listening on http://${host}:${port}`);
});