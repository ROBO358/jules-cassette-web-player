import React from 'react';
import './Cassette.css';

const Cassette: React.FC = () => {
  return (
    <div className="cassette">
      <div className="cassette-label">
        <div className="label-header">STEREO</div>
        <div className="label-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <div className="cassette-screws">
        <div className="screw top-left"></div>
        <div className="screw top-right"></div>
        <div className="screw bottom-left"></div>
        <div className="screw bottom-right"></div>
      </div>
      <div className="cassette-tape-window">
        {/* The reels will be visible through here */}
      </div>
    </div>
  );
};

export default Cassette;
