import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StartupConfig } from './types';
import { COLOR_THEMES, DEFAULT_CONFIG } from './constants/presets';
import { AuroraBackground } from './components/AuroraBackground';
import { StartupLogo } from './components/StartupLogo';
import { ProgressBar } from './components/ProgressBar';
import { CustomizeDrawer } from './components/CustomizeDrawer';
import { AuthContainer } from './components/auth/AuthContainer';
import { soundEngine } from './utils/audio';
import { 
  Sliders, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff,
  Sparkles,
  LogIn
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<StartupConfig>(DEFAULT_CONFIG);
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAppEntered, setIsAppEntered] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Active theme object
  const currentTheme = useMemo(() => {
    return COLOR_THEMES.find((t) => t.id === config.themeId) || COLOR_THEMES[0];
  }, [config.themeId]);

  // Current status message based on progress
  const currentStatus = useMemo(() => {
    if (!config.statusMessages || config.statusMessages.length === 0) return 'LOADING...';
    const numMessages = config.statusMessages.length;
    const index = Math.min(
      Math.floor((progress / 100) * numMessages),
      numMessages - 1
    );
    return config.statusMessages[index];
  }, [progress, config.statusMessages]);

  // Restart loading animation
  const restartLoading = useCallback(() => {
    setProgress(0);
    setIsLoaded(false);
    setIsAppEntered(false);

    if (config.soundEnabled) {
      soundEngine.playStartupSwell();
    }
  }, [config.soundEnabled]);

  // Fullscreen handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Update configuration helper
  const handleUpdateConfig = useCallback((newConfig: Partial<StartupConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Realistic progressive loading loop
  useEffect(() => {
    if (isLoaded || isAppEntered) return;

    // Total duration in ms
    const totalDurationMs = Math.max(1200, config.loadingSpeed * 1000);
    const intervalMs = 25;
    const stepIncrement = (100 / (totalDurationMs / intervalMs));

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Variable acceleration & deceleration curve for authentic game startup feel
        let jitter = (Math.random() * 0.8 + 0.6);
        // Slight pause at 35% and 88% simulating server connection handshake
        if ((prev > 32 && prev < 38) || (prev > 84 && prev < 90)) {
          jitter *= 0.4;
        }

        const next = prev + stepIncrement * jitter;
        if (next >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          if (config.soundEnabled) {
            soundEngine.playCompleteChime();
          }
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLoaded, isAppEntered, config.loadingSpeed, config.soundEnabled]);

  // Play initial startup audio on mount or first click
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (config.soundEnabled) {
        soundEngine.playStartupSwell();
      }
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [config.soundEnabled]);

  // Global Keyboard shortcuts: Space/Enter = continue, R = restart, C = customizer, H = toggle UI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing in inputs
      }

      if (e.code === 'KeyR') {
        restartLoading();
      } else if (e.code === 'KeyC') {
        setIsCustomizerOpen((prev) => !prev);
      } else if (e.code === 'KeyH') {
        setShowControls((prev) => !prev);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if ((e.code === 'Space' || e.code === 'Enter') && isLoaded && !isAppEntered) {
        e.preventDefault();
        setIsAppEntered(true);
        if (config.soundEnabled) soundEngine.playBlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoaded, isAppEntered, restartLoading, toggleFullscreen, config.soundEnabled]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#03060f] select-none text-white">
      {/* 1. Dynamic Animated Aurora Background & Contour Waves */}
      <AuroraBackground theme={currentTheme} />

      {/* 2. Floating Quick Controls Bar (Top Toolbar - only during startup screen) */}
      <AnimatePresence>
        {showControls && !isAppEntered && (
          <motion.header
            id="floating-top-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none"
          >
            {/* Left badge & quick helper info */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 backdrop-blur-xl text-xs font-semibold text-white/90 shadow-lg hover:border-[#00ff87]/50 transition-all cursor-pointer group"
              >
                <Sliders className="w-3.5 h-3.5 text-[#00ff87] group-hover:rotate-45 transition-transform" />
                <span>Ganti Teks & Desain</span>
              </button>

              <button
                onClick={restartLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-xl text-xs font-medium text-white/70 hover:text-white transition-all cursor-pointer"
                title="Putar Ulang Animasi (Shortcut R)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ulangi (R)</span>
              </button>

              {!isAppEntered && (
                <button
                  onClick={() => {
                    setIsAppEntered(true);
                    soundEngine.playBlip();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00ff87]/20 hover:bg-[#00ff87]/30 border border-[#00ff87]/40 backdrop-blur-xl text-xs font-bold text-[#00ff87] hover:text-white transition-all cursor-pointer"
                  title="Langsung menuju form login"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Halaman Login</span>
                </button>
              )}
            </div>

            {/* Right quick toggles: Audio, Fullscreen, Hide UI */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const next = !config.soundEnabled;
                  handleUpdateConfig({ soundEnabled: next });
                  if (next) soundEngine.playBlip();
                }}
                className={`p-2 rounded-full border backdrop-blur-xl transition-all cursor-pointer ${
                  config.soundEnabled
                    ? 'bg-black/40 border-[#00ff87]/40 text-[#00ff87]'
                    : 'bg-black/40 border-white/10 text-white/40 hover:text-white'
                }`}
                title={config.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              >
                {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-xl text-white/70 hover:text-white transition-all cursor-pointer"
                title={isFullscreen ? 'Keluar Fullscreen (F)' : 'Mode Layar Penuh (F)'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Hide Controls (Presentation mode) */}
              <button
                onClick={() => setShowControls(false)}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-xl text-white/70 hover:text-white transition-all cursor-pointer"
                title="Sembunyikan Menu (Tekan H untuk kembalikan)"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Unhide UI Button when controls are hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl text-white/80 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-105"
          title="Tampilkan Kembali Menu (H)"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* 3. Main Views Switcher: Loading Screen OR Post-Loading Welcome Screen */}
      <AnimatePresence mode="wait">
        {!isAppEntered ? (
          <motion.div
            key="startup-loading-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full flex flex-col justify-between items-center"
          >
            {/* Center Area: Iconic Slanted Logo & Badge */}
            <div className="flex-1 w-full flex items-center justify-center">
              <StartupLogo
                config={config}
                theme={currentTheme}
                isCustomizing={isCustomizerOpen}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onUpdateText={(field, val) => handleUpdateConfig({ [field]: val })}
              />
            </div>

            {/* Bottom Area: Animated Progress Bar with EA FC Triangle V Indicator */}
            <ProgressBar
              progress={progress}
              statusMessage={currentStatus}
              theme={currentTheme}
              isComplete={isLoaded}
              onRestart={restartLoading}
              onFinishLoading={() => {
                setIsAppEntered(true);
                if (config.soundEnabled) soundEngine.playBlip();
              }}
            />
          </motion.div>
        ) : (
          <AuthContainer
            key="auth-app-view"
            config={config}
            theme={currentTheme}
            onReplayStartup={restartLoading}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* 4. Customizer Drawer (Right Slide-in) */}
      <CustomizeDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onRestartLoading={restartLoading}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </main>
  );
}
