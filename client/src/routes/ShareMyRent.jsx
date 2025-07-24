import React, { useState } from 'react';

const ShareMyRent = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    description: '',
    monthlyRent: '',
    incomePercentage: '',
    askingPrice: '',
    leaseTerms: '',
    images: [],
    termsAgreed: false,
  });
  const [dragActive, setDragActive] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);



  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : type === 'file' ? [...prevDetails.images, ...files] : value,
    }));
  };

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setPropertyDetails((prevDetails) => ({
        ...prevDetails,
        images: [...prevDetails.images, ...e.dataTransfer.files],
      }));
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveImage = (index) => {
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      images: prevDetails.images.filter((_, i) => i !== index),
    }));
  };

  const calculatePrice = () => {
    const { monthlyRent, incomePercentage } = propertyDetails;
    if (monthlyRent && incomePercentage) {
      const monthlyRentNum = parseFloat(monthlyRent);
      const incomePercentageNum = parseFloat(incomePercentage);
      const pricingFactor = 7; // Initial pricing factor
      const approximatePrice = (monthlyRentNum * 12) * (incomePercentageNum / 100) * pricingFactor;
      setPropertyDetails((prevDetails) => ({
        ...prevDetails,
        askingPrice: approximatePrice.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      alert('Please enter the monthly rent and the percentage you want to sell to calculate the approximate price.');
    }
  };

  const handlePublishClick = () => {
    setShowConfirmationModal(true);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // In a real application, you would send this data to your backend API
  //   console.log('Property Details submitted:', propertyDetails);
  //   alert('Listing submitted! (This is a placeholder)');
  //   // Optionally reset the form after submission
  //   // setPropertyDetails({ ...initialState });
  // };

  const handleConfirmPublish = async () => {
    setShowConfirmationModal(false);
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      const formData = new FormData();
      // Append all the property details to the FormData
      const getLoggedInUserId = () => {
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            return user.id; // Assuming your backend sends the user ID in the 'id' property
          } catch (e) {
            console.error('Error parsing user from local storage:', e);
            return null;
          }
        }
        return null;
      };
      const ownerId = getLoggedInUserId();
      console.log(ownerId)

      if (!ownerId) {
        setPublishError('User not authenticated. Please log in.');
        setIsPublishing(false);
        return;
      }

      formData.append('owner_id', ownerId);

      for (const key in propertyDetails) {
        if (key === 'images') {
          Array.from(propertyDetails.images).forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, propertyDetails[key]);
        }
      }

      const response = await fetch(`${window.API_BASE_URL}/createlisting`, { // Your backend API endpoint
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setPublishSuccess(true);
        // Optionally reset the form or redirect the user
        setPropertyDetails({
          address: '',
          propertyType: '',
          bedrooms: '',
          bathrooms: '',
          squareFootage: '',
          description: '',
          monthlyRent: '',
          incomePercentage: '',
          askingPrice: '',
          leaseTerms: '',
          images: [],
          termsAgreed: false,
        });
      } else {
        const errorData = await response.json();
        setPublishError(errorData.message || 'Failed to publish listing.');
      }
    } catch (error) {
      console.error('Error publishing listing:', error);
      setPublishError('An unexpected error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancelPublish = () => {
    setShowConfirmationModal(false);
  };


  return (
    <div className='bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24'>
      <div className='max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-md p-8'>
        <h2 className='text-3xl font-semibold mb-6 text-indigo-400'>List Your Rental Property</h2>
        <form onSubmit={(e) => e.preventDefault} className='space-y-4'>
          {/* Property Details */}
          <div>
            <label htmlFor='address' className='block text-gray-300 text-sm font-bold mb-2'>
              Address
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={propertyDetails.address}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
              required
            />
          </div>
          <div>
            <label htmlFor='propertyType' className='block text-gray-300 text-sm font-bold mb-2'>
              Property Type
            </label>
            <select
              id='propertyType'
              name='propertyType'
              value={propertyDetails.propertyType}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
            >
              <option value=''>Select Type</option>
              <option value='home'>Home</option>
              <option value='apartment'>Apartment</option>
              <option value='townhouse'>Townhouse</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='bedrooms' className='block text-gray-300 text-sm font-bold mb-2'>
                Bedrooms
              </label>
              <input
                type='number'
                id='bedrooms'
                name='bedrooms'
                value={propertyDetails.bedrooms}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
              />
            </div>
            <div>
              <label htmlFor='bathrooms' className='block text-gray-300 text-sm font-bold mb-2'>
                Bathrooms
              </label>
              <input
                type='number'
                id='bathrooms'
                name='bathrooms'
                value={propertyDetails.bathrooms}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
              />
            </div>
          </div>
          <div>
            <label htmlFor='squareFootage' className='block text-gray-300 text-sm font-bold mb-2'>
              Area (Optional)
            </label>
            <div className='relative'>
            <input
              type='number'
              id='squareFootage'
              name='squareFootage'
              value={propertyDetails.squareFootage}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
            />
            <span className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'>m<sup>2</sup>(ካሬ)</span>
          </div>

          </div>
            
          <div>
            <label htmlFor='description' className='block text-gray-300 text-sm font-bold mb-2'>
              Description/Amenities
            </label>
            <textarea
              id='description'
              name='description'
              value={propertyDetails.description}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
              rows='3'
            />
          </div>

          {/* Rental Income Details */}
          <h3 className='text-xl font-semibold mt-6 mb-2 text-teal-400'>Rental Income Details</h3>
          <div>
            <label htmlFor='monthlyRent' className='block text-gray-300 text-sm font-bold mb-2'>
              Total Monthly Rent
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>ETB</span>
              <input
                type='number'
                id='monthlyRent'
                name='monthlyRent'
                value={propertyDetails.monthlyRent}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 pl-7 pr-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor='incomePercentage' className='block text-gray-300 text-sm font-bold mb-2'>
              Percentage of Monthly Income to Sell
            </label>
            <div className='relative'>
              <input
                type='number'
                id='incomePercentage'
                name='incomePercentage'
                value={propertyDetails.incomePercentage}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 pr-7 pl-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
                required
                min='1'
                max='100'
              />
              <span className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'>%</span>
            </div>
          </div>
          <div>
            <label htmlFor='askingPrice' className='block text-gray-300 text-sm font-bold mb-2'>
              Asking Price for the Percentage
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>ETB</span>
              <input
                type='number'
                id='askingPrice'
                name='askingPrice'
                value={propertyDetails.askingPrice}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 pl-7 pr-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
                required
              />
            </div>
            <button
              type='button'
              className='text-sm text-indigo-400 hover:underline mt-1 focus:outline-none'
              onClick={calculatePrice}
            >
              Don't know how to calculate price? click HERE.
            </button>
          </div>
          <div>
            <label htmlFor='leaseTerms' className='block text-gray-300 text-sm font-bold mb-2'>
              Lease Terms (Optional)
            </label>
            <textarea
              id='leaseTerms'
              name='leaseTerms'
              value={propertyDetails.leaseTerms}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-indigo-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700'
              rows='2'
              placeholder='e.g., 12-month lease, month-to-month'
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor='images' className='block text-gray-300 text-sm font-bold mb-2'>
              Property Photos
            </label>
            <div
              className={`relative border-2 border-dashed rounded-md p-6 transition duration-300 ease-in-out ${
                dragActive ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 bg-gray-800'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type='file'
                id='images'
                name='images'
                multiple
                onChange={handleChange}
                className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
              />
              <div className='text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 005.656 0L28 20m32-12l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 005.656 0L28 20'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='mt-1 text-sm text-gray-400'>
                  Drag and drop your photos here or <label htmlFor='images' className='font-medium text-indigo-400 hover:underline cursor-pointer'>browse</label>
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                  PNG, JPG, GIF up to 5MB each
                </p>
              </div>
              {dragActive && (
                <div className='absolute top-0 left-0 w-full h-full bg-gray-600 opacity-50 flex items-center justify-center'>
                  <span className='text-white text-lg'>Drop files here</span>
                </div>
              )}
            </div>
            {propertyDetails.images.length > 0 && (
              <div className='mt-4'>
                <h4 className='text-gray-300 text-sm font-bold mb-2'>Selected Photos</h4>
                <div className='flex flex-wrap gap-2'>
                  {Array.from(propertyDetails.images).map((image, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className='w-24 h-24 object-cover rounded-md'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs focus:outline-none'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='termsAgreed'
              name='termsAgreed'
              checked={propertyDetails.termsAgreed}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded'
              required
            />
            <label htmlFor='termsAgreed' className='ml-2 block text-gray-300 text-sm'>
              I agree to the <a href='#' className='text-indigo-400 hover:underline'>Terms and Conditions</a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type='button'
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full ${
              isPublishing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePublishClick}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-gray-700 rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold mb-4 text-white'>Confirm Publication</h2>
              <p className='text-gray-300 mb-4'>Are you sure you want to publish this listing?</p>
              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  className='bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
                  onClick={handleCancelPublish}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  onClick={handleConfirmPublish}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareMyRent;