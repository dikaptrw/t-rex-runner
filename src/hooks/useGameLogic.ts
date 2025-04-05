import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  GameState,
  Dino,
  Obstacle,
  Cloud,
  DinoState,
  ObstacleType,
  GAME_CONFIG,
} from "@/types";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { ENV } from "@/constants";
import db from "@/utils/firestore";

const HIGH_SCORE_STORAGE_KEY = "trexHighScore";
const HIGH_SCORE_PLAYER_STORAGE_KEY = "trexHighScorePlayer";

export const useGameLogic = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    highScorePlayer: "",
    speed: GAME_CONFIG.INITIAL_GAME_SPEED,
    player: "",
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
  const [isMuted, setIsMuted] = useState(false);

  // Touch control references
  const isTouchingRef = useRef<boolean>(false);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add this ref to track duck intention
  const wantsToDuckRef = useRef<boolean>(false);

  // Animation frame reference
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const canJumpRef = useRef<boolean>(true);
  const collectionRef = useMemo(() => {
    return collection(db, "dikaptrw-profile", ENV, "games");
  }, []);
  const docRef = useMemo(() => {
    return doc(collectionRef, process.env.NEXT_PUBLIC_T_REX_GAME_DOC_ID);
  }, [collectionRef]);

  // Check if high score exists in local storage or firestore
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HIGH_SCORE_MODE === "firestore") {
      getDoc(docRef).then((res) => {
        const data = res.data();

        if (data) {
          setGameState((prev) => ({
            ...prev,
            highScore: data.highScore,
            highScorePlayer: data.playerName,
          }));
        }
      });

      // Listen for changes in the Firestore document
      const unsubscribe = onSnapshot(docRef, (data) => {
        setGameState((prev) => ({
          ...prev,
          highScore: data.data()?.highScore || prev.highScore,
          highScorePlayer: data.data()?.playerName || prev.highScorePlayer,
        }));
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    } else {
      const storedHighScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
      const storedHighScorePlayer = localStorage.getItem(
        HIGH_SCORE_PLAYER_STORAGE_KEY
      );

      setGameState((prev) => ({
        ...prev,
        highScore: storedHighScore ? parseInt(storedHighScore) : prev.highScore,
        highScorePlayer: storedHighScorePlayer || prev.highScorePlayer,
      }));
    }
  }, [docRef]);

  const setPlayer = useCallback((name: string) => {
    setGameState((prev) => ({
      ...prev,
      player: name,
    }));
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: gameState.highScore,
      highScorePlayer: gameState.highScorePlayer,
      speed: GAME_CONFIG.INITIAL_GAME_SPEED,
      player: gameState.player,
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
  }, [gameState.highScore, gameState.highScorePlayer, gameState.player]);

  // Handle high score on firestore
  const updateHighScoreFirestore = useCallback(
    ({
      highScore,
      highScorePlayer,
    }: {
      highScore: number;
      highScorePlayer: string;
    }) => {
      getDoc(docRef).then((res) => {
        if (res.exists()) {
          updateDoc(docRef, {
            highScore: Math.floor(highScore),
            playerName: highScorePlayer,
          });
        } else {
          setDoc(docRef, {
            highScore: Math.floor(highScore),
            playerName: highScorePlayer,
          });
        }
      });
    },
    [docRef]
  );

  // Game over
  const gameOver = useCallback(() => {
    setGameState((prev) => {
      // Update high score if current score is higher
      let newHighScore = prev.highScore;
      let newHighScorePlayer = prev.highScorePlayer;
      const currentNewHighScore = Math.max(prev.score, prev.highScore);

      if (currentNewHighScore > prev.highScore) {
        newHighScore = currentNewHighScore;
        newHighScorePlayer = gameState.player;

        if (process.env.NEXT_PUBLIC_HIGH_SCORE_MODE === "firestore") {
          updateHighScoreFirestore({
            highScore: newHighScore,
            highScorePlayer: newHighScorePlayer,
          });
        } else {
          // Save high score to local storage
          localStorage.setItem(HIGH_SCORE_STORAGE_KEY, newHighScore.toString());
          localStorage.setItem(
            HIGH_SCORE_PLAYER_STORAGE_KEY,
            newHighScorePlayer.toString()
          );
        }
      }

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
        highScorePlayer: newHighScorePlayer,
      };
    });

    setDino((prev) => ({
      ...prev,
      state: DinoState.CRASHED,
    }));
  }, [gameState.player, updateHighScoreFirestore]);

  // Jump
  const jump = useCallback(() => {
    // Reset duck intention
    wantsToDuckRef.current = false;

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
    if (dino.state === DinoState.JUMPING) wantsToDuckRef.current = true;

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
    if (wantsToDuckRef.current && dino.state === DinoState.JUMPING)
      wantsToDuckRef.current = false;

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

      return actualObs.type === ObstacleType.PTERODACTYL && actualObs.y === 60
        ? actualDino.x + actualDino.width - buffer > actualObs.x + buffer &&
            actualDino.x + buffer < actualObs.x + actualObs.width - buffer &&
            // We remove the buffer for this specific case to make the collision match the UI
            Math.abs(actualDino.y) + actualDino.height + 1 > actualObs.y &&
            Math.abs(actualDino.y) - buffer <
              actualObs.y + actualObs.height + buffer
        : actualDino.x + actualDino.width - buffer > actualObs.x + buffer &&
            actualDino.x + buffer < actualObs.x + actualObs.width - buffer &&
            Math.abs(actualDino.y) + actualDino.height - buffer >
              actualObs.y + buffer &&
            Math.abs(actualDino.y) - buffer <
              actualObs.y + actualObs.height + buffer;
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
    // const randomType = types[2]; // for test
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
        const heights = [1, 2, 3, 4, 5];
        // const heights = [2]; // for test
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

            if (wantsToDuckRef.current) {
              return {
                ...prev,
                y: 0,
                jumpVelocity: 0,
                state: DinoState.DUCKING,
                width: 3 * GAME_CONFIG.BLOCK_SIZE,
                height: 2 * GAME_CONFIG.BLOCK_SIZE,
              };
            } else {
              return {
                ...prev,
                y: 0,
                jumpVelocity: 0,
                state: DinoState.RUNNING,
              };
            }
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
              GAME_CONFIG.CANVAS_WIDTH - 350)
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

  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    // If the game hasn't started yet, start the game
    if (!gameState.isPlaying) {
      startGame();
      return;
    }

    isTouchingRef.current = true;

    // Start ducking after a short delay (to distinguish between tap and hold)
    touchTimerRef.current = setTimeout(() => {
      if (isTouchingRef.current) {
        duck();
      }
    }, 150); // 150ms delay before considering it a hold
  }, [duck, gameState.isPlaying, startGame]);

  // Touch end handler
  const handleTouchEnd = useCallback(() => {
    isTouchingRef.current = false;

    // Clear the duck timer if it exists
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    // If touch duration was short, treat it as a jump
    stopDucking();

    if (!gameState.isPlaying && !gameState.isGameOver) {
      startGame();
    } else if (dino.state !== DinoState.DUCKING) {
      jump();
    }
  }, [
    jump,
    stopDucking,
    startGame,
    gameState.isPlaying,
    gameState.isGameOver,
    dino.state,
  ]);

  // Add touch event listeners in a useEffect
  useEffect(() => {
    const handleTouchStartWrapper = (e: TouchEvent) => {
      const scoreWrapper = document.getElementById("scoreWrapper");
      if (
        e.target &&
        scoreWrapper?.contains(e.target as Node) &&
        !gameState.isPlaying
      ) {
        return;
      }

      e.preventDefault();
      handleTouchStart();
    };

    const handleTouchEndWrapper = (e: TouchEvent) => {
      const scoreWrapper = document.getElementById("scoreWrapper");
      if (
        e.target &&
        scoreWrapper?.contains(e.target as Node) &&
        !gameState.isPlaying
      ) {
        return;
      }

      e.preventDefault();
      handleTouchEnd();
    };

    const containerEl = document.getElementById("gameWrapper");

    // Add touch event listeners
    if (containerEl) {
      containerEl.addEventListener("touchstart", handleTouchStartWrapper, {
        passive: false,
      });
      containerEl.addEventListener("touchend", handleTouchEndWrapper, {
        passive: false,
      });
      containerEl.addEventListener("touchcancel", handleTouchEndWrapper, {
        passive: false,
      });
    }

    return () => {
      if (containerEl) {
        // Cleanup touch event listeners
        containerEl.removeEventListener("touchstart", handleTouchStartWrapper);
        containerEl.removeEventListener("touchend", handleTouchEndWrapper);
        containerEl.removeEventListener("touchcancel", handleTouchEndWrapper);
      }

      // Clear any pending timers
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTouchStart, handleTouchEnd]);

  return {
    gameState,
    dino,
    obstacles,
    clouds,
    isNightMode,
    isMuted,
    setIsMuted,
    startGame,
    jump,
    duck,
    setPlayer,
  };
};
