import React from "react";
import { GAME_CONFIG } from "@/types";

interface GameContainerProps {
  isNightMode: boolean;
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({
  isNightMode,
  children,
}) => {
  return (
    <div
      className={`relative overflow-hidden ${
        isNightMode ? "bg-neutral-700" : "bg-white"
      }`}
      style={{
        width: `${GAME_CONFIG.CANVAS_WIDTH}px`,
        height: `${GAME_CONFIG.CANVAS_HEIGHT}px`,
        margin: "0 auto",
        border: isNightMode ? "transparent" : "1px solid #ccc",
      }}
    >
      {children}
    </div>
  );
};

export default GameContainer;
