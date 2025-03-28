"use client";

import React from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import GameContainer from "@/components/GameContainer";
import Dino from "@/components/Dino";
import Ground from "@/components/Ground";
import Obstacle from "@/components/Obstacle";
import Cloud from "@/components/Cloud";
import Score from "@/components/Score";
import GameOver from "@/components/GameOver";
import SoundEffects from "@/components/SoundEffects";

export default function Home() {
  const { gameState, dino, obstacles, clouds, isNightMode, startGame } =
    useGameLogic();

  const handleStartGame = () => {
    if (!gameState.isPlaying && !gameState.isGameOver) {
      startGame();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">T-Rex Runner</h1>

      <div className="relative">
        <GameContainer isNightMode={isNightMode}>
          {/* Dino character */}
          <Dino state={dino.state} y={dino.y} />

          {/* Ground */}
          <Ground />

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <Obstacle
              key={`obstacle-${index}`}
              type={obstacle.type}
              x={obstacle.x}
            />
          ))}

          {/* Clouds */}
          {clouds.map((cloud, index) => (
            <Cloud key={`cloud-${index}`} x={cloud.x} y={cloud.y} />
          ))}

          {/* Score */}
          <Score
            score={gameState.score}
            highScore={gameState.highScore}
            isNightMode={isNightMode}
          />

          {/* Game over screen */}
          {gameState.isGameOver && (
            <GameOver score={gameState.score} onRestart={startGame} />
          )}

          {/* Start game instructions */}
          {!gameState.isPlaying && !gameState.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white bg-opacity-80 p-4 rounded">
                <p className="mb-2">Press SPACE to start</p>
                <button
                  onClick={handleStartGame}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}
        </GameContainer>

        {/* Game controls instructions */}
        <div className="mt-4 text-center">
          <p>Controls: SPACE/UP = Jump, DOWN = Duck</p>
        </div>

        {/* Sound effects */}
        <SoundEffects
          isPlaying={gameState.isPlaying}
          isGameOver={gameState.isGameOver}
          isDucking={dino.state === "ducking"}
          isJumping={dino.state === "jumping"}
          score={gameState.score}
        />
      </div>
    </main>
  );
}
