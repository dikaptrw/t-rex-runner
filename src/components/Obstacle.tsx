import React from "react";
import { ObstacleType } from "@/types";

interface ObstacleProps {
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ type, x, y, width, height }) => {
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
      <div className="absolute bg-black w-[20%] h-[100%] left-[40%] bottom-0"></div>
      <div className="absolute bg-black w-[20%] h-[33%] left-0 bottom-[66%]"></div>
      <div className="absolute bg-black w-[20%] h-[33%] right-0 bottom-[50%]"></div>
    </div>
  );

  // Large cactus
  const renderLargeCactus = () => (
    <div className="relative w-full h-full">
      <div className="absolute bg-black w-[20%] h-[100%] left-[33%] bottom-0"></div>
      <div className="absolute bg-black w-[20%] h-[75%] left-0 bottom-0"></div>
      <div className="absolute bg-black w-[20%] h-[87%] right-0 bottom-0"></div>
      <div className="absolute bg-black w-[33%] h-[12%] left-0 bottom-[62%]"></div>
      <div className="absolute bg-black w-[33%] h-[12%] right-[16%] bottom-[75%]"></div>
    </div>
  );

  // Pterodactyl
  const renderPterodactyl = () => (
    <div className="relative w-full h-full animate-flap">
      <div className="absolute bg-black w-[50%] h-[50%] left-[25%] top-[25%]"></div>
      <div className="absolute bg-black w-[25%] h-[25%] right-0 top-[12.5%]"></div>
      <div className="absolute bg-black w-[12.5%] h-[12.5%] right-0 top-0"></div>
      <div className="absolute bg-black w-[50%] h-[25%] left-[25%] top-0"></div>
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
