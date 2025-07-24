import express from 'express';
import * as propertiesController from '../controllers/property.controller.js'; // Adjust the path if needed

const router = express.Router();

// here there is a /propertydetails prefixed which means its actually '/propertydetails/:propertyId'
router.get('/:propertyId', (req, res) => {
    console.log('Property details route hit!', req.params.propertyId);
    propertiesController.getPropertyDetails(req, res);
  });

export default router;