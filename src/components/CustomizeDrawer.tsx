import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ColorTheme, PresetConfig, StartupConfig } from '../types';
import { COLOR_THEMES, PRESETS } from '../constants/presets';
import { 
  X, 
  Sparkles, 
  Type, 
  Palette, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Check, 
  Sliders,
  Play
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: StartupConfig;
  onUpdateConfig: (newConfig: Partial<StartupConfig>) => void;
  onRestartLoading: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onRestartLoading,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'theme' | 'speed'>('text');

  const handlePresetSelect = (preset: PresetConfig) => {
    soundEngine.playBlip();
    onUpdateConfig(preset.config);
    onRestartLoading();
  };

  const handleThemeSelect = (theme: ColorTheme) => {
    soundEngine.playBlip();
    onUpdateConfig({ themeId: theme.id });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="customizer-panel"
          initial={{ opacity: 0, x: 340 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 340 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#070d1a]/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight">Pengaturan Startup</h2>
                <p className="text-xs text-white/50">Ubah tulisan, animasi & warna</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggleFullscreen}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Presets Carousel */}
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02]">
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Preset Desain Cepat
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => {
                const isActive = config.mainTitle === preset.config.mainTitle && config.themeId === preset.config.themeId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-2.5 py-2 text-left rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
                      isActive
                        ? 'bg-[#00ff87]/15 border-[#00ff87] text-white shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#00ff87] flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 px-5 pt-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'border-[#00ff87] text-[#00ff87]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Ganti Tulisan</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'theme'
                  ? 'border-[#00ff87] text-[#00ff87]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Warna Aurora</span>
            </button>
            <button
              onClick={() => setActiveTab('speed')}
              className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'speed'
                  ? 'border-[#00ff87] text-[#00ff87]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kecepatan & Audio</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'text' && (
              <div className="space-y-4">
                {/* Main Display Title */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Judul Utama (Teks Besar Miring)
                  </label>
                  <input
                    type="text"
                    value={config.mainTitle}
                    onChange={(e) => onUpdateConfig({ mainTitle: e.target.value })}
                    placeholder="Contoh: FC 26, STARTUP 26, NAMA ANDA"
                    className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] rounded-lg px-3.5 py-2.5 text-sm text-white font-bold tracking-wide outline-none transition-all uppercase"
                  />
                  <span className="text-[11px] text-white/40 mt-1 block">
                    Gaya huruf bold atletik miring seperti di logo EA Sports FC.
                  </span>
                </div>

                {/* Badge Circle Top & Bottom Text */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Badge Atas
                    </label>
                    <input
                      type="text"
                      value={config.badgeTopText}
                      onChange={(e) => onUpdateConfig({ badgeTopText: e.target.value })}
                      placeholder="Contoh: EA, AI, DEV"
                      className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] rounded-lg px-3 py-2 text-sm text-white font-bold outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Badge Bawah
                    </label>
                    <input
                      type="text"
                      value={config.badgeBottomText}
                      onChange={(e) => onUpdateConfig({ badgeBottomText: e.target.value })}
                      placeholder="Contoh: SPORTS™, STUDIO"
                      className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] rounded-lg px-3 py-2 text-sm text-white font-bold outline-none uppercase"
                    />
                  </div>
                </div>

                {/* Tagline / Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Tagline / Teks Kecil Tengah
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => onUpdateConfig({ tagline: e.target.value })}
                    placeholder="Contoh: THE WORLD'S GAME"
                    className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                </div>

                {/* Custom Status Messages */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Pesan Loading (Dipisahkan koma)
                  </label>
                  <textarea
                    rows={3}
                    value={config.statusMessages.join(', ')}
                    onChange={(e) => {
                      const msgs = e.target.value
                        .split(',')
                        .map((m) => m.trim())
                        .filter((m) => m.length > 0);
                      onUpdateConfig({ statusMessages: msgs });
                    }}
                    placeholder="CONNECTING..., LOADING ASSETS..., READY TO PLAY"
                    className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] rounded-lg px-3 py-2 text-xs text-white/90 outline-none uppercase font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-3">
                <span className="text-xs text-white/50 block mb-1">
                  Pilih nuansa aurora neon yang bergerak di latar belakang:
                </span>
                {COLOR_THEMES.map((theme) => {
                  const isSelected = config.themeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white/10 border-[#00ff87] shadow-[0_0_16px_rgba(0,255,135,0.25)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Swatch color circles */}
                        <div className="flex -space-x-1.5">
                          <div
                            className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.auroraColors.primary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.auroraColors.secondary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: theme.indicatorColor }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{theme.name}</div>
                          <div className="text-[11px] text-white/50">Aurora glow & triangle marker</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#00ff87] text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'speed' && (
              <div className="space-y-5">
                {/* Speed Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Durasi Loading Animasi
                    </label>
                    <span className="text-xs font-mono font-bold text-[#00ff87]">
                      {config.loadingSpeed} Detik
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.5}
                    max={10}
                    step={0.5}
                    value={config.loadingSpeed}
                    onChange={(e) => onUpdateConfig({ loadingSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-[#00ff87] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>Cepat (1.5s)</span>
                    <span>Standar (4s)</span>
                    <span>Sinematik (10s)</span>
                  </div>
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
                      {config.soundEnabled ? <Volume2 className="w-4 h-4 text-[#00ff87]" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Efek Suara Startup</div>
                      <div className="text-[11px] text-white/50">Synthesizer sub-bass & completion chime</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = !config.soundEnabled;
                      onUpdateConfig({ soundEnabled: next });
                      if (next) soundEngine.playBlip();
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      config.soundEnabled ? 'bg-[#00ff87]' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: config.soundEnabled ? 26 : 3 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-4 h-4 rounded-full bg-black mt-1"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playBlip();
                onRestartLoading();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00ff87] hover:bg-[#20ff95] text-black font-extrabold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,135,0.4)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Putar Ulang Animasi</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
