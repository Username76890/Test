import React from 'react';

const RobotFace = ({ isListening }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-24 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className={`w-6 h-6 rounded-full bg-teal-400 ${isListening ? 'animate-pulse' : ''}`}></div>
        <div className={`w-6 h-6 rounded-full bg-teal-400 ml-4 ${isListening ? 'animate-pulse' : ''}`}></div>
      </div>
    </div>
  );
};

export default RobotFace;
