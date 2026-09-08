import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthView, ColorTheme, PendingRegistration, RegisteredUser, StartupConfig } from '../../types';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { VerifyOtpView } from './VerifyOtpView';
import { UserDashboard } from './UserDashboard';
import { soundEngine } from '../../utils/audio';
import { RotateCcw, Sliders } from 'lucide-react';

interface AuthContainerProps {
  config: StartupConfig;
  theme: ColorTheme;
  onReplayStartup: () => void;
  onOpenCustomizer: () => void;
}

const STORAGE_USERS_KEY = 'startup_auth_users_v1';
const STORAGE_CURRENT_USER_KEY = 'startup_current_user_v1';

const INITIAL_DEMO_USERS: RegisteredUser[] = [
  {
    id: 'usr_demo',
    email: 'admin@stockhub.com',
    username: 'stockhub',
    password: 'password123',
    isVerified: true,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

export const AuthContainer: React.FC<AuthContainerProps> = ({
  config,
  theme,
  onReplayStartup,
  onOpenCustomizer,
}) => {
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return null;
  });

  const [authView, setAuthView] = useState<AuthView>(() => {
    return currentUser ? 'dashboard' : 'login';
  });

  const [pendingRegistration, setPendingRegistration] = useState<PendingRegistration | null>(null);
  const [prefillIdentifier, setPrefillIdentifier] = useState<string>('');
  const [justVerifiedNotice, setJustVerifiedNotice] = useState<string>('');

  // Persist users
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {
      // Ignore
    }
  }, [users]);

  // Persist current session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  // Helper to generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Step 1 of Register -> proceed to OTP verification
  const handleProceedToOtp = (regData: { email: string; username: string; password: string }) => {
    const code = generateOtp();
    const pending: PendingRegistration = {
      ...regData,
      otpCode: code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    setPendingRegistration(pending);
    setAuthView('verify');
    soundEngine.playStartupSwell();
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!pendingRegistration) return;
    const newCode = generateOtp();
    setPendingRegistration({
      ...pendingRegistration,
      otpCode: newCode,
    });
  };

  // Step 2: OTP verification succeeds!
  const handleVerifySuccess = () => {
    if (!pendingRegistration) return;

    const newUser: RegisteredUser = {
      id: `usr_${Date.now()}`,
      email: pendingRegistration.email,
      username: pendingRegistration.username,
      password: pendingRegistration.password,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    // Save to users list
    setUsers((prev) => [...prev, newUser]);
    setPrefillIdentifier(newUser.username);
    setJustVerifiedNotice(
      `Akun (${newUser.email}) telah aktif. Silakan masuk menggunakan username atau email Anda!`
    );
    setPendingRegistration(null);
    setAuthView('login');
  };

  // Login successful
  const handleLoginSuccess = (user: RegisteredUser) => {
    setCurrentUser(user);
    setAuthView('dashboard');
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('login');
    setJustVerifiedNotice('');
  };

  // If user is authenticated on dashboard, render the authentic full-screen console menu directly
  if (authView === 'dashboard' && currentUser) {
    return (
      <UserDashboard
        user={currentUser}
        config={config}
        theme={theme}
        onLogout={handleLogout}
        onReplayStartup={onReplayStartup}
        onOpenCustomizer={onOpenCustomizer}
      />
    );
  }

  return (
    <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">
      {/* Brand Header Display (Shows the custom logo text e.g. STOCKHUB / FC 26) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3 cursor-pointer group"
        onClick={onOpenCustomizer}
        title="Klik untuk ubah judul dan tema"
      >
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-black font-black text-xs sm:text-sm tracking-tighter italic border-2 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          {config.badgeTopText || 'EA'}
        </div>
        <div 
          className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
        >
          {config.mainTitle}
        </div>
      </motion.div>

      {/* Auth Views: Login, Register, Verify, or Dashboard */}
      <AnimatePresence mode="wait">
        {authView === 'login' && (
          <LoginForm
            key="view-login"
            theme={theme}
            registeredUsers={users}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => {
              soundEngine.playBlip();
              setAuthView('register');
              setJustVerifiedNotice('');
            }}
            prefillIdentifier={prefillIdentifier}
            justVerifiedMessage={justVerifiedNotice}
          />
        )}

        {authView === 'register' && (
          <RegisterForm
            key="view-register"
            theme={theme}
            onProceedToOtp={handleProceedToOtp}
            onSwitchToLogin={() => {
              soundEngine.playBlip();
              setAuthView('login');
            }}
            existingEmails={users.map((u) => u.email)}
            existingUsernames={users.map((u) => u.username)}
          />
        )}

        {authView === 'verify' && pendingRegistration && (
          <VerifyOtpView
            key="view-verify"
            pending={pendingRegistration}
            theme={theme}
            onVerifySuccess={handleVerifySuccess}
            onBackToRegister={() => {
              soundEngine.playBlip();
              setAuthView('register');
            }}
            onResendOtp={handleResendOtp}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Quick Replay helper */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center gap-3 text-xs text-white/50"
        >
          <button
            onClick={onReplayStartup}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tes Ulang Loading Screen Startup (R)</span>
          </button>
          <span>•</span>
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 hover:text-[#00ff87] transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pengaturan Teks & Tema</span>
          </button>
        </motion.div>
    </div>
  );
};
