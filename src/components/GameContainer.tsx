import React from "react";
import { GAME_CONFIG, GameState } from "@/types";

interface GameContainerProps {
  isNightMode: boolean;
  children: React.ReactNode;
  gameState: GameState;
}

const GameContainer = ({
  isNightMode,
  children,
  gameState,
}: GameContainerProps) => {
  return (
    <div
      className={`relative overflow-hidden ${
        isNightMode ? "bg-black" : "bg-white"
      }`}
      style={{
        width: `${GAME_CONFIG.CANVAS_WIDTH}px`,
        height: `${GAME_CONFIG.CANVAS_HEIGHT}px`,
        margin: "0 auto",
        border:
          isNightMode && !gameState.isGameOver
            ? "transparent"
            : "1px solid #ccc",
      }}
    >
      {children}
    </div>
  );
};

export default GameContainer;
