import React, { useState } from 'react';
import ChatPanel from './ChatPanel';

const VoiceInteraction = ({ setTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [language, setLanguage] = useState('en-US');
  const [localTranscript, setLocalTranscript] = useState('');

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
      setLocalTranscript('Listening...');
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
        setLocalTranscript(data.transcript);
      });
  };

  return (
    <ChatPanel
      transcript={localTranscript}
      isListening={recording}
      startRecording={startRecording}
      stopRecording={stopRecording}
      language={language}
      setLanguage={setLanguage}
    />
  );
};

export default VoiceInteraction;
