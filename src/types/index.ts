// Game state types
export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
}

// Block-based position and size
export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Character states
export enum DinoState {
  RUNNING = "running",
  JUMPING = "jumping",
  DUCKING = "ducking",
  CRASHED = "crashed",
}

// Obstacle types
export enum ObstacleType {
  CACTUS_SMALL = "cactus-small",
  CACTUS_LARGE = "cactus-large",
  PTERODACTYL = "pterodactyl",
}

// Game element interfaces
export interface Dino extends Block {
  state: DinoState;
  jumpVelocity: number;
}

export interface Obstacle extends Block {
  type: ObstacleType;
}

export interface Cloud extends Block {
  speed: number;
}

// Game settings
export const GAME_CONFIG = {
  BLOCK_SIZE: 20,
  GROUND_HEIGHT: 20,
  GRAVITY: 0.6, // Reduced gravity for smoother jumps
  INITIAL_JUMP_VELOCITY: -14, // Increased jump velocity for higher jumps
  INITIAL_GAME_SPEED: 3,
  SPEED_INCREMENT: 0.00001,
  OBSTACLE_FREQUENCY: 0.01,
  CLOUD_FREQUENCY: 0.02,
  NIGHT_MODE_SCORE: 500,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 300,
};
