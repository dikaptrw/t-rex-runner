import React from "react";

interface ScoreProps {
  score: number;
  highScore: number;
  isNightMode?: boolean;
}

const Score: React.FC<ScoreProps> = ({
  score,
  highScore,
  isNightMode = false,
}) => {
  // Format score with leading zeros
  const formatScore = (score: number): string => {
    return score.toString().padStart(5, "0");
  };

  const formattedScore = formatScore(score);
  const formattedHighScore = formatScore(highScore);

  return (
    <div
      className={`absolute right-4 top-4 font-mono text-lg ${
        isNightMode ? "text-white" : "text-black"
      }`}
      style={{ fontFamily: "monospace" }}
    >
      <div className="flex">
        <div className="mr-2">HI</div>
        <div>{formattedHighScore}</div>
        <div className="mx-2">{formattedScore}</div>
      </div>
    </div>
  );
};

export default Score;
