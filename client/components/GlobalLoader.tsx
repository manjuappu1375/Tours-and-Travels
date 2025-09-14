import React from 'react';

const GlobalLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-blue-800 animate-pulse">
          Loading TravelX...
        </h1>
      </div>
    </div>
  );
};

export default GlobalLoader;
