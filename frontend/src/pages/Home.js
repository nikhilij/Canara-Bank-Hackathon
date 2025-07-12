import React from 'react';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to TrustVault</h1>
    <p className="text-lg text-gray-700 mb-8">A secure platform for consent management, data privacy, and compliance.</p>
    <div className="space-x-4">
      <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</a>
      <a href="/register" className="px-6 py-2 bg-gray-200 text-blue-700 rounded hover:bg-gray-300">Register</a>
    </div>
  </div>
);

export default Home;
