import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load last playing audio file if available
    const lastPlayingIndex = localStorage.getItem('lastPlayingIndex');
    if (lastPlayingIndex !== null && lastPlayingIndex !== undefined) {
      setNowPlayingIndex(parseInt(lastPlayingIndex));
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Save last playing audio file
    localStorage.setItem('lastPlayingIndex', nowPlayingIndex.toString());
  }, [nowPlayingIndex]);

  useEffect(() => {
    // Set audio source when playlist changes
    if (playlist.length > 0) {
      if (audioRef.current) {
        audioRef.current.src = playlist[nowPlayingIndex];
        audioRef.current.play();
      }
    }
  }, [playlist, nowPlayingIndex]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlaylist([...playlist, URL.createObjectURL(file)]);
    }
  };

  const handleAudioEnded = () => {
    setNowPlayingIndex((prevIndex) => {
      if (prevIndex + 1 < playlist.length) {
        return prevIndex + 1;
      } else {
        return 0; // Loop back to the beginning of the playlist
      }
    });
  };

  const handlePlay = (index) => {
    setNowPlayingIndex(index);
  };

  const handleNext = () => {
    setNowPlayingIndex((prevIndex) => {
      if (prevIndex + 1 < playlist.length) {
        return prevIndex + 1;
      } else {
        return 0; // Loop back to the beginning of the playlist
      }
    });
  };

  const handlePrevious = () => {
    setNowPlayingIndex((prevIndex) => {
      if (prevIndex - 1 >= 0) {
        return prevIndex - 1;
      } else {
        return playlist.length - 1; // Go to the end of the playlist if at the beginning
      }
    });
  };

  return (
    <div className="container">
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <div className="playlist">
        {playlist.map((file, index) => (
          <div key={index}>
            <button onClick={() => handlePlay(index)}>
              Play {index + 1}
            </button>
          </div>
        ))}
      </div>
      <div className="controls">
        {playlist.length > 0 && (
          <>
            <audio
              ref={audioRef}
              controls
              autoPlay
              src={playlist[nowPlayingIndex]}
              onEnded={handleAudioEnded}
            />
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
