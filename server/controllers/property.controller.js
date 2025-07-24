// property.controller.js
import pool from '../config/db.config.js';

export const getPropertyDetails = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const [property] = await pool.execute(
      `SELECT
          l.id,
          l.address AS title,
          l.description,
          l.monthly_rent AS price,
          l.property_type,
          l.bedrooms,
          l.bathrooms,
          l.square_footage,
          l.lease_terms,
          l.income_percentage,
          l.asking_price,
          l.terms_agreed,
          GROUP_CONCAT(li.image_url) AS images,
          u.username,
          u.phone_number
      FROM listings l
      LEFT JOIN listing_images li ON l.id = li.listing_id
      JOIN users u ON l.owner_id = u.id
      WHERE l.id = ?
      GROUP BY l.id;`,
      [propertyId]
    );

    if (property.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    res.status(200).json(property[0]);
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({ message: 'Failed to fetch listing details.' });
  }
};