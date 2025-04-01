import React, { useEffect, useRef, useState } from "react";

interface ScoreProps {
  score: number;
  highScore: number;
  player?: string;
  highScorePlayer?: string;
  isNightMode?: boolean;
  setPlayer?: (name: string) => void;
}

const Score: React.FC<ScoreProps> = ({
  score,
  highScore,
  highScorePlayer,
  isNightMode = false,
  player,
  setPlayer,
}) => {
  // Format score with leading zeros
  const formatScore = (score: number): string => {
    return score.toString().padStart(5, "0");
  };

  const formattedScore = formatScore(Math.floor(score));
  const formattedHighScore = formatScore(Math.floor(highScore));
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth - 4); // Add some padding
    }
  }, [player]);

  return (
    <div
      className={`absolute z-[1] right-4 top-4 left-4 font-mono text-lg ${
        isNightMode ? "text-white" : "text-black"
      }`}
      style={{ fontFamily: "monospace" }}
    >
      <div className="flex justify-between gap-4">
        <label className="flex items-center gap-2">
          <span>Player name:</span>
          <span
            ref={spanRef}
            className="absolute invisible whitespace-pre px-2"
          >
            {player || " "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={player}
            className="border-b focus:outline-none py-0 px-1 min-w-[100px] max-w-[250px]"
            style={{ width }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => setPlayer?.(e.target.value || "")}
          />
        </label>

        <div className="flex gap-2">
          <div>HI</div>
          <div>
            {formattedHighScore}
            {highScorePlayer && <>({highScorePlayer})</>}
          </div>
          <div className="mx-2">{formattedScore}</div>
        </div>
      </div>
    </div>
  );
};

export default Score;
