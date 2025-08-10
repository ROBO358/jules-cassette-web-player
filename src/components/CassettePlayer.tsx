import React, { useState, useRef, DragEvent } from 'react';
import * as mm from 'music-metadata';
import Controls from './Controls';
import Reel from './Reel';
import Chapters from './Chapters';
import './CassettePlayer.css';

interface Chapter {
  startTime: number;
  title: string;
}

const CassettePlayer: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null); // Clear error message when user starts dragging
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const acceptedTypes = ['audio/mpeg', 'audio/mp3', 'audio/mpeg3'];
      const isMp3Type = acceptedTypes.includes(file.type);
      const isMp3Extension = file.name.toLowerCase().endsWith('.mp3');

      if (isMp3Type || isMp3Extension) {
        const fileUrl = URL.createObjectURL(file);
        setAudioSrc(fileUrl);

        try {
          const metadata = await mm.parseBlob(file);
          if (metadata.common.chapters && metadata.common.chapters.length > 0) {
            const parsedChapters = metadata.common.chapters.map(ch => ({
              startTime: ch.startTime,
              title: ch.title ?? `Chapter at ${ch.startTime}s`
            }));
            setChapters(parsedChapters);
          } else {
            setChapters([]);
          }
        } catch (error) {
          console.error('Error parsing metadata:', error);
          setChapters([]);
        }

      } else {
        setErrorMessage('Please drop a valid MP3 file.');
      }
    }
  };

  const togglePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error attempting to play audio:", error);
          setErrorMessage("Could not play audio. File might be corrupt.");
        }
      }
    }
  };

  const handleChapterClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleAudioError = () => {
    console.error("Error loading audio source.");
    setErrorMessage("Failed to load audio. File may be corrupt or unsupported.");
    setAudioSrc(null); // Reset the player
    setChapters([]);
  };

  return (
    <div
      className="cassette-player-wrapper"
    >
      <div
        className="cassette-player"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!audioSrc ? (
          <div className="drop-zone">
            {errorMessage ? (
              <p className="error-message">{errorMessage}</p>
            ) : (
              <p>Drag & Drop an MP3 file here</p>
            )}
          </div>
        ) : (
          <>
            <div className="cassette-window">
              <div className="reels">
                <Reel isPlaying={isPlaying} />
                <Reel isPlaying={isPlaying} />
              </div>
            </div>
            <Controls
              togglePlayPause={togglePlayPause}
              isPlaying={isPlaying}
            />
          </>
        )}
        {audioSrc && (
          <audio
            ref={audioRef}
            src={audioSrc}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleAudioError}
          />
        )}
      </div>
      {chapters.length > 0 && (
        <Chapters chapters={chapters} onChapterClick={handleChapterClick} />
      )}
    </div>
  );
};

export default CassettePlayer;
