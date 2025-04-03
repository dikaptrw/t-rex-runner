import React, { useEffect, useRef } from "react";

interface SoundEffectsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  isJumping: boolean;
  score: number;
}

// Audio file paths
const SOUNDS = {
  JUMP: "/sounds/jump.mp3",
  GAME_OVER: "/sounds/game-over.mp3",
  POINT: "/sounds/point.mp3",
} as const;

// Volume levels
const VOLUME = {
  DEFAULT: 0.1,
} as const;

const SoundEffects: React.FC<SoundEffectsProps> = ({
  isPlaying,
  isGameOver,
  isJumping,
  score,
}) => {
  // Refs for audio elements
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const pointSoundRef = useRef<HTMLAudioElement | null>(null);
  const prevScoreRef = useRef(score);

  /**
   * Helper function to play a sound with proper error handling
   */
  const playSound = (soundRef?: React.RefObject<HTMLAudioElement | null>) => {
    if (!soundRef || !soundRef.current) return;

    try {
      soundRef.current.volume = VOLUME.DEFAULT;
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    } catch (error) {
      console.error("Error setting up sound:", error);
    }
  };

  // Handle jump sound
  useEffect(() => {
    if (isJumping && isPlaying) {
      playSound(jumpSoundRef);
    }
  }, [isJumping, isPlaying]);

  // Handle game over sound
  useEffect(() => {
    if (isGameOver) {
      playSound(gameOverSoundRef);
    }
  }, [isGameOver]);

  // Handle point sound at every 100 points milestone
  useEffect(() => {
    const currentMilestone = Math.floor(score / 100);
    const previousMilestone = Math.floor(prevScoreRef.current / 100);

    if (isPlaying && currentMilestone > previousMilestone) {
      playSound(pointSoundRef);
    }

    prevScoreRef.current = score;
  }, [score, isPlaying]);

  return (
    <div aria-hidden="true" style={{ display: "none" }}>
      <audio ref={jumpSoundRef} preload="auto">
        <source src={SOUNDS.JUMP} type="audio/mpeg" />
      </audio>
      <audio ref={gameOverSoundRef} preload="auto">
        <source src={SOUNDS.GAME_OVER} type="audio/mpeg" />
      </audio>
      <audio ref={pointSoundRef} preload="auto">
        <source src={SOUNDS.POINT} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default SoundEffects;
