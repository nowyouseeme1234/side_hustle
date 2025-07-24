import express from 'express';
const router = express.Router();
import * as listingsController from '../controllers/listings.controller.js';

// Define routes for listings
router.post('/', listingsController.createListing);
router.get('/', listingsController.getAllListings);

// You would add more routes here (e.g., GET /api/listings/:id, PUT /api/listings/:id, DELETE /api/listings/:id)

export default router;