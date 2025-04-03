import React, { useRef } from "react";
import { GAME_CONFIG } from "@/types";
import { cn } from "@/utils";

interface GameOverProps {
  score: number;
  onRestart: () => void;
  player: string;
  isNightMode: boolean;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  player,
  onRestart,
  isNightMode,
}) => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;
  const currentPlayer = useRef(player);

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center bg-opacity-70",
        isNightMode ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      <div className="text-center mt-5">
        <h2 className="text-xl font-bold mb-4">GAME OVER</h2>
        <p className="text-sm mb-3">
          Score: {Math.floor(score)} ({currentPlayer.current})
        </p>

        {/* Restart button using block-based design */}
        <button
          onClick={onRestart}
          className="relative bg-transparent border-none cursor-pointer mx-auto block"
          style={{ width: `${6 * blockSize}px`, height: `${6 * blockSize}px` }}
        >
          <div
            className={cn(
              "absolute rounded-full",
              isNightMode ? "bg-white" : "bg-black"
            )}
            style={{
              width: `${5 * blockSize}px`,
              height: `${5 * blockSize}px`,
              top: `${0.5 * blockSize}px`,
              left: `${0.5 * blockSize}px`,
            }}
          ></div>

          {/* Restart arrow */}
          <div
            className={cn("absolute", isNightMode ? "bg-black" : "bg-white")}
            style={{
              width: `${3 * blockSize}px`,
              height: `${blockSize}px`,
              top: `${2.5 * blockSize}px`,
              left: `${1.5 * blockSize}px`,
              clipPath:
                "polygon(0 0, 75% 0, 75% 40%, 100% 40%, 75% 100%, 75% 60%, 0 60%)",
            }}
          ></div>
        </button>
      </div>
    </div>
  );
};

export default GameOver;
