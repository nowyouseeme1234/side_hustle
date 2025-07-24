import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBed, FaBath, FaMoneyBillWave } from 'react-icons/fa'; // Importing relevant icons
import { FaLocationDot } from "react-icons/fa6";

const BuyaShare = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${window.API_BASE_URL}/getlistings`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (e) {
        console.error('Could not fetch listings:', e);
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div>Loading listings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-indigo-400">Explore Available Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/propertydetails/${listing.id}`} className="group block bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out">
              {listing.images && listing.images.length > 0 && (
                <img
                  src={`${window.API_BASE_URL}${listing.images[0]}`}
                  alt={listing.address}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <span className="flex items-baseline space-x-2">
                  <FaLocationDot />
                  <h3 className="text-xl font-semibold mb-2">{listing.address}</h3>
                </span>
                <p className="text-gray-300 mb-4">{listing.description}</p>
                <div className="flex items-center space-x-4 text-gray-400 mb-2">
                  {listing.property_type && (
                    <span className="flex items-center">
                      <FaHome className="mr-1" /> {listing.property_type}
                    </span>
                  )}
                  {listing.bedrooms && (
                    <span className="flex items-center">
                      <FaBed className="mr-1" /> {listing.bedrooms} Beds
                    </span>
                  )}
                  {Math.floor(listing.bathrooms) > 0 && (
                    <span className="flex items-center">
                      <FaBath className="mr-1" /> {Math.floor(listing.bathrooms)} Baths
                    </span>
                  )}
                </div>
                <div className="mt-3 text-indigo-400 font-semibold flex items-center">
                  <FaMoneyBillWave className="mr-1" /> Rent: ETB {formatPrice(listing.monthly_rent)}
                </div>
                {listing.asking_price && (
                  <div className="mt-1 text-green-400 font-semibold flex items-center">
                    <FaMoneyBillWave className="mr-1" /> Asking Price (for {listing.income_percentage}%): ETB {formatPrice(listing.asking_price)}
                  </div>
                )}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-teal-400 hover:underline">Click to view details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyaShare;