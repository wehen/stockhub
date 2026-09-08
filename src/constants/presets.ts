import { ColorTheme, PresetConfig, StartupConfig } from '../types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'ea-fc-emerald',
    name: 'FC Emerald & Aurora (Original)',
    auroraColors: {
      primary: '#00ff87', // bright electric neon green
      secondary: '#00d2ff', // electric cyan
      tertiary: '#0a2342', // deep rich navy
      accent: '#39ff14', // lime spark
    },
    indicatorColor: '#00ff87',
    barGradient: 'from-[#00ff87] via-[#00d2ff] to-[#3b82f6]',
    glowColor: 'rgba(0, 255, 135, 0.4)',
  },
  {
    id: 'champions-blue',
    name: 'Champions Electric Blue',
    auroraColors: {
      primary: '#0066ff',
      secondary: '#00f0ff',
      tertiary: '#0f172a',
      accent: '#38bdf8',
    },
    indicatorColor: '#00f0ff',
    barGradient: 'from-[#0066ff] via-[#00f0ff] to-[#60a5fa]',
    glowColor: 'rgba(0, 240, 255, 0.4)',
  },
  {
    id: 'cyber-magenta',
    name: 'Neon Cyberpunk',
    auroraColors: {
      primary: '#ff007f',
      secondary: '#7928ca',
      tertiary: '#18002e',
      accent: '#00f0ff',
    },
    indicatorColor: '#ff007f',
    barGradient: 'from-[#ff007f] via-[#7928ca] to-[#00f0ff]',
    glowColor: 'rgba(255, 0, 127, 0.4)',
  },
  {
    id: 'golden-trophy',
    name: 'Ultimate Gold Edition',
    auroraColors: {
      primary: '#fbbf24',
      secondary: '#d97706',
      tertiary: '#1a1306',
      accent: '#fef08a',
    },
    indicatorColor: '#fbbf24',
    barGradient: 'from-[#f59e0b] via-[#fbbf24] to-[#fef08a]',
    glowColor: 'rgba(251, 191, 36, 0.4)',
  },
  {
    id: 'crimson-stealth',
    name: 'Crimson Phantom',
    auroraColors: {
      primary: '#ef4444',
      secondary: '#f97316',
      tertiary: '#180509',
      accent: '#ff2a55',
    },
    indicatorColor: '#ef4444',
    barGradient: 'from-[#ef4444] via-[#f97316] to-[#fbbf24]',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
];

export const DEFAULT_CONFIG: StartupConfig = {
  mainTitle: 'STOCKHUB',
  badgeTopText: 'SH',
  badgeBottomText: 'PORTAL',
  tagline: "FINANCIAL & ASSET MANAGEMENT",
  themeId: 'ea-fc-emerald',
  loadingSpeed: 3.5, // seconds to 100%
  soundEnabled: true,
  statusMessages: [
    'CONNECTING TO STOCKHUB ENCRYPTED SERVERS...',
    'VERIFYING SECURITY GATEWAYS & PROTOCOLS...',
    'SYNCING HYPERMOTION ASSET VOLUMETRIC DATA...',
    'OPTIMIZING REAL-TIME AUTHENTICATION ENGINE...',
    'INITIALIZING SECURE CAPTCHA SHIELD...',
    'READY TO LOGIN',
  ],
};

export const PRESETS: PresetConfig[] = [
  {
    id: 'stockhub',
    name: 'StockHub Portal',
    config: {
      mainTitle: 'STOCKHUB',
      badgeTopText: 'SH',
      badgeBottomText: 'PORTAL',
      tagline: 'FINANCIAL & ASSET MANAGEMENT',
      themeId: 'ea-fc-emerald',
      loadingSpeed: 3.5,
      soundEnabled: true,
      statusMessages: [
        'INITIALIZING ENCRYPTED STOCKHUB VAULT...',
        'CONNECTING SECURE AUTHENTICATION SERVERS...',
        'FETCHING MARKET PROTOCOLS & SECURITY CAPTCHA...',
        'SYNCHRONIZING VERIFIED ACCOUNTS...',
        'SYSTEMS READY FOR LOGIN',
      ],
    },
  },
  {
    id: 'fc-26',
    name: 'EA SPORTS FC 26',
    config: DEFAULT_CONFIG,
  },
  {
    id: 'my-startup',
    name: 'Tech Startup / Web App',
    config: {
      mainTitle: 'DEV 26',
      badgeTopText: 'WEB',
      badgeBottomText: 'STUDIO',
      tagline: 'NEXT GENERATION PLATFORM',
      themeId: 'champions-blue',
      loadingSpeed: 3.5,
      soundEnabled: true,
      statusMessages: [
        'INITIALIZING APPLICATION CORE...',
        'CONNECTING SECURE API SERVICES...',
        'LOADING DYNAMIC USER INTERFACE...',
        'FINALIZING ASSETS & CACHE...',
        'SYSTEM INITIALIZATION COMPLETE',
      ],
    },
  },
  {
    id: 'cyber-game',
    name: 'Cyber Gaming League',
    config: {
      mainTitle: 'CYBER 99',
      badgeTopText: 'NEON',
      badgeBottomText: 'ARENA',
      tagline: 'ENTER THE GRID',
      themeId: 'cyber-magenta',
      loadingSpeed: 4,
      soundEnabled: true,
      statusMessages: [
        'AUTHENTICATING NEURAL INTERFACE...',
        'ESTABLISHING LOW-LATENCY QUANTUM LINK...',
        'SYNCHRONIZING COMBAT SIMULATION ENGINES...',
        'SYSTEMS OVERCHARGED AND ARMED',
      ],
    },
  },
  {
    id: 'creator-custom',
    name: 'Golden Champions',
    config: {
      mainTitle: 'GOLD 26',
      badgeTopText: 'PRO',
      badgeBottomText: 'LEAGUE',
      tagline: 'GLORY AWAITS',
      themeId: 'golden-trophy',
      loadingSpeed: 3,
      soundEnabled: true,
      statusMessages: [
        'VALIDATING TROPHY CREDENTIALS...',
        'LOADING ALL-STAR HALL OF FAME...',
        'POLISHING CHAMPIONSHIP BADGES...',
        'PREPARING KICK-OFF STAGE',
      ],
    },
  },
];
