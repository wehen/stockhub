import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';
import { ColorTheme, PendingRegistration } from '../../types';
import { soundEngine } from '../../utils/audio';

interface VerifyOtpViewProps {
  pending: PendingRegistration;
  theme: ColorTheme;
  onVerifySuccess: () => void;
  onBackToRegister: () => void;
  onResendOtp: () => void;
}

export const VerifyOtpView: React.FC<VerifyOtpViewProps> = ({
  pending,
  theme,
  onVerifySuccess,
  onBackToRegister,
  onResendOtp,
}) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    setError('');
    const cleaned = value.replace(/[^0-9]/g, '');

    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // If pasted multi-digits
    if (cleaned.length > 1) {
      const updated = [...otpDigits];
      const chars = cleaned.slice(0, 6).split('');
      chars.forEach((c, idx) => {
        if (index + idx < 6) updated[index + idx] = c;
      });
      setOtpDigits(updated);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned[0];
    setOtpDigits(updated);

    // Auto focus next
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length !== 6) {
      setError('Masukkan 6-digit kode verifikasi lengkap.');
      return;
    }

    if (enteredCode !== pending.otpCode) {
      setError('Kode verifikasi salah. Periksa kembali email simulasi Anda.');
      soundEngine.playBlip();
      return;
    }

    // Success!
    soundEngine.playCompleteChime();
    onVerifySuccess();
  };

  const autoFillOtp = () => {
    const chars = pending.otpCode.split('');
    setOtpDigits(chars);
    setError('');
    soundEngine.playBlip();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pending.otpCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Simulated Email Incoming Notification Card */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-[#071d24]/90 to-blue-950/80 border border-[#00ff87]/40 shadow-[0_0_30px_rgba(0,255,135,0.2)] backdrop-blur-xl text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#00ff87] font-semibold text-xs uppercase tracking-wider">
            <Mail className="w-4 h-4 animate-bounce" />
            <span>Simulasi Email Masuk</span>
          </div>
          <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">Baru saja</span>
        </div>

        <p className="text-xs text-white/80 mt-2">
          Pesan untuk <strong className="text-white font-mono">{pending.email}</strong>:
        </p>

        <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/50 block">Kode OTP Verifikasi:</span>
            <span className="text-lg font-mono font-black tracking-[0.25em] text-[#00ff87]">
              {pending.otpCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={copyCode}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Salin Kode"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff87]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={autoFillOtp}
              className="px-2.5 py-1.5 rounded-md bg-[#00ff87] hover:bg-[#20ff95] text-black font-bold text-xs flex items-center gap-1 shadow-[0_0_12px_rgba(0,255,135,0.4)] cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles className="w-3 h-3" />
              <span>Isi Otomatis</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main OTP Verification Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] text-center"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87] shadow-[0_0_20px_rgba(0,255,135,0.3)]">
          <Mail className="w-7 h-7" />
        </div>

        <h2 
          className="text-2xl font-black italic tracking-tight uppercase mb-1"
          style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
        >
          Verifikasi Email Anda
        </h2>

        <p className="text-xs text-white/70 max-w-sm mx-auto mb-6">
          Masukkan 6 digit kode keamanan yang dikirimkan ke <strong className="text-white">{pending.email}</strong>.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit OTP Input Boxes */}
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-xl bg-white/5 border outline-none transition-all ${
                  digit
                    ? 'border-[#00ff87] bg-white/10 text-white shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                    : 'border-white/20 text-white/90 focus:border-[#00ff87] focus:bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(0,255,135,0.4)] cursor-pointer flex items-center justify-center gap-2 mb-4"
            style={{ backgroundColor: theme.indicatorColor }}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Verifikasi & Lanjutkan Login</span>
          </button>
        </form>

        {/* Resend OTP Timer & Back link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onBackToRegister}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ubah Data Registrasi</span>
          </button>

          {resendTimer > 0 ? (
            <span className="tabular-nums text-white/50">
              Kirim ulang kode dalam <strong className="text-white">{resendTimer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                onResendOtp();
                setResendTimer(60);
                soundEngine.playBlip();
              }}
              className="flex items-center gap-1 text-[#00ff87] hover:underline cursor-pointer font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Kirim Ulang Kode OTP</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
