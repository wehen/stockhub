import React from 'react';
import { motion } from 'motion/react';
import { ColorTheme } from '../types';

interface ProgressBarProps {
  progress: number; // 0 to 100
  statusMessage: string;
  theme: ColorTheme;
  isComplete: boolean;
  onRestart: () => void;
  onFinishLoading: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  statusMessage,
  theme,
  isComplete,
  onRestart,
  onFinishLoading,
}) => {
  return (
    <div id="startup-progress-section" className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-12 md:px-16 pb-6 sm:pb-8">
      {/* Top row: Status message and numeric percentage */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wider text-white/80 mb-2 sm:mb-3">
        {/* Dynamic Status Text with subtle pulse */}
        <div className="flex items-center gap-2 overflow-hidden">
          <motion.span
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.indicatorColor }}
          />
          <motion.span
            key={statusMessage}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="uppercase tracking-[0.18em] truncate font-medium text-white/90 text-[11px] sm:text-xs md:text-sm"
            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
          >
            {isComplete ? 'INITIALIZATION COMPLETE' : statusMessage}
          </motion.span>
        </div>

        {/* Percentage Counter */}
        <div 
          className="font-bold tabular-nums tracking-widest text-[12px] sm:text-sm text-white/90"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Progress Track Container */}
      <div className="relative w-full h-1.5 sm:h-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 overflow-visible shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        {/* Filled Gradient Bar */}
        <motion.div
          id="progress-fill-bar"
          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} relative transition-all duration-150 ease-out`}
          style={{
            width: `${Math.max(2, progress)}%`,
            boxShadow: `0 0 16px ${theme.glowColor}`,
          }}
        >
          {/* Animated Glow Tip at the leading edge of progress */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-[4px] pointer-events-none"
            style={{ backgroundColor: theme.indicatorColor }}
          />
        </motion.div>

        {/* Iconic EA Sports FC Inverted Triangle / Marker (V Indicator) */}
        {/* Centered on the bar track or tracking the position */}
        <div className="absolute left-1/2 -bottom-3 sm:-bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <motion.svg
            width="20"
            height="18"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              y: [0, -2, 0],
              filter: [
                `drop-shadow(0 0 8px ${theme.indicatorColor})`,
                `drop-shadow(0 0 14px ${theme.indicatorColor})`,
                `drop-shadow(0 0 8px ${theme.indicatorColor})`,
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="transform transition-all"
          >
            {/* Iconic EA FC Triangle Chevron Pointer */}
            <path
              d="M12 18L3 4H21L12 18Z"
              fill="none"
              stroke={theme.indicatorColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 14L6 6H18L12 14Z"
              fill={theme.indicatorColor}
              fillOpacity="0.4"
            />
          </motion.svg>
        </div>
      </div>

      {/* Completion Action Banner if loaded */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap items-center justify-between gap-2"
        >
          <button
            id="start-app-btn"
            onClick={onFinishLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,255,135,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: theme.indicatorColor }}
          >
            <span>Lanjut ke Halaman Login</span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">Enter ↵</span>
          </button>

          <button
            id="replay-loading-btn"
            onClick={onRestart}
            className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 bg-black/30 backdrop-blur-md transition-colors cursor-pointer"
          >
            Ulangi Animasi Loading (R)
          </button>
        </motion.div>
      )}
    </div>
  );
};
