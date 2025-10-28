import React, { useState } from 'react';

const VoiceInteraction = ({ setTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [language, setLanguage] = useState('en-US');

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    mediaRecorder.ondataavailable = (e) => {
      const audioBlob = new Blob([e.data], { type: 'audio/webm' });
      sendAudioForTranscription(audioBlob);
    };
  };

  const sendAudioForTranscription = (audioBlob) => {
    fetch('http://localhost:3001/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/webm',
        'X-Language-Code': language,
      },
      body: audioBlob,
    })
      .then((res) => res.json())
      .then((data) => {
        setTranscript(data.transcript);
      });
  };

  return (
    <div>
      <p>Microphone: {recording ? 'on' : 'off'}</p>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded">
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="ml-IN">Malayalam</option>
      </select>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
    </div>
  );
};

export default VoiceInteraction;
