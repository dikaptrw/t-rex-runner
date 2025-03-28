import React from 'react';
import { GAME_CONFIG } from '@/types';

const Ground: React.FC = () => {
  const blockSize = GAME_CONFIG.BLOCK_SIZE;
  const groundWidth = GAME_CONFIG.CANVAS_WIDTH;
  const groundHeight = GAME_CONFIG.GROUND_HEIGHT;
  
  // Create ground blocks for the line
  const groundBlocks = [];
  const numBlocks = Math.ceil(groundWidth / blockSize);
  
  for (let i = 0; i < numBlocks; i++) {
    groundBlocks.push(
      <div 
        key={i}
        className="absolute bg-black"
        style={{
          width: `${blockSize}px`,
          height: '1px',
          bottom: `${groundHeight}px`,
          left: `${i * blockSize}px`
        }}
      />
    );
  }
  
  return (
    <div className="absolute bottom-0 w-full">
      {groundBlocks}
    </div>
  );
};

export default Ground;
