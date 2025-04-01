import React, { useState, useEffect } from 'react';
import EnhancedSoundEffects from './EnhancedSoundEffects'; // Adjust path

function GameComponent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6); // Example volume state

  // Define your sound paths
  const myGameSounds: SoundSources = {
    jump: '/assets/audio/player-jump.wav',
    land: '/assets/audio/player-land.ogg',
    duck: '/assets/audio/player-duck.mp3',
    point: '/assets/audio/score-100.wav',
    gameOver: '/assets/audio/game-over-tune.mp3',
    gameStart: '/assets/audio/level-start.mp3',
  };

  // Simulate game logic (replace with your actual game loop/event handlers)
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameLoop = setInterval(() => {
      setScore(prev => prev + 1);
      // Simulate random jumps/ducks for testing
      if (Math.random() < 0.01 && !isJumping) {
         setIsJumping(true);
         setTimeout(() => setIsJumping(false), 300); // Jump duration
      }
       if (Math.random() < 0.01 && !isDucking) {
         setIsDucking(true);
         setTimeout(() => setIsDucking(false), 500); // Duck duration
       }
    }, 50); // Update score interval

     // Simulate game over
     const gameOverTimer = setTimeout(() => {
       setIsGameOver(true);
       setIsPlaying(false);
     }, 20000); // Game lasts 20 seconds

    return () => {
      clearInterval(gameLoop);
      clearTimeout(gameOverTimer);
    }
  }, [isPlaying, isGameOver, isJumping, isDucking]);

  const startGame = () => {
      setScore(0);
      setIsGameOver(false);
      setIsJumping(false);
      setIsDucking(false);
      setIsPlaying(true); // This will trigger the gameStart sound
  }

  return (
    <div>
      <h1>My Game</h1>
      <p>Score: {score}</p>
      {!isPlaying && <button onClick={startGame}>Start Game</button>}
      {isGameOver && <p>Game Over!</p>}

       {/* Control Volume/Mute */}
       <label>
           Volume:
           <input
             type="range"
             min="0"
             max="1"
             step="0.05"
             value={volume}
             onChange={(e) => setVolume(parseFloat(e.target.value))}
             disabled={muted}
           />
        </label>
       <button onClick={() => setMuted(!muted)}>
         {muted ? 'Unmute' : 'Mute'} Sounds
       </button>


      {/* Render the sound effects component */}
      <EnhancedSoundEffects
        isPlaying={isPlaying}
        isGameOver={isGameOver}
        isJumping={isJumping}
        isDucking={isDucking}
        score={score}
        volume={volume}
        isMuted={muted}
        soundSources={myGameSounds}
        pointInterval={100} // Optional: default is 100
      />

      {/* Display game state for debugging */}
      <div>
        <p>isPlaying: {isPlaying.toString()}</p>
        <p>isJumping: {isJumping.toString()}</p>
        <p>isDucking: {isDucking.toString()}</p>
      </div>
    </div>
  );
}

export default GameComponent;
