export interface StartupConfig {
  mainTitle: string;
  badgeTopText: string;
  badgeBottomText: string;
  tagline: string;
  themeId: string;
  loadingSpeed: number; // in seconds
  soundEnabled: boolean;
  statusMessages: string[];
}

export interface ColorTheme {
  id: string;
  name: string;
  auroraColors: {
    primary: string; // e.g. emerald / green
    secondary: string; // e.g. cyan / teal
    tertiary: string; // e.g. dark blue / indigo
    accent: string; // e.g. lime / bright neon
  };
  indicatorColor: string; // hex or tailwind class for the triangle marker
  barGradient: string;
  glowColor: string;
}

export interface PresetConfig {
  id: string;
  name: string;
  config: StartupConfig;
}

export interface RegisteredUser {
  id: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  createdAt: string;
}

export interface PendingRegistration {
  email: string;
  username: string;
  password: string;
  otpCode: string;
  expiresAt: number;
}

export type AuthView = 'login' | 'register' | 'verify' | 'dashboard';
