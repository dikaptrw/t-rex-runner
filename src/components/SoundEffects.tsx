import React, { useEffect, useRef } from 'react';

interface SoundEffectsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  isDucking: boolean;
  isJumping: boolean;
  score: number;
}

const SoundEffects: React.FC<SoundEffectsProps> = ({ 
  isPlaying, 
  isGameOver, 
  isDucking, 
  isJumping,
  score 
}) => {
  // References to audio elements
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const pointSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Track previous score to detect milestone points
  const prevScoreRef = useRef(0);
  
  // Play jump sound
  useEffect(() => {
    if (isJumping && jumpSoundRef.current && isPlaying) {
      jumpSoundRef.current.currentTime = 0;
      jumpSoundRef.current.play().catch(e => console.error("Error playing jump sound:", e));
    }
  }, [isJumping, isPlaying]);
  
  // Play game over sound
  useEffect(() => {
    if (isGameOver && gameOverSoundRef.current) {
      gameOverSoundRef.current.currentTime = 0;
      gameOverSoundRef.current.play().catch(e => console.error("Error playing game over sound:", e));
    }
  }, [isGameOver]);
  
  // Play point sound at every 100 points
  useEffect(() => {
    if (isPlaying && pointSoundRef.current && Math.floor(score / 100) > Math.floor(prevScoreRef.current / 100)) {
      pointSoundRef.current.currentTime = 0;
      pointSoundRef.current.play().catch(e => console.error("Error playing point sound:", e));
    }
    prevScoreRef.current = score;
  }, [score, isPlaying]);
  
  return (
    <div className="hidden">
      {/* Audio elements */}
      <audio ref={jumpSoundRef} preload="auto">
        <source src="/sounds/jump.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={gameOverSoundRef} preload="auto">
        <source src="/sounds/game-over.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={pointSoundRef} preload="auto">
        <source src="/sounds/point.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default SoundEffects;
