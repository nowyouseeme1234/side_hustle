import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check for user data in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleListPropertyButton = () => {
    if (loggedInUser) {
      navigate('/sharemyrent');
    } else {
      navigate('/signup?redirect=/sharemyrent');
    }
  };
  const handleExplorePropertyButton = () => {
    navigate('/buyashare');
  };

  const handleSignupButton = () => {
    navigate('/signup');
  };

  const handleLoginButton = () => {
    navigate('/login');
  };

  const handleLogoutButton = () => {
    localStorage.removeItem('user'); // Clear user data on logout
    setLoggedInUser(null);
    navigate('/');
  };


  return (
    <div className='text-white bg-black min-h-screen flex flex-col'>
      {/* Navigation Bar */}
      <nav className='bg-gray-900 py-4 px-6 md:px-12 lg:px-24 flex justify-between items-center'>
        <button className='flex items-center' onClick={navigate('/')}><img src="Millionaire.png" alt="" className='size-12 mr-2 rounded-full'/>Share My Rent</button>
        <div className='flex gap-4 items-center'>
          {loggedInUser ? (
            <>
              <span className="text-gray-300 text-sm">Logged in as {loggedInUser.username}</span>
              <button
                className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm'
                onClick={handleLogoutButton}
              >
                Log Out
              </button>
            </>
          ) : (
            <>

              <button
                className='bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm'
                // onClick={handleLoginButton}
              >
                Log In
              </button>
              <button
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm'
                // onClick={handleSignupButton}
              >
                Sign Up
              </button>
              
            </>
          )}
        </div>
      </nav>



      {/* Hero Section */}
      <section className='bg-gradient-to-br from-gray-900 to-black py-20 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
          Unlock Your Property's Potential. Discover Investment Opportunities.
        </h1>
        <p className='text-lg md:text-xl text-gray-400 mb-10'>
          Introducing a revolutionary platform connecting homeowners looking to sell a portion of their rental income with investors seeking stable, recurring returns.
        </p>
        <div className='flex flex-col md:flex-row gap-4'>
          <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' 
          // onClick={handleListPropertyButton}
          >
            List Your Property
          </button>
          <button className='bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2' 
          // onClick={handleExplorePropertyButton}
          >
            Explore Properties
          </button>
        </div>

        {/* Join waiting list button */}

        <div className='mt-14 cursor-pointer px-4'>
          <a href="https://t.me/+k7im0BTNmwxmZDc8" target="_blank">
            <button className='animated-border-button w-full h-16 sm:h-20 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl cursor-pointer'>
              CLICK HERE TO JOIN OUR <span className='text-blue-400'>TELEGRAM</span> WAITING LIST
            </button>
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-16 md:py-24 px-6 md:px-12 lg:px-24'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-semibold mb-8 text-white'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* For Homeowners */}
            <div className='bg-gray-800 rounded-lg p-8'>
              <h3 className='text-xl font-semibold mb-4 text-indigo-400'>For Homeowners</h3>
              <ul className='list-disc list-inside text-gray-300'>
                <li className='mb-2'>List your rental property and the percentage of income you're offering.</li>
                <li className='mb-2'>Connect with interested investors.</li>
                <li>Receive upfront capital while retaining ownership of your property.</li>
              </ul>
            </div>

            {/* The Platform */}
            <div className='bg-gray-800 rounded-lg p-8'>
              <h3 className='text-xl font-semibold mb-4 text-white'>The Platform</h3>
              <p className='text-gray-300'>
                We provide a secure and transparent marketplace for homeowners and investors to connect. Our platform facilitates the listing, discovery, and agreement process, ensuring a smooth experience for everyone.
              </p>
            </div>

            {/* For Investors */}
            <div className='bg-gray-800 rounded-lg p-8'>
              <h3 className='text-xl font-semibold mb-4 text-teal-400'>For Investors</h3>
              <ul className='list-disc list-inside text-gray-300'>
                <li className='mb-2'>Browse a variety of rental properties.</li>
                <li className='mb-2'>Invest in a portion of their stable monthly income.</li>
                <li>Diversify your portfolio with real estate-backed returns.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='bg-gray-900 py-16 md:py-24 px-6 md:px-12 lg:px-24 text-center'>
        <h2 className='text-3xl md:text-4xl font-semibold mb-8 text-white'>Ready to Get Started?</h2>
        <p className='text-lg md:text-xl text-gray-400 mb-10'>
          Join our community of homeowners and investors today and unlock new possibilities.
        </p>
        <div className='flex justify-center gap-4'>
          <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' 
          // onClick={handleListPropertyButton}
          >
            List Your Property
          </button>
          <button className='bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2' 
          // onClick={handleExplorePropertyButton}
          >
            Explore Properties
          </button>
        </div>

        {/* Join waiting list button */}
         <div className='mt-14 cursor-pointer px-4'>
          <a href="https://t.me/+k7im0BTNmwxmZDc8" target="_blank">
            <button className='animated-border-button w-full h-16 sm:h-20 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl cursor-pointer'>
              CLICK HERE TO JOIN OUR <span className='text-blue-400'>TELEGRAM</span> WAITING LIST
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 py-8 text-center text-gray-500'>
        <p>&copy; {new Date().getFullYear()} Share My Rent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;