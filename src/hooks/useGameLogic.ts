import { useEffect, useState, useCallback, useRef } from "react";
import {
  GameState,
  Dino,
  Obstacle,
  Cloud,
  DinoState,
  ObstacleType,
  GAME_CONFIG,
} from "@/types";

export const useGameLogic = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    speed: GAME_CONFIG.INITIAL_GAME_SPEED,
  });

  // Game elements
  const [dino, setDino] = useState<Dino>({
    x: 5 * GAME_CONFIG.BLOCK_SIZE,
    y: 0,
    width: 2 * GAME_CONFIG.BLOCK_SIZE,
    height: 3 * GAME_CONFIG.BLOCK_SIZE,
    state: DinoState.RUNNING,
    jumpVelocity: 0,
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [isNightMode, setIsNightMode] = useState(false);

  // Animation frame reference
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const canJumpRef = useRef<boolean>(true);

  // Check if high score exists in local storage
  useEffect(() => {
    const storedHighScore = localStorage.getItem("trexHighScore");
    if (storedHighScore) {
      setGameState((prev) => ({
        ...prev,
        highScore: parseInt(storedHighScore),
      }));
    }
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: gameState.highScore,
      speed: GAME_CONFIG.INITIAL_GAME_SPEED,
    });

    setDino({
      x: 5 * GAME_CONFIG.BLOCK_SIZE,
      y: 0,
      width: 2 * GAME_CONFIG.BLOCK_SIZE,
      height: 3 * GAME_CONFIG.BLOCK_SIZE,
      state: DinoState.RUNNING,
      jumpVelocity: 0,
    });

    setObstacles([]);
    setClouds([]);
    setIsNightMode(false);
    lastTimeRef.current = 0;
    canJumpRef.current = true;
  }, [gameState.highScore]);

  // Game over
  const gameOver = useCallback(() => {
    setGameState((prev) => {
      // Update high score if current score is higher
      const newHighScore = Math.max(prev.score, prev.highScore);

      // Save high score to local storage
      localStorage.setItem("trexHighScore", newHighScore.toString());

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    });

    setDino((prev) => ({
      ...prev,
      state: DinoState.CRASHED,
    }));
  }, []);

  // Jump
  const jump = useCallback(() => {
    // Only allow jumping if the dino is on the ground and not already jumping
    if (
      !canJumpRef.current ||
      dino.state === DinoState.JUMPING ||
      gameState.isGameOver
    )
      return;

    setDino((prev) => ({
      ...prev,
      state: DinoState.JUMPING,
      jumpVelocity: GAME_CONFIG.INITIAL_JUMP_VELOCITY,
    }));

    // Prevent jump spamming
    canJumpRef.current = false;
  }, [dino.state, gameState.isGameOver]);

  // Duck
  const duck = useCallback(() => {
    if (dino.state === DinoState.JUMPING || gameState.isGameOver) return;

    setDino((prev) => ({
      ...prev,
      state: DinoState.DUCKING,
      width: 3 * GAME_CONFIG.BLOCK_SIZE,
      height: 2 * GAME_CONFIG.BLOCK_SIZE,
    }));
  }, [dino.state, gameState.isGameOver]);

  // Stop ducking
  const stopDucking = useCallback(() => {
    if (dino.state !== DinoState.DUCKING || gameState.isGameOver) return;

    setDino((prev) => ({
      ...prev,
      state: DinoState.RUNNING,
      width: 2 * GAME_CONFIG.BLOCK_SIZE,
      height: 3 * GAME_CONFIG.BLOCK_SIZE,
    }));
  }, [dino.state, gameState.isGameOver]);

  const checkCollision = useCallback(
    (actualDino: Dino, actualObs: Obstacle): boolean => {
      // Add a small buffer to make collision detection more forgiving
      const buffer = 7;

      return (
        actualDino.x + actualDino.width - buffer > actualObs.x + buffer &&
        actualDino.x + buffer < actualObs.x + actualObs.width - buffer &&
        Math.abs(actualDino.y) + actualDino.height - buffer >
          actualObs.y + buffer &&
        Math.abs(actualDino.y) - buffer <
          actualObs.y + actualObs.height + buffer
      );
    },
    []
  );

  // Generate random obstacle
  const generateObstacle = useCallback((): Obstacle => {
    const types = [
      ObstacleType.CACTUS_SMALL,
      ObstacleType.CACTUS_LARGE,
      ObstacleType.PTERODACTYL,
    ];

    const randomType = types[Math.floor(Math.random() * types.length)];
    // const randomType = types[1]; // for test
    let width, height, y;

    switch (randomType) {
      case ObstacleType.CACTUS_SMALL:
        width = 1.5 * GAME_CONFIG.BLOCK_SIZE;
        height = 3 * GAME_CONFIG.BLOCK_SIZE;
        y = GAME_CONFIG.GROUND_HEIGHT; // Ground level
        break;
      case ObstacleType.CACTUS_LARGE:
        width = 2 * GAME_CONFIG.BLOCK_SIZE;
        height = 4 * GAME_CONFIG.BLOCK_SIZE;
        y = GAME_CONFIG.GROUND_HEIGHT; // Ground level
        break;
      case ObstacleType.PTERODACTYL:
        width = 4 * GAME_CONFIG.BLOCK_SIZE;
        height = 2 * GAME_CONFIG.BLOCK_SIZE;
        // Random height for pterodactyl (low, middle, high)
        const heights = [1, 3, 5];
        y =
          GAME_CONFIG.GROUND_HEIGHT +
          heights[Math.floor(Math.random() * heights.length)] *
            GAME_CONFIG.BLOCK_SIZE;
        break;
      default:
        width = 2 * GAME_CONFIG.BLOCK_SIZE;
        height = 3 * GAME_CONFIG.BLOCK_SIZE;
        y = GAME_CONFIG.GROUND_HEIGHT;
    }

    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      y,
      width,
      height,
      type: randomType,
    };
  }, []);

  // Generate random cloud
  const generateCloud = useCallback((): Cloud => {
    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      y: Math.floor(Math.random() * 100) + 20,
      width: 4 * GAME_CONFIG.BLOCK_SIZE,
      height: 2 * GAME_CONFIG.BLOCK_SIZE,
      speed: Math.random() * 2 + 1, // Clouds move slower than obstacles
    };
  }, []);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!gameState.isPlaying) {
        return;
      }

      // Calculate delta time
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update score
      setGameState((prev) => {
        const newScore = prev.score + deltaTime * 0.01;
        const newSpeed = prev.speed + GAME_CONFIG.SPEED_INCREMENT * deltaTime;

        // Check if we should switch to night mode
        if (Math.floor(newScore / GAME_CONFIG.NIGHT_MODE_SCORE) % 2 === 1) {
          setIsNightMode(true);
        } else {
          setIsNightMode(false);
        }

        return {
          ...prev,
          score: newScore,
          speed: newSpeed,
        };
      });

      // Update dino position (jumping physics)
      setDino((prev) => {
        if (prev.state === DinoState.JUMPING) {
          const newVelocity = prev.jumpVelocity + GAME_CONFIG.GRAVITY;
          const newY = prev.y + newVelocity;

          // Check if dino has landed
          if (newY >= 0) {
            // Allow jumping again once landed
            canJumpRef.current = true;

            return {
              ...prev,
              y: 0,
              jumpVelocity: 0,
              state: DinoState.RUNNING,
            };
          }

          return {
            ...prev,
            y: newY,
            jumpVelocity: newVelocity,
          };
        }

        return prev;
      });

      // Update obstacles
      setObstacles((prev) => {
        // Move existing obstacles
        const updatedObstacles = prev
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - gameState.speed * deltaTime * 0.1,
          }))
          .filter((obstacle) => obstacle.x > -obstacle.width); // Remove obstacles that are off-screen

        // Randomly generate new obstacles
        if (
          Math.random() < GAME_CONFIG.OBSTACLE_FREQUENCY &&
          (updatedObstacles.length === 0 ||
            updatedObstacles[updatedObstacles.length - 1].x <
              GAME_CONFIG.CANVAS_WIDTH - 200)
        ) {
          updatedObstacles.push(generateObstacle());
        }

        return updatedObstacles;
      });

      // Update clouds
      setClouds((prev) => {
        // Move existing clouds
        const updatedClouds = prev
          .map((cloud) => ({
            ...cloud,
            x: cloud.x - cloud.speed * deltaTime * 0.1,
          }))
          .filter((cloud) => cloud.x > -cloud.width); // Remove clouds that are off-screen

        // Randomly generate new clouds
        if (
          Math.random() < GAME_CONFIG.CLOUD_FREQUENCY &&
          (updatedClouds.length === 0 ||
            updatedClouds[updatedClouds.length - 1].x <
              GAME_CONFIG.CANVAS_WIDTH - 100)
        ) {
          updatedClouds.push(generateCloud());
        }

        return updatedClouds;
      });

      // Check for collisions
      for (const obstacle of obstacles) {
        if (checkCollision(dino, obstacle)) {
          gameOver();
          return;
        }
      }

      // Continue game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [
      gameState.isPlaying,
      gameState.speed,
      generateObstacle,
      generateCloud,
      gameOver,
      checkCollision,
      obstacles,
      dino,
    ]
  );

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (!gameState.isPlaying && !gameState.isGameOver) {
          startGame();
        } else {
          jump();
        }
        e.preventDefault();
      } else if (e.code === "ArrowDown") {
        duck();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        stopDucking();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    gameState.isPlaying,
    gameState.isGameOver,
    startGame,
    jump,
    duck,
    stopDucking,
  ]);

  return {
    gameState,
    dino,
    obstacles,
    clouds,
    isNightMode,
    startGame,
    jump,
    duck,
  };
};
