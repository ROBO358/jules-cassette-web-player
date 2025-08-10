import React from 'react';
import { motion } from 'framer-motion';
import './Reel.css';

interface ReelProps {
  isPlaying: boolean;
}

const Reel: React.FC<ReelProps> = ({ isPlaying }) => {
  return (
    <motion.div
      className="reel"
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{
        loop: Infinity,
        ease: "linear",
        duration: 2
      }}
    >
      <div className="spoke"></div>
      <div className="spoke"></div>
      <div className="spoke"></div>
      <div className="spoke"></div>
      <div className="spoke"></div>
      <div className="spoke"></div>
    </motion.div>
  );
};

export default Reel;
