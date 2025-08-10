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
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'audio/mpeg') {
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
        alert('Please drop an MP3 file.');
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleChapterClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
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
            <p>Drag & Drop an MP3 file here</p>
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
        {audioSrc && <audio ref={audioRef} src={audioSrc} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />}
      </div>
      {chapters.length > 0 && (
        <Chapters chapters={chapters} onChapterClick={handleChapterClick} />
      )}
    </div>
  );
};

export default CassettePlayer;
