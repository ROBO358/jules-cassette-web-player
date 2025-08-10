import React from 'react';
import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, togglePlayPause }) => {
  return (
    <div className="controls">
      <button className="control-button" title="Rewind (not implemented)">{'<<'}</button>
      <button className="control-button play-pause" onClick={togglePlayPause}>
        {isPlaying ? '❚❚' : '▶'}
      </button>
      <button className="control-button" title="Fast-Forward (not implemented)">{'>>'}</button>
    </div>
  );
};

export default Controls;
