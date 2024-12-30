import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Our Platform</h1>
      <p className="text-xl text-gray-700">
        {user ? 'Hello 👋' : 'Please sign in to access your account.'}
      </p>
      {user && (
        <p className="mt-4 text-gray-600">
          {user.role === 'ADMIN' 
            ? 'As an admin, you have access to the dashboard. Click on the Dashboard link in the navigation bar to view users.' 
            : 'Thank you for being a valued user of our platform. We hope you enjoy your experience!'}
        </p>
      )}
    </div>
  );
};

export default Home;

