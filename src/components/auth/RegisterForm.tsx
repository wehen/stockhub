import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { ColorTheme } from '../../types';
import { soundEngine } from '../../utils/audio';

interface RegisterFormProps {
  theme: ColorTheme;
  onProceedToOtp: (registrationData: { email: string; username: string; password: string }) => void;
  onSwitchToLogin: () => void;
  existingEmails: string[];
  existingUsernames: string[];
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  theme,
  onProceedToOtp,
  onSwitchToLogin,
  existingEmails,
  existingUsernames,
}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;
  const isPasswordMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanUsername || !password || !confirmPassword) {
      setError('Harap isi semua kolom pendaftaran.');
      soundEngine.playBlip();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Format alamat email tidak valid.');
      soundEngine.playBlip();
      return;
    }

    // Username validation
    if (cleanUsername.length < 3) {
      setError('Username minimal terdiri dari 3 karakter.');
      soundEngine.playBlip();
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password minimal harus terdiri dari 6 karakter.');
      soundEngine.playBlip();
      return;
    }

    if (password !== confirmPassword) {
      setError('Verifikasi password tidak sesuai dengan password.');
      soundEngine.playBlip();
      return;
    }

    // Check duplicate
    if (existingEmails.includes(cleanEmail)) {
      setError('Email ini sudah terdaftar. Silakan gunakan menu login.');
      soundEngine.playBlip();
      return;
    }

    if (existingUsernames.map(u => u.toLowerCase()).includes(cleanUsername.toLowerCase())) {
      setError('Username ini sudah dipakai pengguna lain.');
      soundEngine.playBlip();
      return;
    }

    soundEngine.playBlip();
    onProceedToOtp({
      email: cleanEmail,
      username: cleanUsername,
      password,
    });
  };

  return (
    <motion.div
      id="register-card"
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
          Daftar Akun Baru
        </h2>
        <p className="text-xs text-white/60 mt-1">
          Lengkapi formulir untuk mendapatkan akses ke platform
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@domain.com"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username_anda"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
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

        {/* Verifikasi Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              Verifikasi Password
            </label>
            {isPasswordMatch && (
              <span className="text-[11px] text-[#00ff87] font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Password Cocok
              </span>
            )}
            {isPasswordMismatch && (
              <span className="text-[11px] text-red-400 font-medium">
                Password Tidak Sama
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password Anda"
              className={`w-full bg-white/5 border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all ${
                isPasswordMatch
                  ? 'border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]'
                  : isPasswordMismatch
                  ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                  : 'border-white/20 focus:border-[#00ff87]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit button: Next / Kirim Kode Verifikasi */}
        <button
          type="submit"
          className="w-full mt-2 py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(0,255,135,0.4)] cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.indicatorColor }}
        >
          <span>Lanjut: Kirim Kode Verifikasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to login */}
      <div className="mt-6 text-center pt-4 border-t border-white/10 text-xs text-white/60">
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-[#00ff87] hover:underline cursor-pointer ml-1"
        >
          Masuk Sekarang
        </button>
      </div>
    </motion.div>
  );
};
