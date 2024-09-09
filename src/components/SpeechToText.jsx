import React, { useState, useRef, useEffect } from "react";
import "./SpeechToText.css";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const speechResult = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + speechResult + " ");
        } else {
          interimTranscript += speechResult;
        }
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Error occurred in recognition: " + event.error);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    });
  };

  const handleClearClick = () => {
    setTranscript("");
  };

  return (
    <div className="speech-to-text-container">
      <div className="button-group">
        <button onClick={handleMicClick} className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}>
          {isListening ? "Stop" : "Start"}
        </button>
        <button onClick={handleCopyClick} className="btn btn-secondary" disabled={!transcript}>
          Copy
        </button>
        <button onClick={handleClearClick} className="btn btn-outline" disabled={!transcript}>
          Clear
        </button>
      </div>
      {showCopiedAlert && (
        <div className="alert">
          Copied to clipboard!
        </div>
      )}
      <div className="transcript-container">
        <p className="transcript">{transcript || "Start speaking..."}</p>
      </div>
    </div>
  );
};

export default SpeechToText;