import React from 'react';
import { DinoState, GAME_CONFIG } from '@/types';

interface DinoProps {
  state: DinoState;
  y: number;
}

const Dino: React.FC<DinoProps> = ({ state, y }) => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;
  const width = state === DinoState.DUCKING ? 3 * blockSize : 2 * blockSize;
  const height = state === DinoState.DUCKING ? 2 * blockSize : 3 * blockSize;
  
  // Determine which dino sprite to show based on state
  const renderDino = () => {
    switch (state) {
      case DinoState.RUNNING:
        return renderRunningDino();
      case DinoState.JUMPING:
        return renderStandingDino();
      case DinoState.DUCKING:
        return renderDuckingDino();
      case DinoState.CRASHED:
        return renderCrashedDino();
      default:
        return renderStandingDino();
    }
  };

  // Standing dino (also used for jumping)
  const renderStandingDino = () => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Head */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: 0, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Body */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${2 * blockSize}px`, 
        top: `${blockSize}px`, 
        left: 0 
      }}></div>
      
      {/* Leg */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: `${2 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize/2}px`, 
        top: `${1.25 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
    </div>
  );

  // Running dino (alternating legs)
  const renderRunningDino = () => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Head */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: 0, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Body */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${2 * blockSize}px`, 
        top: `${blockSize}px`, 
        left: 0 
      }}></div>
      
      {/* Legs - animated with CSS */}
      <div className="absolute bg-black animate-leg-swap" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: `${2 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Arm */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize/2}px`, 
        top: `${1.25 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
    </div>
  );

  // Ducking dino
  const renderDuckingDino = () => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Head */}
      <div className="absolute bg-black" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: 0, 
        left: `${2 * blockSize}px` 
      }}></div>
      
      {/* Body */}
      <div className="absolute bg-black" style={{ 
        width: `${3 * blockSize}px`, 
        height: `${blockSize}px`, 
        top: `${blockSize}px`, 
        left: 0 
      }}></div>
      
      {/* Legs */}
      <div className="absolute bg-black animate-leg-swap" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize/2}px`, 
        top: `${1.5 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
    </div>
  );

  // Crashed dino
  const renderCrashedDino = () => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Same as standing but with different color to indicate crash */}
      {/* Head */}
      <div className="absolute bg-gray-700" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: 0, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Body */}
      <div className="absolute bg-gray-700" style={{ 
        width: `${blockSize}px`, 
        height: `${2 * blockSize}px`, 
        top: `${blockSize}px`, 
        left: 0 
      }}></div>
      
      {/* Leg */}
      <div className="absolute bg-gray-700" style={{ 
        width: `${blockSize}px`, 
        height: `${blockSize}px`, 
        top: `${2 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
      
      {/* Arm */}
      <div className="absolute bg-gray-700" style={{ 
        width: `${blockSize/2}px`, 
        height: `${blockSize/2}px`, 
        top: `${1.25 * blockSize}px`, 
        left: `${blockSize}px` 
      }}></div>
    </div>
  );

  return (
    <div 
      className="absolute" 
      style={{ 
        transform: `translateY(${y}px)`,
        bottom: `${GAME_CONFIG.GROUND_HEIGHT}px`,
        left: `${5 * blockSize}px`,
        transition: state === DinoState.JUMPING ? 'none' : 'transform 0.1s'
      }}
    >
      {renderDino()}
    </div>
  );
};

export default Dino;
