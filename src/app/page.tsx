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
import { DinoState } from "@/types";

export default function Home() {
  const {
    gameState,
    dino,
    obstacles,
    clouds,
    isNightMode,
    startGame,
    setPlayer,
  } = useGameLogic();

  const handleStartGame = () => {
    if (!gameState.isPlaying && !gameState.isGameOver) {
      startGame();
    }
  };

  return (
    <main
      id="gameWrapper"
      className="flex min-h-[calc(100dvh-env(safe-area-inset-bottom))] flex-col items-center justify-center p-4"
    >
      <div className="scale-[42%] sm:scale-[60%] md:scale-[80%] lg:scale-100">
        <h1 className="text-center text-3xl font-bold mb-6">T-Rex Runner</h1>

        <div className="relative">
          <GameContainer isNightMode={isNightMode} gameState={gameState}>
            {/* Dino character */}
            <Dino
              state={dino.state}
              x={dino.x}
              y={dino.y}
              width={dino.width}
              height={dino.height}
              isNightMode={isNightMode}
            />

            {/* Ground */}
            <Ground isNightMode={isNightMode} />

            {/* Obstacles */}
            {obstacles.map((obstacle, index) => (
              <Obstacle
                key={`obstacle-${index}`}
                type={obstacle.type}
                x={obstacle.x}
                y={obstacle.y}
                width={obstacle.width}
                height={obstacle.height}
                isNightMode={isNightMode}
              />
            ))}

            {/* Clouds */}
            {clouds.map((cloud, index) => (
              <Cloud
                key={`cloud-${index}`}
                x={cloud.x}
                y={cloud.y}
                isNightMode={isNightMode}
              />
            ))}

            {/* Score */}
            <Score
              score={gameState.score}
              highScore={gameState.highScore}
              isNightMode={isNightMode}
              player={gameState.player}
              highScorePlayer={gameState.highScorePlayer}
              setPlayer={setPlayer}
            />

            {/* Game over screen */}
            {gameState.isGameOver && (
              <GameOver
                player={gameState.player}
                score={gameState.score}
                onRestart={startGame}
              />
            )}

            {/* Start game instructions */}
            {!gameState.isPlaying && !gameState.isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white bg-opacity-80 p-4 rounded">
                  <p className="mb-4 text-base">Press SPACE to start</p>
                  <button
                    onClick={handleStartGame}
                    className="px-5 py-3 bg-black text-white rounded text-sm hover:bg-gray-800"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}
          </GameContainer>

          {/* Game controls instructions */}
          <div className="mt-6 text-center text-xs">
            <p>Controls: SPACE/UP/TAP = Jump, DOWN/HOLD = Duck</p>
          </div>

          {/* Sound effects */}
          <SoundEffects
            isPlaying={gameState.isPlaying}
            isGameOver={gameState.isGameOver}
            isDucking={dino.state === DinoState.DUCKING}
            isJumping={dino.state === DinoState.JUMPING}
            score={gameState.score}
          />
        </div>
      </div>
    </main>
  );
}
