import React from 'react';
import { motion } from 'motion/react';
import { ColorTheme } from '../types';

interface AuroraBackgroundProps {
  theme: ColorTheme;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ theme }) => {
  return (
    <div id="aurora-canvas-container" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep dark base canvas */}
      <div className="absolute inset-0 bg-[#03060f]" />

      {/* Top Left Radiant Aurora Core (Green / Emerald / Teal) */}
      <motion.div
        animate={{
          x: [-30, 20, -20, -30],
          y: [-20, 30, 10, -20],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.75, 0.9, 0.7, 0.75],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${theme.auroraColors.primary} 0%, ${theme.auroraColors.secondary} 45%, rgba(6, 182, 212, 0.15) 70%, transparent 85%)`,
        }}
        aria-hidden="true"
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] max-w-[950px] max-h-[950px] rounded-full blur-[90px] mix-blend-screen"
      />

      {/* Right Emerald & Mint Bloom (As seen in EA FC reference image) */}
      <motion.div
        animate={{
          x: [20, -35, 15, 20],
          y: [10, -25, 25, 10],
          scale: [1.05, 0.92, 1.18, 1.05],
          opacity: [0.65, 0.85, 0.6, 0.65],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        style={{
          background: `radial-gradient(circle at 65% 50%, ${theme.auroraColors.primary} 0%, ${theme.auroraColors.accent} 30%, ${theme.auroraColors.secondary} 60%, transparent 85%)`,
        }}
        aria-hidden="true"
        className="absolute top-[20%] -right-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[100px] mix-blend-screen"
      />

      {/* Mid-Lower Depth Atmosphere (Cyan / Indigo Glow) */}
      <motion.div
        animate={{
          x: [-15, 25, -15],
          y: [15, -20, 15],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        style={{
          background: `radial-gradient(circle at 50% 60%, ${theme.auroraColors.secondary} 0%, ${theme.auroraColors.tertiary} 50%, transparent 75%)`,
        }}
        aria-hidden="true"
        className="absolute bottom-[-10%] left-[15%] w-[65vw] h-[55vw] max-w-[800px] max-h-[700px] rounded-full blur-[110px] mix-blend-screen"
      />

      {/* Signature Topographic / Contour Wave Lines (Iconic EA Sports FC brand texture) */}
      <div 
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 1px), 
                            repeating-radial-gradient(circle at 20% 30%, transparent 0, transparent 14px, rgba(255,255,255,0.06) 15px, transparent 16px)`,
          backgroundSize: '100% 100%, 100% 100%',
        }}
      />

      {/* Organic Curved SVG Topo Iso-lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12] mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M-100,200 Q200,120 500,260 T1100,180 T1600,320"
          fill="none"
          stroke={theme.auroraColors.accent}
          strokeWidth="1.2"
          animate={{
            d: [
              'M-100,200 Q200,120 500,260 T1100,180 T1600,320',
              'M-100,220 Q230,160 520,240 T1120,220 T1600,300',
              'M-100,200 Q200,120 500,260 T1100,180 T1600,320',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M-100,280 Q250,200 550,340 T1150,260 T1600,400"
          fill="none"
          stroke={theme.auroraColors.secondary}
          strokeWidth="1.2"
          animate={{
            d: [
              'M-100,280 Q250,200 550,340 T1150,260 T1600,400',
              'M-100,260 Q220,240 570,310 T1130,290 T1600,370',
              'M-100,280 Q250,200 550,340 T1150,260 T1600,400',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.path
          d="M-100,450 Q300,350 600,500 T1200,420 T1600,550"
          fill="none"
          stroke={theme.auroraColors.primary}
          strokeWidth="1"
          animate={{
            d: [
              'M-100,450 Q300,350 600,500 T1200,420 T1600,550',
              'M-100,470 Q320,380 580,480 T1180,450 T1600,530',
              'M-100,450 Q300,350 600,500 T1200,420 T1600,550',
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </svg>

      {/* Subtle vignette border darkening */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(3, 6, 15, 0.7) 100%)',
        }}
      />
    </div>
  );
};
