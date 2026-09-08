import React from 'react';
import { motion } from 'motion/react';
import { ColorTheme, StartupConfig } from '../types';
import { RotateCcw, Sliders, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  config: StartupConfig;
  theme: ColorTheme;
  onBackToLoading: () => void;
  onOpenCustomizer: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  config,
  theme,
  onBackToLoading,
  onOpenCustomizer,
}) => {
  return (
    <motion.div
      id="welcome-screen"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center text-white"
    >
      {/* Background ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.auroraColors.primary} 0%, ${theme.auroraColors.secondary} 50%, transparent 80%)`,
        }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-white/90 mb-6"
      >
        <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
        <span>Startup Selesai Dimuat 100%</span>
      </motion.div>

      {/* Main Title display */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase mb-4"
        style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
      >
        <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
          SELAMAT DATANG DI{' '}
        </span>
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00ff87] to-[#00d2ff]"
        >
          {config.mainTitle}
        </span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="max-w-xl text-sm sm:text-base text-white/70 mb-8 font-normal"
      >
        Halaman loading startup Anda telah berhasil diinisialisasi dengan animasi aurora, tipografi kinetik, dan progress bar interaktif.
      </motion.p>

      {/* Feature cards row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-10 text-left"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-[#00ff87]/20 flex items-center justify-center text-[#00ff87] mb-2.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold mb-1">Animasi Aurora Asli</h3>
          <p className="text-xs text-white/60">Glow organik & topographic waves bergaya EA Sports FC.</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] mb-2.5">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold mb-1">Teks Bebas Diganti</h3>
          <p className="text-xs text-white/60">Ubah judul, badge, tagline, dan pesan loading secara instan.</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center text-[#fbbf24] mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold mb-1">Web Audio Synthesizer</h3>
          <p className="text-xs text-white/60">Efek suara sinematik console-game tanpa file eksternal.</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <button
          onClick={onBackToLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#00ff87] hover:bg-[#20ff95] text-black font-extrabold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(0,255,135,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Tes Putar Ulang Loading Screen</span>
        </button>

        <button
          onClick={onOpenCustomizer}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all hover:scale-105 cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Buka Panel Kustomisasi</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
