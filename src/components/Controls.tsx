import React from 'react';
import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, togglePlayPause, disabled }) => {
  return (
    <div className="controls">
      <button className="control-button" title="Rewind (not implemented)" disabled={disabled}>{'<<'}</button>
      <button className="control-button play-pause" onClick={togglePlayPause} disabled={disabled}>
        {isPlaying ? '❚❚' : '▶'}
      </button>
      <button className="control-button" title="Fast-Forward (not implemented)" disabled={disabled}>{'>>'}</button>
    </div>
  );
};

export default Controls;
