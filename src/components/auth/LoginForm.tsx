import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Eye, EyeOff, ShieldCheck, LogIn, AlertCircle, CheckCircle2, Check, X } from 'lucide-react';
import { ColorTheme, RegisteredUser } from '../../types';
import { CaptchaBox } from '../CaptchaBox';
import { soundEngine } from '../../utils/audio';

interface LoginFormProps {
  theme: ColorTheme;
  registeredUsers: RegisteredUser[];
  onLoginSuccess: (user: RegisteredUser) => void;
  onSwitchToRegister: () => void;
  prefillIdentifier?: string;
  justVerifiedMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  theme,
  registeredUsers,
  onLoginSuccess,
  onSwitchToRegister,
  prefillIdentifier = '',
  justVerifiedMessage = '',
}) => {
  const [identifier, setIdentifier] = useState(prefillIdentifier);
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(justVerifiedMessage);

  // Stable callback so CaptchaBox doesn't regenerate when inputs change
  const handleCaptchaChange = useCallback((code: string) => {
    setGeneratedCaptcha(code);
  }, []);

  useEffect(() => {
    if (prefillIdentifier) {
      setIdentifier(prefillIdentifier);
    }
  }, [prefillIdentifier]);

  useEffect(() => {
    if (justVerifiedMessage) {
      setSuccessNotice(justVerifiedMessage);
    }
  }, [justVerifiedMessage]);

  // Real-time verification state
  const isCaptchaFilled = captchaInput.length >= 5;
  const isCaptchaCorrect = isCaptchaFilled && captchaInput.toUpperCase() === generatedCaptcha.toUpperCase();
  const isCaptchaWrong = isCaptchaFilled && !isCaptchaCorrect;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    const cleanCaptcha = captchaInput.trim().toUpperCase();

    if (!cleanIdentifier || !password) {
      setError('Harap masukkan username/email dan password.');
      soundEngine.playBlip();
      return;
    }

    if (!cleanCaptcha) {
      setError('Harap masukkan kode Captcha keamanan.');
      soundEngine.playBlip();
      return;
    }

    // Verify Captcha
    if (cleanCaptcha !== generatedCaptcha.toUpperCase()) {
      setError('Kode Captcha salah. Periksa kembali kode pada kotak keamanan.');
      soundEngine.playBlip();
      return;
    }

    // Find registered user by username or email
    const user = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
        u.username.toLowerCase() === cleanIdentifier.toLowerCase()
    );

    if (!user) {
      setError('Akun tidak ditemukan. Silakan registrasi terlebih dahulu.');
      soundEngine.playBlip();
      return;
    }

    if (user.password !== password) {
      setError('Password yang Anda masukkan salah.');
      soundEngine.playBlip();
      return;
    }

    // Login success!
    soundEngine.playCompleteChime();
    onLoginSuccess(user);
  };

  return (
    <motion.div
      id="login-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-black/55 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left"
    >
      <div className="mb-6 text-center">
        <h2 
          className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase"
          style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
        >
          Masuk ke Akun
        </h2>
        <p className="text-xs text-white/60 mt-1">
          Masukkan username atau email terdaftar Anda
        </p>
      </div>

      {/* Success Banner if redirected after verification */}
      {successNotice && (
        <div className="mb-5 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#00ff87] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white block">Email Berhasil Terverifikasi!</span>
            <span>{successNotice}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username or Email */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Username atau Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setSuccessNotice('');
              }}
              placeholder="username atau nama@domain.com"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setError('Fitur reset password demo: Silakan daftar akun baru atau gunakan password yang didaftarkan.');
              }}
              className="text-[11px] text-white/50 hover:text-[#00ff87] transition-colors cursor-pointer"
            >
              Lupa Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Captcha Security */}
        <div className="pt-1 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff87]" />
              <span>Kode Keamanan Captcha</span>
            </label>
            {isCaptchaCorrect && (
              <span className="text-[11px] font-bold text-[#00ff87] flex items-center gap-1 bg-[#00ff87]/15 px-2.5 py-0.5 rounded-full border border-[#00ff87]/30">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>KODE VALID</span>
              </span>
            )}
            {isCaptchaWrong && (
              <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 bg-red-500/15 px-2.5 py-0.5 rounded-full border border-red-500/30">
                <X className="w-3 h-3 stroke-[3]" />
                <span>BELUM COCOK</span>
              </span>
            )}
          </div>

          {/* Captcha Visual Box (Full Width, never clipped, crisp vector letters) */}
          <CaptchaBox 
            onCaptchaChange={handleCaptchaChange} 
            accentColor={theme.indicatorColor} 
          />

          {/* User Input Field with dedicated full width */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <ShieldCheck className={`w-4 h-4 transition-colors ${isCaptchaCorrect ? 'text-[#00ff87]' : ''}`} />
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setError('');
              }}
              placeholder="Masukkan 5 karakter kode di atas..."
              maxLength={5}
              className={`w-full bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-sm font-mono font-bold tracking-[0.25em] uppercase text-white placeholder-white/30 placeholder:tracking-normal outline-none transition-all ${
                isCaptchaCorrect
                  ? 'border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] bg-emerald-950/25 text-[#00ff87]'
                  : isCaptchaWrong
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]'
              }`}
            />
            {isCaptchaCorrect && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#00ff87]">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Helper links */}
          <div className="flex items-center justify-between text-[11px] text-white/50 px-1">
            <span>Klik gambar untuk acak kode baru</span>
            <button
              type="button"
              onClick={() => setCaptchaInput(generatedCaptcha)}
              className="text-[#00ff87] hover:underline cursor-pointer font-medium"
            >
              Isi otomatis kode
            </button>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 hover:text-white">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#00ff87] cursor-pointer"
            />
            <span>Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Submit button: Masuk */}
        <button
          type="submit"
          className="w-full mt-2 py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(0,255,135,0.4)] cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.indicatorColor }}
        >
          <LogIn className="w-4 h-4 stroke-[2.5]" />
          <span>Masuk / Login</span>
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center pt-4 border-t border-white/10 text-xs text-white/60">
        Belum memiliki akun terdaftar?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-[#00ff87] hover:underline cursor-pointer ml-1"
        >
          Daftar Akun Baru
        </button>
      </div>
    </motion.div>
  );
};
