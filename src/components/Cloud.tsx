import React from "react";
import { GAME_CONFIG } from "@/types";
import { cn } from "@/utils";

interface CloudProps {
  x: number;
  y: number;
  isNightMode: boolean;
}

const Cloud = ({ x, y, isNightMode }: CloudProps) => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;
  const width = 4 * blockSize;
  const height = 2 * blockSize;

  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Main cloud body */}
      <div
        className={cn(
          "absolute rounded-full",
          isNightMode ? "bg-[#2A2A2A]" : "bg-[#CCCCCC]"
        )}
        style={{
          width: `${2 * blockSize}px`,
          height: `${1.5 * blockSize}px`,
          left: `${blockSize}px`,
          top: `${0.5 * blockSize}px`,
        }}
      ></div>

      {/* Left cloud puff */}
      <div
        className={cn(
          "absolute rounded-full",
          isNightMode ? "bg-[#2A2A2A]" : "bg-[#CCCCCC]"
        )}
        style={{
          width: `${1.5 * blockSize}px`,
          height: `${blockSize}px`,
          left: 0,
          top: `${0.75 * blockSize}px`,
        }}
      ></div>

      {/* Right cloud puff */}
      <div
        className={cn(
          "absolute rounded-full",
          isNightMode ? "bg-[#2A2A2A]" : "bg-[#CCCCCC]"
        )}
        style={{
          width: `${1.5 * blockSize}px`,
          height: `${blockSize}px`,
          right: 0,
          top: `${0.5 * blockSize}px`,
        }}
      ></div>
    </div>
  );
};

export default Cloud;
