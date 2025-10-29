import React from 'react';

const ChatPanel = ({ transcript, isListening, startRecording, stopRecording, language, setLanguage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded-lg mr-4">
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="ml-IN">Malayalam</option>
        </select>
        <p className="text-gray-600">{transcript || "Press the mic to start your order..."}</p>
      </div>
      <button
        onClick={isListening ? stopRecording : startRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM2 9a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ChatPanel;
