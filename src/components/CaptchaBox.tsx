import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CaptchaBoxProps {
  onCaptchaChange: (code: string) => void;
  accentColor: string;
}

// Clear, unambiguous alphanumeric characters (excluded 0/O, 1/I, 8/B)
const CAPTCHA_CHARS = '23456789ACDEFGHJKLMNPQRSTUVWXYZ';

interface CharStyle {
  char: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({ onCaptchaChange, accentColor }) => {
  const [captchaText, setCaptchaText] = useState<string>('');
  const [charStyles, setCharStyles] = useState<CharStyle[]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Keep a stable ref to onCaptchaChange to prevent parent re-render loops
  const onCaptchaChangeRef = useRef(onCaptchaChange);
  useEffect(() => {
    onCaptchaChangeRef.current = onCaptchaChange;
  }, [onCaptchaChange]);

  // Generate 5 characters with calculated crisp vector positions
  const generateNewCode = useCallback(() => {
    let code = '';
    const styles: CharStyle[] = [];
    const colors = ['#ffffff', accentColor || '#00ff87', '#38bdf8', '#ffffff', '#a7f3d0'];

    // 5 characters evenly distributed inside 260px width
    // Positions: 35, 80, 125, 170, 215
    for (let i = 0; i < 5; i++) {
      const char = CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
      code += char;
      styles.push({
        char,
        x: 36 + i * 46,
        y: 32 + (i % 2 === 0 ? -2 : 2),
        rotation: (i % 2 === 0 ? -1 : 1) * ((i * 4 + 3) % 9), // gentle angle: -7 to +7 deg
        color: colors[i % colors.length],
      });
    }

    setCaptchaText(code);
    setCharStyles(styles);
    onCaptchaChangeRef.current(code);
  }, [accentColor]);

  // Generate code only once on mount
  useEffect(() => {
    generateNewCode();
  }, [generateNewCode]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRotating(true);
    soundEngine.playBlip();
    generateNewCode();
    setTimeout(() => setIsRotating(false), 500);
  };

  // Text-to-Speech audio reader
  const handleAudioSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const spaced = captchaText.split('').join('. ');
      const utterance = new SpeechSynthesisUtterance(spaced);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Visual Vector SVG Captcha Badge (Clickable to regenerate) */}
      <div
        onClick={handleRefresh}
        className="relative flex-1 h-14 bg-gradient-to-r from-[#07111e] via-[#0b1b2d] to-[#07111e] rounded-xl border border-white/20 hover:border-[#00ff87]/60 flex items-center justify-center overflow-hidden select-none cursor-pointer transition-all shadow-inner group"
        title="Klik gambar untuk ganti kode Captcha"
      >
        <svg
          viewBox="0 0 260 48"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full pointer-events-none p-1"
        >
          <defs>
            {/* Background grid pattern */}
            <pattern id="captcha-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8" />
            </pattern>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Grid background */}
          <rect width="260" height="48" fill="url(#captcha-grid)" />

          {/* Security wavy lines */}
          <path
            d="M 0 24 Q 65 6, 130 24 T 260 22"
            fill="none"
            stroke={accentColor || '#00ff87'}
            strokeWidth="1.6"
            strokeOpacity="0.35"
          />
          <path
            d="M 0 32 Q 70 46, 140 30 T 260 36"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeOpacity="0.35"
          />

          {/* Subtle noise dots */}
          <circle cx="20" cy="12" r="1.2" fill="rgba(255,255,255,0.3)" />
          <circle cx="58" cy="38" r="1" fill="rgba(0,255,135,0.4)" />
          <circle cx="110" cy="14" r="1.3" fill="rgba(255,255,255,0.3)" />
          <circle cx="165" cy="40" r="1.1" fill="rgba(56,189,248,0.4)" />
          <circle cx="235" cy="16" r="1.2" fill="rgba(255,255,255,0.3)" />
          <circle cx="195" cy="10" r="1" fill="rgba(0,255,135,0.3)" />

          {/* High-Contrast Crisp Characters */}
          {charStyles.map((item, idx) => (
            <text
              key={idx}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              transform={`rotate(${item.rotation}, ${item.x}, ${item.y})`}
              fill={item.color}
              fontSize="27"
              fontWeight="900"
              fontFamily="'Chakra Petch', 'Barlow Condensed', 'Courier New', monospace"
              filter="url(#glow)"
              style={{
                letterSpacing: '0.05em',
                userSelect: 'none',
              }}
            >
              {item.char}
            </text>
          ))}
        </svg>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-white/95 transition-opacity backdrop-blur-[1px]">
          <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-full border border-white/20">
            <RotateCw className="w-3.5 h-3.5 text-[#00ff87]" />
            <span>Klik ganti kode</span>
          </span>
        </div>
      </div>

      {/* Audio Button (Dengarkan Kode) */}
      <button
        type="button"
        onClick={handleAudioSpeak}
        className={`h-14 w-12 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
          isSpeaking ? 'text-[#00ff87] border-[#00ff87]/50 bg-[#00ff87]/10' : 'text-white/70 hover:text-white'
        }`}
        title="Dengarkan pembacaan kode (Audio)"
      >
        <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
        <span className="text-[9px] font-semibold tracking-tighter">Audio</span>
      </button>

      {/* Refresh Button (Acak Ulang) */}
      <button
        type="button"
        onClick={handleRefresh}
        className="h-14 w-12 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-[#00ff87] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
        title="Acak ulang kode Captcha"
      >
        <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`} />
        <span className="text-[9px] font-semibold tracking-tighter">Acak</span>
      </button>
    </div>
  );
};
