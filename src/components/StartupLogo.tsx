import React from 'react';
import { motion } from 'motion/react';
import { ColorTheme, StartupConfig } from '../types';
import { Edit3 } from 'lucide-react';

interface StartupLogoProps {
  config: StartupConfig;
  theme: ColorTheme;
  isCustomizing: boolean;
  onOpenCustomizer: () => void;
  onUpdateText?: (field: 'mainTitle' | 'badgeTopText' | 'badgeBottomText', value: string) => void;
}

export const StartupLogo: React.FC<StartupLogoProps> = ({
  config,
  theme,
  onOpenCustomizer,
}) => {
  return (
    <motion.div
      id="startup-logo-container"
      initial={{ opacity: 0, scale: 0.88, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative z-10 flex flex-col items-center justify-center cursor-pointer group"
      onClick={onOpenCustomizer}
      title="Klik untuk mengubah teks dan gaya"
    >
      {/* Quick edit floating tooltip hint on hover */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileHover={{ opacity: 1, y: -8 }}
        className="absolute -top-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white/70 shadow-lg pointer-events-none transition-all duration-200"
      >
        <Edit3 className="w-3 h-3 text-[#00ff87]" />
        <span>Klik untuk ganti tulisan</span>
      </motion.div>

      {/* Main Lockup: Badge + Display Typography */}
      <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 py-2">
        {/* Left Badge: Iconic Monogram Circle */}
        <motion.div
          id="startup-badge"
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.3)] border-2 border-white/80 select-none overflow-hidden"
        >
          {/* Badge subtle inner sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/40 pointer-events-none" />

          {/* Badge Top Text (e.g. 'EA') */}
          <span 
            className="text-black font-black tracking-tighter text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none italic select-none"
            style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
          >
            {config.badgeTopText || 'EA'}
          </span>

          {/* Badge Bottom Text (e.g. 'SPORTS™') */}
          <span 
            className="text-black font-extrabold tracking-widest text-[8px] sm:text-[10px] md:text-xs lg:text-[13px] uppercase mt-0.5 leading-none select-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {config.badgeBottomText || 'SPORTS™'}
          </span>
        </motion.div>

        {/* Right Typography: Bold Slanted 'FC 26' or Custom Text */}
        <div className="relative flex items-center select-none">
          {/* Ambient Glow behind the main title */}
          <div
            className="absolute inset-0 blur-2xl opacity-40 transition-colors duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.auroraColors.primary} 0%, transparent 70%)`,
            }}
          />

          <motion.div
            id="startup-main-title"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative font-black italic tracking-tighter text-white uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl transform -skew-x-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            {/* Shimmer Light Sweep across the text */}
            <span className="relative inline-block overflow-hidden">
              <span className="text-white">
                {config.mainTitle || 'FC 26'}
              </span>

              {/* Animated Specular Light Bar passing across */}
              <motion.span
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.8,
                  ease: 'easeInOut',
                  repeatDelay: 2.2,
                }}
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 pointer-events-none mix-blend-overlay"
              />
            </span>
          </motion.div>
        </div>
      </div>

      {/* Subtitle / Tagline below */}
      {config.tagline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base tracking-[0.28em] uppercase font-bold text-white/70"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {config.tagline}
        </motion.div>
      )}
    </motion.div>
  );
};
