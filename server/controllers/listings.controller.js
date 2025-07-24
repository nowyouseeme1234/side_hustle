// listings.controller.js
import pool from '../config/db.config.js';

// Function to handle creating a new listing (POST /api/listings)
export const createListing = async (req, res) => {
  console.log('data received from client:', req.body);
  try {
    const { address, propertyType, bedrooms, bathrooms, squareFootage, description, monthlyRent, incomePercentage, askingPrice, leaseTerms, termsAgreed } = req.body;
    // Try to get the user ID from the session or request object
    const ownerId = req.body.owner_id; // Adjust based on your actual authentication setup

    // if (!ownerId) {
    //   return res.status(401).json({ error: 'User not authenticated.' }); // Or handle unauthenticated requests appropriately
    // }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const [result] = await pool.execute(
      'INSERT INTO listings (owner_id, address, property_type, bedrooms, bathrooms, square_footage, description, monthly_rent, income_percentage, asking_price, lease_terms, terms_agreed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ownerId, address, propertyType, bedrooms, bathrooms, squareFootage, description, monthlyRent, incomePercentage, askingPrice, leaseTerms, termsAgreed]
    );

    const listingId = result.insertId;

    // If there are images, insert them into the listing_images table
    if (images.length > 0) {
      console.log(listingId);
      const imageValues = images.map(url => [listingId, url]);
      // Build the SQL query dynamically
      const valuesPlaceholder = imageValues.map(() => '(?, ?)').join(',');
      const sql = `INSERT INTO listing_images (listing_id, image_url) VALUES ${valuesPlaceholder}`;
      const flattenedValues = imageValues.flat();

      await pool.execute(sql, flattenedValues);
    }

    res.status(201).json({ message: 'Listing created successfully!', listingId });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing.' });
  }
};

// Function to handle fetching all listings (GET /api/listings)
export const getAllListings = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        l.*,
        GROUP_CONCAT(li.image_url) AS images,
        u.username AS owner_name  -- Include the owner's name
      FROM listings l
      LEFT JOIN listing_images li ON l.id = li.listing_id
      LEFT JOIN users u ON l.owner_id = u.id  -- Join with the users table
      GROUP BY l.id
    `);

    // Process the results to split the comma-separated image URLs into an array
    const listingsWithImages = rows.map(listing => ({
      ...listing,
      images: listing.images ? listing.images.split(',') : [],
      owner_name: listing.owner_name || 'Unknown' 
    }));

    res.status(200).json(listingsWithImages);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
};

// You would add more controller functions here for updating, deleting, or fetching single listings