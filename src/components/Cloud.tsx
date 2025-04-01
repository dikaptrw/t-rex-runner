import React from "react";
import { GAME_CONFIG } from "@/types"; // Assuming BLOCK_SIZE is here
import { cn } from "@/utils"; // Classname utility (like clsx or tailwind-merge)

interface CloudProps {
  x: number; // Position from left (pixels)
  y: number; // Position from top (pixels)
  isNightMode: boolean;
  // Optional: add other props like scale or custom styles if needed
  // scale?: number;
  // className?: string;
}

// Define base styles for cloud puffs to avoid repetition
const puffBaseClasses = "absolute rounded-full";

const Cloud = ({ x, y, isNightMode /*, className, scale = 1 */ }: CloudProps) => {
  // Use a potentially more descriptive name or keep BLOCK_SIZE if preferred
  const baseSize = GAME_CONFIG.BLOCK_SIZE;

  // --- Pre-calculate dimensions for clarity ---
  const cloudWidth = 4 * baseSize;
  const cloudHeight = 2 * baseSize;

  // Main body dimensions and position relative to the container
  const mainPuffWidth = 2 * baseSize;
  const mainPuffHeight = 1.5 * baseSize;
  const mainPuffLeft = baseSize; // Centered horizontally (relative to its own size within the container)
  const mainPuffTop = 0.5 * baseSize;

  // Side puffs dimensions and position relative to the container
  const sidePuffWidth = 1.5 * baseSize;
  const sidePuffHeight = baseSize;
  const leftPuffTop = 0.75 * baseSize;
  const rightPuffTop = 0.5 * baseSize;

  // --- Define Colors (using Tailwind classes) ---
  // Feel free to change these for your desired look
  const dayColor = "bg-gray-200";   // A lighter, softer gray
  const nightColor = "bg-slate-700"; // A darker blue-gray

  const cloudColor = isNightMode ? nightColor : dayColor;

  return (
    <div
      // Apply main positioning and dimensions using inline styles based on props/config
      className="absolute" // Use absolute positioning for the container
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${cloudWidth}px`,
        height: `${cloudHeight}px`,
        // Optional scaling can be applied here if needed:
        // transform: `scale(${scale})`,
        // transformOrigin: 'top left', // Adjust origin if scaling
      }}
      role="img" // Improve accessibility
      aria-label="Cloud"
      // You could merge external classNames if needed:
      // className={cn("absolute", className)}
    >
      {/* Main cloud body */}
      <div
        className={cn(puffBaseClasses, cloudColor)}
        style={{
          width: `${mainPuffWidth}px`,
          height: `${mainPuffHeight}px`,
          left: `${mainPuffLeft}px`,
          top: `${mainPuffTop}px`,
        }}
      />

      {/* Left cloud puff */}
      <div
        className={cn(puffBaseClasses, cloudColor)}
        style={{
          width: `${sidePuffWidth}px`,
          height: `${sidePuffHeight}px`,
          left: 0, // Aligned to the container's left edge
          top: `${leftPuffTop}px`,
        }}
      />

      {/* Right cloud puff */}
      <div
        className={cn(puffBaseClasses, cloudColor)}
        style={{
          width: `${sidePuffWidth}px`,
          height: `${sidePuffHeight}px`,
          right: 0, // Aligned to the container's right edge
          top: `${rightPuffTop}px`,
        }}
      />
    </div>
  );
};

export default Cloud;
