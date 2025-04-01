import React, { useEffect, useRef, useCallback } from "react";

/**
 * Defines the structure for the sound sources map.
 * Keys are sound event names (e.g., 'jump', 'gameOver'), values are the file paths.
 */
interface SoundSources {
  jump?: string;
  land?: string;
  duck?: string;
  point?: string;
  gameOver?: string;
  gameStart?: string;
  // Add other sound event keys and paths as needed
}

/**
 * Props for the EnhancedSoundEffects component.
 */
interface EnhancedSoundEffectsProps {
  /** Whether the game is currently active (sounds should play). */
  isPlaying: boolean;
  /** Whether the game has just ended. */
  isGameOver: boolean;
  /** Whether the player character is currently jumping. */
  isJumping: boolean;
  /** Whether the player character is currently ducking. */
  isDucking: boolean;
   /** Current game score, used for point milestones. */
  score: number;
  /** Master volume for all sound effects (0.0 to 1.0). Defaults to 0.5 */
  volume?: number;
  /** Whether all sound effects should be muted. Defaults to false. */
  isMuted?: boolean;
  /** An object mapping sound event keys to their audio file paths. */
  soundSources: SoundSources;
  /** The score interval at which the 'point' sound should play. Defaults to 100. */
  pointInterval?: number;
}

// Default sound sources if none are provided (optional, provides fallback)
const defaultSoundSources: SoundSources = {
  jump: "/sounds/jump.mp3",
  land: "/sounds/land.mp3", // Assuming you have a landing sound
  duck: "/sounds/duck.mp3", // Assuming you have a ducking sound
  point: "/sounds/point.mp3",
  gameOver: "/sounds/game-over.mp3",
  gameStart: "/sounds/start.mp3", // Assuming you have a game start sound
};

const EnhancedSoundEffects: React.FC<EnhancedSoundEffectsProps> = ({
  isPlaying,
  isGameOver,
  isJumping,
  isDucking,
  score,
  volume = 0.5, // Default volume
  isMuted = false, // Default mute state
  soundSources = defaultSoundSources, // Use defaults if none provided
  pointInterval = 100, // Default point interval
}) => {
  // Use a single ref to hold a map of audio elements
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Refs to track previous states for triggering sounds correctly
  const prevScoreRef = useRef(0);
  const prevIsPlayingRef = useRef(false);
  const prevIsJumpingRef = useRef(false);
  const prevIsDuckingRef = useRef(false);

  /**
   * Helper function to play a sound by its key.
   * Handles volume, muting, resetting playback time, and error catching.
   */
  const playSound = useCallback(
    (key: keyof SoundSources) => {
      if (isMuted) return; // Don't play if muted

      const audioEl = audioRefs.current[key];
      if (audioEl) {
        try {
            // Ensure volume is within valid range
           audioEl.volume = Math.max(0, Math.min(1, volume));
           audioEl.currentTime = 0; // Reset playback to the beginning
           // play() returns a Promise which should be handled
           audioEl.play().catch((error) => {
             // Log errors, potentially filtering common browser interruptions
             if (error.name !== 'AbortError') {
               console.error(`Error playing sound "${key}":`, error);
             }
           });
        } catch (e) {
             console.error(`Failed to play sound "${key}":`, e)
        }
      } else {
        // console.warn(`Sound key "${key}" not found or audio element not ready.`);
      }
    },
    [volume, isMuted] // Dependencies: volume and mute state
  );

  // Effect for Game Start sound
  useEffect(() => {
    if (isPlaying && !prevIsPlayingRef.current && !isGameOver) {
        // Only play start sound when transitioning from not playing to playing
        // And ensure it's not immediately after a game over (e.g., restarting)
        // Debounce or add a small delay if needed to prevent sound overlap on quick restarts
      playSound("gameStart");
    }
    prevIsPlayingRef.current = isPlaying;
  }, [isPlaying, isGameOver, playSound]);

  // Effect for Jump and Land sounds
  useEffect(() => {
    if (!isPlaying) return; // Don't play sounds if game isn't active

    if (isJumping && !prevIsJumpingRef.current) {
      playSound("jump");
    } else if (!isJumping && prevIsJumpingRef.current) {
      // Play landing sound when jump finishes
      playSound("land");
    }
    prevIsJumpingRef.current = isJumping;
  }, [isJumping, isPlaying, playSound]);

    // Effect for Ducking sound
  useEffect(() => {
    if (!isPlaying) return;

    if (isDucking && !prevIsDuckingRef.current) {
      playSound("duck");
    }
     // Optional: Add sound when stop ducking?
     // else if (!isDucking && prevIsDuckingRef.current) {
     //   playSound("stopDucking"); // If you have such a sound
     // }
    prevIsDuckingRef.current = isDucking;
  }, [isDucking, isPlaying, playSound]);


  // Effect for Game Over sound
  useEffect(() => {
    if (isGameOver) {
      // Optional: Stop other sounds before playing game over?
      // Object.values(audioRefs.current).forEach(audio => audio?.pause());
      playSound("gameOver");
    }
  }, [isGameOver, playSound]);

  // Effect for Point milestone sound
  useEffect(() => {
    if (
      isPlaying &&
      score > 0 && // Only trigger if score is positive
      pointInterval > 0 && // Ensure interval is valid
      Math.floor(score / pointInterval) > Math.floor(prevScoreRef.current / pointInterval)
    ) {
      playSound("point");
    }
    // Always update previous score regardless of sound playback
    prevScoreRef.current = score;
  }, [score, isPlaying, pointInterval, playSound]);

  // Effect to update previous states when isPlaying changes to false (e.g., pause)
   useEffect(() => {
     if (!isPlaying) {
       prevIsJumpingRef.current = false;
       prevIsDuckingRef.current = false;
       // prevIsPlayingRef is handled in its own effect
     }
   }, [isPlaying]);


  return (
    // Render audio elements dynamically based on provided soundSources
    // Keep them hidden as they are controlled programmatically
    <div className="sound-effects-container" style={{ display: "none" }} aria-hidden="true">
      {Object.entries(soundSources).map(([key, src]) => {
        if (!src) return null; // Skip if no source provided for this key
        return (
          <audio
            key={key}
            ref={(el) => (audioRefs.current[key] = el)}
            src={src}
            preload="auto" // Preload sounds for better performance
          >
            {/* Provide fallback content for browsers that don't support the audio tag */}
            Your browser does not support the audio element. ({key})
          </audio>
        );
      })}
    </div>
  );
};

export default EnhancedSoundEffects;
