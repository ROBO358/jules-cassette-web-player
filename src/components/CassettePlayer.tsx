import React, { useState, useRef, DragEvent } from 'react';
import * as mm from 'music-metadata';
import { motion } from 'framer-motion';
import Controls from './Controls';
import Reel from './Reel';
import Chapters from './Chapters';
import Cassette from './Cassette';
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
  const [isCassetteLoaded, setIsCassetteLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const droppedFile = useRef<File | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCassetteLoaded) {
      setErrorMessage(null);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCassetteLoaded || isAnimating) return;

    setErrorMessage(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const acceptedTypes = ['audio/mpeg', 'audio/mp3', 'audio/mpeg3'];
      const isMp3Type = acceptedTypes.includes(file.type);
      const isMp3Extension = file.name.toLowerCase().endsWith('.mp3');

      if (isMp3Type || isMp3Extension) {
        droppedFile.current = file;
        setIsAnimating(true); // Start the animation
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
    // ... (logic remains the same, but we might want to eject the cassette)
    console.error("Error loading audio source.");
    setErrorMessage("Failed to load audio. File may be corrupt or unsupported.");
    setAudioSrc(null);
    setIsCassetteLoaded(false);
    setChapters([]);
  };

  const cassetteVariants = {
    hidden: { y: "-150%", opacity: 0.5 },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const handleAnimationComplete = async () => {
    setIsAnimating(false);
    if (droppedFile.current) {
      const file = droppedFile.current;
      setIsCassetteLoaded(true);
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
    }
  };

  return (
    <div className="cassette-player-wrapper">
      <div
        className="cassette-player"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="cassette-window">
          {isCassetteLoaded ? (
            <div className="reels">
              <Reel isPlaying={isPlaying} />
              <Reel isPlaying={isPlaying} />
            </div>
          ) : (
            <div className="drop-zone">
              {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
              ) : (
                <p>Drag & Drop an MP3 file here</p>
              )}
            </div>
          )}

          {isAnimating && (
            <motion.div
              className="cassette-animation-wrapper"
              variants={cassetteVariants}
              initial="hidden"
              animate="visible"
              onAnimationComplete={handleAnimationComplete}
            >
              <Cassette />
            </motion.div>
          )}

        </div>
        <Controls
          togglePlayPause={togglePlayPause}
          isPlaying={isPlaying}
          disabled={!isCassetteLoaded}
        />
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
      {isCassetteLoaded && chapters.length > 0 && (
        <Chapters chapters={chapters} onChapterClick={handleChapterClick} />
      )}
    </div>
  );
};

export default CassettePlayer;
