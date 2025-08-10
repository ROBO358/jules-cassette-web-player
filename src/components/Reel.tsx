import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Reel.css';

interface ReelProps {
  isPlaying: boolean;
}

const Reel: React.FC<ReelProps> = ({ isPlaying }) => {
  const controls = useAnimation();
  const rotationRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      // Start spinning from the last known rotation
      controls.start({
        rotate: rotationRef.current + 360,
        transition: {
          loop: Infinity,
          ease: "linear",
          duration: 2,
        },
      });
    } else {
      // Stop the animation
      controls.stop();
    }
  }, [isPlaying, controls]);

  // Track the rotation value as the animation progresses
  const handleUpdate = (latest: { rotate: number }) => {
    rotationRef.current = latest.rotate;
  };

  return (
    <motion.div
      className="reel"
      animate={controls}
      onUpdate={handleUpdate}
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
