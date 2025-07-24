import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BuyOnline = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [legalDocument, setLegalDocument] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [signature, setSignature] = useState('');
  const [showSignatureInput, setShowSignatureInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPropertyAndGenerateDocument = async () => {
      try {
        const propertyDetailsResponse = await fetch(`${window.API_BASE_URL}/propertydetails/${propertyId}`);
        if (!propertyDetailsResponse.ok) {
          throw new Error('Failed to fetch property details.');
        }
        const propertyData = await propertyDetailsResponse.json();
        const price = parseFloat(propertyData.asking_price);
        setTotalPrice(price);

        const santipayFee = price * 0.01;
        const companyFee = price * 0.02;
        const finalPrice = price + santipayFee + companyFee;
        const termsOfService = "These are the terms of service..."; // Replace with actual terms

        const generatedDocument = {
          userName: 'John Doe', // Replace with actual user name
          terms: termsOfService,
          price: price.toLocaleString(),
          santipayFee: santipayFee.toLocaleString(),
          companyFee: companyFee.toLocaleString(),
          finalPrice: finalPrice.toLocaleString(),
        };
        console.log(generatedDocument.finalPrice)

        setLegalDocument(generatedDocument);
        setLoadingDocument(false);
      } catch (error) {
        console.error('Error generating legal document:', error);
        setErrorMessage('Failed to load legal document. Please try again.');
        setLoadingDocument(false);
      }
    };

    fetchPropertyAndGenerateDocument();
  }, [propertyId]);

  const handleDiscard = () => {
    navigate('/buy-a-share');
  };

  const handleReadAndSign = () => {
    setShowSignatureInput(true);
  };

  const handleSignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleSignAndPay = () => {
    console.log('Document signed with:', signature);
    console.log('Redirecting to Santipay for:', legalDocument?.finalPrice);
    // window.location.href = 'SANTIPAY_PORTAL_URL?amount=' + legalDocument?.finalPrice;
  };

  if (loadingDocument) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24 flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p className="text-lg font-semibold">Please wait while your legal document is loading...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-4">{errorMessage}</p>
          <button onClick={() => window.location.reload()} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-400">Legal Document Review</h2>
        <p className="mb-4 text-gray-300">Please review the following document details:</p>
        <div className="mb-6 border-b border-gray-700 pb-4">
          <p><span className="font-semibold text-teal-400">Name:</span> {legalDocument.userName}</p>
          <p><span className="font-semibold text-teal-400">Terms of Service:</span> {legalDocument.terms.substring(0, 100)}... (Full terms will be in the actual document)</p>
          <p><span className="font-semibold text-teal-400">Price:</span> ETB {legalDocument.price}</p>
          <p><span className="font-semibold text-teal-400">Santipay Fee (1%):</span> ETB {legalDocument.santipayFee}</p>
          <p><span className="font-semibold text-teal-400">Our Company Fee (2%):</span> ETB {legalDocument.companyFee}</p>
          <p className="text-lg font-semibold text-blue-400"><span className="font-semibold text-teal-400">Total Price:</span> ETB {legalDocument.finalPrice}</p>
          {/* In a real scenario, you might have a button to view the full PDF here */}
        </div>

        <div className="flex justify-end space-x-4 mb-6">
          <button onClick={handleReadAndSign} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Sign
          </button>
          <button onClick={handleDiscard} className="bg-gray-700 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Discard
          </button>
        </div>

        {showSignatureInput && (
          <div className="bg-gray-700 rounded-md p-4">
            <label htmlFor="signature" className="block text-teal-400 text-sm font-semibold mb-2">Your Signature:</label>
            <input
              type="text"
              id="signature"
              placeholder="Your Signature"
              value={signature}
              onChange={handleSignatureChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button onClick={handleSignAndPay} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Sign & Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyOnline;