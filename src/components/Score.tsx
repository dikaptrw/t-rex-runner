import React, { useEffect, useRef, useState, useCallback } from "react";

// --- Constants ---
const DEFAULT_SCORE_PADDING = 5;
const MAX_PLAYER_NAME_LENGTH = 15;
const NEW_HIGH_SCORE_DISPLAY_DURATION = 3000; // ms

// --- Interfaces ---
interface ScoreProps {
  /** Current game score */
  score: number;
  /** Current high score */
  highScore: number;
  /** Current player's name */
  player?: string;
  /** Name of the player who achieved the high score */
  highScorePlayer?: string;
  /** Flag for applying dark mode styles */
  isNightMode?: boolean;
  /** Flag indicating if the game is currently running (disables input) */
  isPlaying?: boolean;
  /** Callback function to update the player's name in the parent component */
  setPlayer?: (name: string) => void;
  /** Number of leading zeros for score display */
  scorePadding?: number;
  /** Whether to show the "HI" prefix before the high score */
  showHiPrefix?: boolean;
  /** Whether to show the high score player's name */
  showHighScorePlayer?: boolean;
  /** Placeholder text for the player name input */
  inputPlaceholder?: string;
  /** Optional callback triggered when a new high score is achieved */
  onNewHighScoreAchieved?: () => void;
  /** Custom class name for the main wrapper */
  className?: string;
  /** Custom styles for the main wrapper */
  style?: React.CSSProperties;
}

// --- Helper Function ---
/**
 * Formats a number with leading zeros.
 * @param num The number to format.
 * @param padding The total desired length, padded with zeros.
 * @returns The formatted string.
 */
const formatScoreWithPadding = (num: number, padding: number): string => {
  // Ensure score isn't negative and padding is reasonable
  const safeNum = Math.max(0, Math.floor(num));
  const safePadding = Math.max(1, padding);
  return safeNum.toString().padStart(safePadding, "0");
};

// --- Component ---
const EnhancedScore: React.FC<ScoreProps> = ({
  score,
  highScore,
  player = "", // Default to empty string
  highScorePlayer,
  isNightMode = false,
  isPlaying = false,
  setPlayer,
  scorePadding = DEFAULT_SCORE_PADDING,
  showHiPrefix = true,
  showHighScorePlayer = true,
  inputPlaceholder = "Enter Name",
  onNewHighScoreAchieved,
  className = "",
  style = {},
}) => {
  // --- State ---
  const [localPlayerName, setLocalPlayerName] = useState<string>(player);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [inputWidth, setInputWidth] = useState<number | string>("auto"); // Use 'auto' initially
  const [scoreFlash, setScoreFlash] = useState<boolean>(false); // For score update visual feedback

  // --- Refs ---
  const hiddenSpanRef = useRef<HTMLSpanElement>(null); // For calculating input width
  const inputRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null); // Ref for score element
  const highScoreRef = useRef<HTMLDivElement>(null); // Ref for high score element
  const newHighScoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreFlashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevScoreRef = useRef<number>(score); // Track previous score for flashing


  // --- Memoized Callbacks ---
  const handlePlayerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit length client-side for immediate feedback
    const value = e.target.value.slice(0, MAX_PLAYER_NAME_LENGTH);
    setLocalPlayerName(value);
  }, []);

  const savePlayerName = useCallback(() => {
    const trimmedName = localPlayerName.trim();
    // Only call setPlayer if the name actually changed and is valid
    if (trimmedName !== player && setPlayer) {
        setPlayer(trimmedName || "Player"); // Use "Player" if trimmed name is empty
    } else if (!trimmedName && setPlayer) {
        // If user clears the name, maybe reset to default or prop value
        setPlayer("Player"); // Or revert to original `player` prop if needed
        setLocalPlayerName("Player"); // Update local state too
    }
  }, [localPlayerName, player, setPlayer]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent game controls from firing
    if (e.key === 'Enter') {
      savePlayerName();
      e.currentTarget.blur(); // Remove focus after Enter
    }
  }, [savePlayerName]);

  const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent clicks from affecting game
  }, []);

  const handleInputTouch = useCallback((e: React.TouchEvent<HTMLInputElement>) => {
     e.stopPropagation(); // Prevent touches from affecting game
  }, []);

  // --- Effects ---

  // Update local name if prop changes (e.g., loaded from storage)
  useEffect(() => {
    setLocalPlayerName(player);
  }, [player]);

  // Calculate input width based on content in hidden span
  useEffect(() => {
    if (hiddenSpanRef.current) {
      // Use scrollWidth for potentially more accurate measurement, add padding
      const width = hiddenSpanRef.current.offsetWidth + 4;
      setInputWidth(Math.max(86, width)); // Ensure minimum width
    } else {
      setInputWidth('auto'); // Fallback if ref not ready
    }
    // Update width when local name changes OR when game starts/stops (font might change)
  }, [localPlayerName, isPlaying]);

  // Handle New High Score
  useEffect(() => {
    const currentScore = Math.floor(score);
    const currentHighScore = Math.floor(highScore);

    // Trigger flash effect on score update
    if(currentScore !== prevScoreRef.current && isPlaying) {
        setScoreFlash(true);
        if (scoreFlashTimeoutRef.current) clearTimeout(scoreFlashTimeoutRef.current);
        scoreFlashTimeoutRef.current = setTimeout(() => setScoreFlash(false), 150); // Short flash duration
    }
    prevScoreRef.current = currentScore; // Update previous score *after* comparison

    // Check for new high score
    if (currentScore > currentHighScore && isPlaying) { // Only trigger if score *surpasses* high score and game is playing
      setIsNewHighScore(true);
      onNewHighScoreAchieved?.(); // Call callback if provided

      // Clear previous timeout if score keeps increasing rapidly
      if (newHighScoreTimeoutRef.current) {
        clearTimeout(newHighScoreTimeoutRef.current);
      }
      // Set timeout to hide the indicator
      newHighScoreTimeoutRef.current = setTimeout(() => {
        setIsNewHighScore(false);
      }, NEW_HIGH_SCORE_DISPLAY_DURATION);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
        if (newHighScoreTimeoutRef.current) clearTimeout(newHighScoreTimeoutRef.current);
        if (scoreFlashTimeoutRef.current) clearTimeout(scoreFlashTimeoutRef.current);
    };
  }, [score, highScore, isPlaying, onNewHighScoreAchieved]);

  // Reset high score indicator when game stops/restarts
   useEffect(() => {
     if (!isPlaying) {
       setIsNewHighScore(false);
       if (newHighScoreTimeoutRef.current) {
         clearTimeout(newHighScoreTimeoutRef.current);
       }
     }
   }, [isPlaying]);

  // --- Render Logic ---
  const formattedScore = formatScoreWithPadding(score, scorePadding);
  const formattedHighScore = formatScoreWithPadding(highScore, scorePadding);

  const themeTextColor = isNightMode ? "text-gray-100" : "text-gray-800";
  const themeInputBorder = isNightMode ? "border-gray-400" : "border-gray-500";
  const themeInputBg = isNightMode ? "bg-gray-700" : "bg-white";
  const themeFocusBorder = isNightMode ? "focus:border-blue-300" : "focus:border-blue-500";
  const themeDisabledStyle = "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-opacity-50";
  const newHighScoreColor = isNightMode ? "text-yellow-300" : "text-red-600"; // Color for high score text

  return (
    <div
      id="scoreWrapper"
      className={`score-container absolute z-10 right-4 top-4 left-4 font-mono text-lg select-none ${themeTextColor} ${className}`}
      style={{ fontFamily: "monospace", ...style }} // Allow overriding font via style prop too
    >
      {/* Hidden Span for Width Calculation */}
      <span
        ref={hiddenSpanRef}
        className="absolute invisible whitespace-pre px-1" // Match input padding
        aria-hidden="true"
      >
        {/* Use local name or placeholder for calculation, ensuring minimum content */}
        {localPlayerName || inputPlaceholder || " "}
      </span>

      <div className="flex justify-between items-center gap-4 flex-wrap"> {/* Added items-center & flex-wrap */}

        {/* Player Name Section */}
        <div className="player-name-section flex items-center gap-2 group"> {/* Added group for potential future styling */}
          <label htmlFor="playerNameInput" className="sr-only"> {/* Hidden label for accessibility */}
            Player Name:
          </label>
          <span className="hidden sm:inline">Player:</span> {/* Hide label on very small screens */}
          <input
            id="playerNameInput"
            ref={inputRef}
            type="text"
            value={localPlayerName}
            placeholder={inputPlaceholder}
            disabled={isPlaying}
            maxLength={MAX_PLAYER_NAME_LENGTH} // Use constant for max length
            className={`border-b focus:outline-none py-0 px-1 min-w-[86px] max-w-[250px] ${themeInputBg} ${themeInputBorder} ${themeFocusBorder} ${themeDisabledStyle} transition-colors duration-150`}
            style={{ width: inputWidth }}
            onChange={handlePlayerNameChange}
            onBlur={savePlayerName} // Save name when input loses focus
            onKeyDown={handleKeyDown}
            onClick={handleInputClick} // Prevent game interaction
            onTouchStart={handleInputTouch} // Prevent game interaction on touch
            aria-label="Enter your player name"
            autoComplete="off" // Often desired in games
          />
        </div>

        {/* Score Section */}
        <div className="score-section flex items-center gap-2 md:gap-4"> {/* Responsive gap */}
           {isNewHighScore && (
             <div className={`new-high-score-indicator font-bold text-sm ${newHighScoreColor} animate-pulse`}
                   aria-live="polite">
               NEW HI!
             </div>
           )}
          {showHiPrefix && <div className="text-gray-500 dark:text-gray-400">HI</div>}
          <div
            ref={highScoreRef}
            className={`high-score ${isNewHighScore ? newHighScoreColor : ''} transition-colors duration-300`}
            aria-live="polite" // Announce changes (though high score changes less often)
          >
            {formattedHighScore}
            {showHighScorePlayer && highScorePlayer && (
               <span className="text-xs ml-1 opacity-80">({highScorePlayer})</span>
            )}
          </div>
          <div
             ref={scoreRef}
             className={`current-score font-semibold ${scoreFlash ? (isNightMode ? 'text-yellow-300' : 'text-blue-600') : ''} transition-colors duration-100`} // Apply flash color
             aria-live="polite" // Announce score changes to screen readers
             aria-atomic="true" // Ensure entire score is read out
           >
            {formattedScore}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedScore;
