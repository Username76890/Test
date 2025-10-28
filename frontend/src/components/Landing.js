import React from 'react';

const Landing = ({ onStartOrder }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Café!</h1>
      <p className="text-lg mb-8">I'm your friendly robot assistant.</p>
      <button
        onClick={onStartOrder}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Order
      </button>
    </div>
  );
};

export default Landing;
