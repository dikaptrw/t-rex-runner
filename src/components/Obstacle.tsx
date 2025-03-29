import React from "react";
import { ObstacleType } from "@/types";
import { cn } from "@/utils";

interface ObstacleProps {
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  isNightMode: boolean;
}

const Obstacle = ({
  type,
  x,
  y,
  width,
  height,
  isNightMode,
}: ObstacleProps) => {
  // Render obstacle based on type
  const renderObstacle = () => {
    switch (type) {
      case ObstacleType.CACTUS_SMALL:
        return renderSmallCactus();
      case ObstacleType.CACTUS_LARGE:
        return renderLargeCactus();
      case ObstacleType.PTERODACTYL:
        return renderPterodactyl();
      default:
        return renderSmallCactus();
    }
  };

  // Small cactus
  const renderSmallCactus = () => (
    <div className="relative w-full h-full">
      <div
        className={cn(
          "absolute w-[20%] h-[100%] left-[40%] bottom-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[20%] h-[33%] left-0 bottom-[66%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[20%] h-[33%] right-0 bottom-[50%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
    </div>
  );

  // Large cactus
  const renderLargeCactus = () => (
    <div className="relative w-full h-full">
      <div
        className={cn(
          "absolute w-[20%] h-[100%] left-[33%] bottom-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[20%] h-[75%] left-0 bottom-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[20%] h-[87%] right-0 bottom-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[33%] h-[12%] left-0 bottom-[62%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[33%] h-[12%] right-[16%] bottom-[75%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
    </div>
  );

  // Pterodactyl
  const renderPterodactyl = () => (
    <div className="relative w-full h-full animate-flap">
      <div
        className={cn(
          "absolute w-[50%] h-[50%] left-[25%] top-[25%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[25%] h-[25%] right-0 top-[12.5%]",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[12.5%] h-[12.5%] right-0 top-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[50%] h-[25%] left-[25%] top-0",
          isNightMode ? "bg-[#B6B6B6]" : "bg-black"
        )}
      ></div>
    </div>
  );

  return (
    <div
      className="absolute"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        bottom: `${y}px`, // Uses y directly instead of assuming ground level
      }}
    >
      {renderObstacle()}
    </div>
  );
};

export default Obstacle;
