import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Traditional Login Handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else if (response.status === 401) {
        setError(data.message || 'Login failed: Invalid credentials.');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login Handler ---
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google Sign-in Success (Login Page):', credentialResponse);
    console.log('Frontend (Login Page): Google ID Token received:', credentialResponse.credential);
    setError(null);
    setMessage('Logging in with Google...');
    setLoading(true);

    try {
      const backendResponse = await fetch(`${API_BASE_URL || 'http://localhost:5000'}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        console.log('Frontend (Login Page): Google Auth Success:', data);
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        console.error('Frontend (Login Page): Google Auth Error (backend):', data.message);
        setError(data.message || 'Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Frontend (Login Page): Network or unexpected error during Google Auth:', error);
      setError('An error occurred during Google login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-in Failed (Login Page)');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24 flex items-center justify-center relative"> {/* Added 'relative' here */}
      {/* Go back to Homepage Button - TOP LEFT */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline z-10"
        disabled={loading} // Disable if loading
      >
        ← Home
      </button>

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-6 text-teal-400 text-center">Log In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          <div>
            <label htmlFor="username" className="block text-gray-200 text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-200 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* OR Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">OR</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;