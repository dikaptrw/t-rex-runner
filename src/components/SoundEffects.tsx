import React, { memo, useCallback, useEffect, useRef } from "react";

interface SoundEffectsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  isJumping: boolean;
  isMuted?: boolean;
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
  MUTED: 0,
} as const;

const SoundEffects: React.FC<SoundEffectsProps> = ({
  isPlaying,
  isGameOver,
  isJumping,
  isMuted = false,
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
  const playSound = useCallback(
    (soundRef: React.RefObject<HTMLAudioElement | null>) => {
      if (!soundRef || !soundRef.current || isMuted) return;

      try {
        soundRef.current.volume = VOLUME.DEFAULT;
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
      } catch (error) {
        console.error("Error setting up sound:", error);
      }
    },
    [isMuted]
  );

  // Update volume when mute state changes
  useEffect(() => {
    const volume = isMuted ? VOLUME.MUTED : VOLUME.DEFAULT;

    [jumpSoundRef, gameOverSoundRef, pointSoundRef].forEach((ref) => {
      if (ref.current) {
        ref.current.volume = volume;
      }
    });
  }, [isMuted]);

  // Handle jump sound
  useEffect(() => {
    if (isJumping && isPlaying) {
      playSound(jumpSoundRef);
    }
  }, [isJumping, isPlaying, playSound]);

  // Handle game over sound
  useEffect(() => {
    if (isGameOver) {
      playSound(gameOverSoundRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  // Handle point sound at every 100 points milestone
  useEffect(() => {
    const currentMilestone = Math.floor(score / 100);
    const previousMilestone = Math.floor(prevScoreRef.current / 100);

    if (isPlaying && currentMilestone > previousMilestone) {
      playSound(pointSoundRef);
    }

    prevScoreRef.current = score;
  }, [score, isPlaying, isMuted, playSound]);

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

export default memo(SoundEffects);
