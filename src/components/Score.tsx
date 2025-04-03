import { cn } from "@/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ScoreProps {
  score: number;
  highScore: number;
  player?: string;
  highScorePlayer?: string;
  isNightMode?: boolean;
  isPlaying?: boolean;
  setPlayer?: (name: string) => void;
}

const MAX_PLAYER_NAME_LENGTH = 10;
export const DEFAULT_PLAYER_NAME = "Anonym";

const Score: React.FC<ScoreProps> = ({
  score,
  highScore,
  highScorePlayer,
  isNightMode = false,
  player,
  isPlaying,
  setPlayer,
}) => {
  // Format score with leading zeros
  const formatScore = (score: number): string => {
    return score.toString().padStart(5, "0");
  };

  const formattedScore = formatScore(Math.floor(score));
  const formattedHighScore = formatScore(Math.floor(highScore));
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (hiddenSpanRef.current) {
      setWidth(hiddenSpanRef.current.offsetWidth - 4); // Add some padding
    }
  }, [player]);

  const savePlayerName = useCallback(() => {
    setPlayer?.(player || DEFAULT_PLAYER_NAME);
  }, [player, setPlayer]);

  useEffect(() => {
    if (isPlaying && !player) {
      savePlayerName();
    }
  }, [isPlaying, player, savePlayerName]);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Limit length client-side for immediate feedback
      const value = e.target.value.slice(0, MAX_PLAYER_NAME_LENGTH);
      setPlayer?.(value);
    },
    [setPlayer]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation(); // Prevent game controls from firing
      if (e.key === "Enter") {
        savePlayerName();
        e.currentTarget.blur(); // Remove focus after Enter
      }
    },
    [savePlayerName]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation(); // Prevent clicks from affecting game
      savePlayerName();
    },
    [savePlayerName]
  );

  const handleInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation(); // Prevent clicks from affecting game
    },
    []
  );

  const handleInputTouch = useCallback(
    (e: React.TouchEvent<HTMLInputElement>) => {
      e.stopPropagation(); // Prevent touches from affecting game
    },
    []
  );

  return (
    <div
      id="scoreWrapper"
      className={`absolute z-[1] right-4 top-4 left-4 font-mono text-lg ${
        isNightMode ? "text-white" : "text-black"
      }`}
      style={{ fontFamily: "monospace" }}
    >
      <div className="flex justify-between gap-4">
        <label className="flex items-center gap-2">
          <span>Player:</span>

          {/* hidden span for input width calculation */}
          <span
            ref={hiddenSpanRef}
            className="absolute invisible whitespace-pre px-2"
          >
            {player || " "}
          </span>

          <input
            ref={inputRef}
            type="text"
            placeholder="Name"
            disabled={isPlaying}
            value={player}
            className="border-b focus:outline-none py-0 px-1 min-w-[50px] max-w-[250px]"
            style={{ width }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            onTouchStart={handleInputTouch}
            onChange={handleOnChange}
          />
        </label>

        <div className="flex gap-2">
          <div className={cn(isNightMode ? "text-gray-400" : "text-gray-500")}>
            HI
          </div>
          <div>
            {formattedHighScore}
            {highScorePlayer && (
              <span className="text-sm">({highScorePlayer})</span>
            )}
          </div>
          <div
            className={cn(
              "mx-2",
              isNightMode ? "text-yellow-400" : "text-black"
            )}
          >
            {formattedScore}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
