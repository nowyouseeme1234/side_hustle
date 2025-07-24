import React from 'react';
import * as config from './config';
import {GoogleOAuthProvider} from '@react-oauth/google'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import HomePage from './routes/HomePage';
import BuyaShare from './routes/BuyaShare';
import ShareMyRent from './routes/ShareMyRent';
import './index.css';
import SignupPage from './routes/SignupPage';
import LoginPage from './routes/LoginPage';
import PropertyDetails from './routes/PropertyDetails';
import BuyinPerson from './routes/BuyinPerson';
import BuyOnline from './routes/BuyOnline';


const GOOGLE_CLIENT_ID = '152044918652-sk3igdtud4faui7d437h60gtnpjbb40l.apps.googleusercontent.com';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/buyashare',
      element: <BuyaShare />,
    },
    {
      path: '/sharemyrent',
      element: <ShareMyRent />,
    },
    {
      path: '/propertydetails/:propertyId',
      element: <PropertyDetails />,
    },
    {
      path: '/buyinperson/:propertyId',
      element: <BuyinPerson />,
    },
    {
      path: '/buyonline/:propertyId',
      element: <BuyOnline />,
    },
    
  ]);

  return routes;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your entire application with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);