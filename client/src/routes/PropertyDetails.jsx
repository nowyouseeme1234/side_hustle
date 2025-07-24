import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL}/propertydetails/${propertyId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setProperty(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">Loading property details...</div>;
  }

  if (error) {
    return <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">Error: {error.message}</div>;
  }

  if (!property) {
    return <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">Property not found.</div>;
  }

  const formatPrice = (price) => {
    if (price) {
      return Number(price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return null;
  };

  const getImagesArray = (images) => {
    if (!images) {
      return [];
    }
    return Array.isArray(images) ? images : images.split(',');
  };

  const propertyImages = getImagesArray(property.images);

  const isUserLoggedIn = () => {
    // Replace this with your actual authentication check
    return localStorage.getItem('user') !== null; // Example: Check if 'user' item exists in local storage
  };

  const handleBuyInPerson = () => {
    if (isUserLoggedIn()) {
      // Navigate to the in-person purchase route
      navigate(`/buyinperson/${propertyId}`); // You'll need to define this route
      console.log('Navigating to in-person purchase for property:', propertyId);
    } else {
      // Redirect to the signup page
      navigate('/signup');
      console.log('Redirecting to signup for in-person purchase.');
    }
  };

  const handleBuyOnline = () => {
    if (isUserLoggedIn()) {
      // Navigate to the online purchase route
      navigate(`/buyonline/${propertyId}`); // You'll need to define this route
      console.log('Navigating to online purchase for property:', propertyId);
    } else {
      // Redirect to the signup page
      navigate('/signup');
      console.log('Redirecting to signup for online purchase.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {propertyImages.length > 0 ? (
          <img
            src={`${window.API_BASE_URL}${propertyImages[0]}`}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="w-full h-96 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No Images Available</span>
          </div>
        )}
        <div className="p-8">
          <h1 className="text-3xl font-semibold mb-4 text-indigo-400">{property.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-300">
            <div>
              <p><span className="font-semibold text-teal-400">Price:</span> ETB {formatPrice(property.asking_price)}</p>
              <p><span className="font-semibold text-teal-400">Type:</span> {property.property_type}</p>
              <p><span className="font-semibold text-teal-400">Bedrooms:</span> {property.bedrooms}</p>
              <p><span className="font-semibold text-teal-400">Bathrooms:</span> {Math.floor(property.bathrooms)}</p>
              {property.square_footage && (
                <p><span className="font-semibold text-teal-400">Area:</span> {property.square_footage} m<sup>2</sup></p>
              )}
              {property.lease_terms && (
                <p><span className="font-semibold text-teal-400">Lease Terms:</span> {property.lease_terms}</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-teal-400">Seller Information</h2>
              <p><span className="font-semibold text-teal-400">Name:</span> {property.username}</p>
              <div className="mt-4 space-x-4">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleBuyInPerson}
                >
                  Buy In-Person
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleBuyOnline}
                >
                  Buy Online
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-teal-400">Description</h2>
            <p className="text-gray-400">{property.description}</p>
          </div>
          {propertyImages.length > 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2 text-teal-400">More Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyImages.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000${image}`}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;