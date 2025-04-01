import React from "react";
import { GAME_CONFIG } from "@/types";

interface GameOverProps {
  score: number;
  onRestart: () => void;
  player: string;
}

const GameOver: React.FC<GameOverProps> = ({ score, player, onRestart }) => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70">
      <div className="text-center mt-5">
        <h2 className="text-xl font-bold mb-4">GAME OVER</h2>
        <p className="text-sm mb-3">
          Score: {Math.floor(score)} ({player || "Unknown"})
        </p>

        {/* Restart button using block-based design */}
        <button
          onClick={onRestart}
          className="relative bg-transparent border-none cursor-pointer mx-auto block"
          style={{ width: `${6 * blockSize}px`, height: `${6 * blockSize}px` }}
        >
          <div
            className="absolute bg-black rounded-full"
            style={{
              width: `${5 * blockSize}px`,
              height: `${5 * blockSize}px`,
              top: `${0.5 * blockSize}px`,
              left: `${0.5 * blockSize}px`,
            }}
          ></div>

          {/* Restart arrow */}
          <div
            className="absolute bg-white"
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
