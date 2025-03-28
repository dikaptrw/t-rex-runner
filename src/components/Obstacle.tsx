import React from 'react';
import { ObstacleType, GAME_CONFIG } from '@/types';

interface ObstacleProps {
  type: ObstacleType;
  x: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ type, x }) => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;
  
  // Determine obstacle dimensions based on type
  const getObstacleDimensions = () => {
    switch (type) {
      case ObstacleType.CACTUS_SMALL:
        return { width: 2 * blockSize, height: 3 * blockSize };
      case ObstacleType.CACTUS_LARGE:
        return { width: 3 * blockSize, height: 4 * blockSize };
      case ObstacleType.PTERODACTYL:
        return { width: 4 * blockSize, height: 2 * blockSize };
      default:
        return { width: 2 * blockSize, height: 3 * blockSize };
    }
  };
  
  const { width, height } = getObstacleDimensions();
  
  // Render different obstacles based on type
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
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Main stem */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${3 * blockSize}px`, 
        left: `${blockSize/2}px`, 
        bottom: 0 
      }}></div>
      
      {/* Left arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize}px`, 
        left: 0, 
        bottom: `${2 * blockSize}px` 
      }}></div>
      
      {/* Right arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize}px`, 
        left: `${blockSize}px`, 
        bottom: `${1.5 * blockSize}px` 
      }}></div>
    </div>
  );
  
  // Large cactus
  const renderLargeCactus = () => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Main stem */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${4 * blockSize}px`, 
        left: `${blockSize}px`, 
        bottom: 0 
      }}></div>
      
      {/* Left stem */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${3 * blockSize}px`, 
        left: 0, 
        bottom: 0 
      }}></div>
      
      {/* Right stem */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${3.5 * blockSize}px`, 
        left: `${2 * blockSize}px`, 
        bottom: 0 
      }}></div>
      
      {/* Left arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize/2}px`, 
        left: 0, 
        bottom: `${2.5 * blockSize}px` 
      }}></div>
      
      {/* Right arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize/2}px`, 
        left: `${1.5 * blockSize}px`, 
        bottom: `${3 * blockSize}px` 
      }}></div>
    </div>
  );
  
  // Pterodactyl
  const renderPterodactyl = () => (
    <div className="relative animate-flap" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Body */}
      <div className="absolute bg-black" style={{ 
        width: `${2 * blockSize}px`, 
        height: `${blockSize}px`, 
        left: `${blockSize}px`, 
        top: `${blockSize/2}px` 
      }}></div>
      
      {/* Head */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize/2}px`, 
        left: `${3 * blockSize}px`, 
        top: `${blockSize/4}px` 
      }}></div>
      
      {/* Beak */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize/4}px`, 
        left: `${3.5 * blockSize}px`, 
        top: `${blockSize/3}px` 
      }}></div>
      
      {/* Wings - animated with CSS */}
      <div className="absolute bg-black" style={{ 
        width: `${2 * blockSize}px`, 
        height: `${blockSize/2}px`, 
        left: `${blockSize}px`, 
        top: 0 
      }}></div>
    </div>
  );
  
  return (
    <div 
      className="absolute" 
      style={{ 
        bottom: `${GAME_CONFIG.GROUND_HEIGHT}px`,
        left: `${x}px`,
      }}
    >
      {renderObstacle()}
    </div>
  );
};

export default Obstacle;
