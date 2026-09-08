import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Info, 
  Hexagon, 
  Sparkles, 
  Plus, 
  Search, 
  X, 
  Check, 
  AlertTriangle, 
  LogOut, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Package,
  TrendingUp,
  FileText,
  Users,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ColorTheme, RegisteredUser, StartupConfig } from '../../types';
import { soundEngine } from '../../utils/audio';

interface UserDashboardProps {
  user: RegisteredUser;
  config: StartupConfig;
  theme: ColorTheme;
  onLogout: () => void;
  onReplayStartup: () => void;
  onOpenCustomizer: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'beranda-inventaris',
    label: 'BERANDA INVENTARIS',
    title: 'RINGKASAN INVENTARIS',
    subtitle: 'Overview & Real-Time Warehouse Performance',
    description: 'Statistik total barang • Peringatan stok kritis • Valuasi aset berjalan',
    actionText: 'Enter Inventory View',
  },
  {
    id: 'items-stock',
    label: 'ITEMS & STOCK',
    title: 'STOCK BARANG',
    subtitle: 'Current Stock Summary and Quick Actions',
    description: 'Review current items • Add new stock • Generate reorder list',
    actionText: 'Enter Stock View',
  },
  {
    id: 'daftar-pemasok',
    label: 'DAFTAR PEMASOK',
    title: 'DAFTAR PEMASOK',
    subtitle: 'Verified Suppliers & Vendor Directory',
    description: 'Kelola kontak rekanan • Riwayat pengiriman vendor • Kontrak pengadaan',
    actionText: 'Enter Suppliers View',
  },
  {
    id: 'pesanan-pembelian',
    label: 'PESANAN PEMBELIAN',
    title: 'PESANAN PEMBELIAN',
    subtitle: 'Purchase Orders & Inbound Tracking',
    description: 'Lacak pengiriman masuk • Konfirmasi penerimaan barang • Faktur pembelian',
    actionText: 'Enter Purchase Orders',
  },
  {
    id: 'rekor-penjualan',
    label: 'REKOR PENJUALAN',
    title: 'REKOR PENJUALAN',
    subtitle: 'Sales Records & Outbound Dispatch',
    description: 'Riwayat transaksi keluar • Analisis omset harian • Surat jalan pengiriman',
    actionText: 'Enter Sales Records',
  },
  {
    id: 'kategori',
    label: 'KATEGORI',
    title: 'KATEGORI PRODUK',
    subtitle: 'Internal Category Management',
    description: 'Pengelompokan jenis barang • Penataan rak gudang • Hirarki departemen',
    actionText: 'Enter Categories',
  },
  {
    id: 'categories',
    label: 'CATEGORIES',
    title: 'GLOBAL CATEGORIES',
    subtitle: 'Master Catalog & Taxonomies',
    description: 'Standar klasifikasi • Unit satuan barang • Pengaturan atribut produk',
    actionText: 'Manage Global Catalog',
  },
  {
    id: 'reports-analytics',
    label: 'REPORTS & ANALYTICS',
    title: 'LAPORAN & ANALITIK',
    subtitle: 'Financial Forecast & Turnover Metrics',
    description: 'Perputaran stok • Laporan depresiasi aset • Ekspor dokumen Excel & PDF',
    actionText: 'Generate Analytics Report',
  },
  {
    id: 'users-roles',
    label: 'USERS & ROLES',
    title: 'HAK AKSES & PERAN',
    subtitle: 'Staff Permissions & Security Matrix',
    description: 'Daftar operator sistem • Batasan wewenang gudang • Log aktivitas audit',
    actionText: 'Enter Roles Manager',
  },
  {
    id: 'pengguna',
    label: 'PENGGUNA',
    title: 'PROFIL PENGGUNA',
    subtitle: 'Account Credentials & Security Status',
    description: 'Data pengguna login • Status verifikasi akun • Riwayat sesi perangkat',
    actionText: 'View User Profile',
  },
  {
    id: 'pengaturan',
    label: 'PENGATURAN',
    title: 'PENGATURAN SISTEM',
    subtitle: 'System Configuration & Theme Customizer',
    description: 'Konfigurasi teks logo • Kecepatan startup animasi • Pengaturan audio',
    actionText: 'Open Settings',
  },
];

// Sample Interactive Stock Items for the Stock View Modal
interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: string;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

const INITIAL_STOCK_ITEMS: StockItem[] = [
  { id: '1', sku: 'SH-PARIS-10', name: 'Jersey Home Edition 25/26 (Ibrahimovic)', category: 'Jersey', quantity: 142, minStock: 25, unitPrice: 'Rp 850.000', status: 'Aman' },
  { id: '2', sku: 'SH-BALL-PRO', name: 'Match Ball Pro V2 Official', category: 'Equipment', quantity: 18, minStock: 20, unitPrice: 'Rp 620.000', status: 'Menipis' },
  { id: '3', sku: 'SH-BOOTS-FG', name: 'Elite Speed Boot Firm Ground', category: 'Footwear', quantity: 85, minStock: 15, unitPrice: 'Rp 1.450.000', status: 'Aman' },
  { id: '4', sku: 'SH-GLOVE-GK', name: 'Pro Grip Goalkeeper Gloves', category: 'Gloves', quantity: 6, minStock: 12, unitPrice: 'Rp 480.000', status: 'Kritis' },
  { id: '5', sku: 'SH-TRAIN-CON', name: 'Agility Training Markers & Cones Set', category: 'Accessories', quantity: 340, minStock: 50, unitPrice: 'Rp 125.000', status: 'Aman' },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  config,
  theme,
  onLogout,
  onReplayStartup,
  onOpenCustomizer,
}) => {
  // Default selected menu: 'items-stock' (as shown in the user's screenshot)
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundMuted, setSoundMuted] = useState<boolean>(!soundEngine.isEnabled());
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const selectedMenu = MENU_ITEMS[selectedIndex] || MENU_ITEMS[1];

  // Sound toggle
  const toggleSound = () => {
    const newState = !soundEngine.isEnabled();
    soundEngine.setEnabled(newState);
    setSoundMuted(!newState);
    if (newState) soundEngine.playBlip();
  };

  // Keyboard navigation matching console EA FC experience: Up/Down or W/S, Enter to select
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStockModalOpen || showInfoModal) {
        if (e.key === 'Escape') {
          setIsStockModalOpen(false);
          setShowInfoModal(false);
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : MENU_ITEMS.length - 1;
          soundEngine.playBlip();
          return next;
        });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev < MENU_ITEMS.length - 1 ? prev + 1 : 0;
          soundEngine.playBlip();
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActionClick();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReplayStartup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStockModalOpen, showInfoModal, selectedIndex, onReplayStartup]);

  const handleActionClick = () => {
    soundEngine.playStartupSwell();
    if (selectedMenu.id === 'items-stock') {
      setIsStockModalOpen(true);
    } else if (selectedMenu.id === 'pengaturan') {
      onOpenCustomizer();
    } else {
      setIsStockModalOpen(true);
    }
  };

  // Quick increment stock quantity
  const handleAddStock = (id: string) => {
    soundEngine.playBlip();
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 10,
              status: item.quantity + 10 > item.minStock ? 'Aman' : 'Menipis',
            }
          : item
      )
    );
  };

  const filteredItems = stockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#070b14] text-white flex flex-col justify-between font-sans">
      
      {/* ========================================================================= */}
      {/* BACKGROUND VIDEO LAYER                                                    */}
      {/* Kosong sesuai instruksi: "untuk background video nya nanti aku tambah     */}
      {/* sendiri jadi biarkan kosong sisanya samakan"                              */}
      {/* ========================================================================= */}
      <div id="bg-video-container" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/*
          SLOT VIDEO PENGGUNA:
          Anda dapat menambahkan tag video Anda di bawah ini kapan saja, contoh:
          <video autoPlay loop muted playsInline src="/my-video.mp4" className="w-full h-full object-cover" />
        */}
        <div className="w-full h-full bg-gradient-to-br from-[#060a12] via-[#09111c] to-[#050910]" />
        
        {/* Cinematic Vignette & Shadow Overlay (menjamin teks menu selalu terbaca tajam) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER BAR                                                            */}
      {/* Kiri: Settings & Info Icon + STOCKHUB (pengganti FC 26)                    */}
      {/* Kanan: Profil User, Crest Hexagon, LVL 0, Point Badge                      */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-6 sm:px-12 pt-6 pb-2 flex items-start justify-between">
        
        {/* Top Left: Icons + STOCKHUB Brand Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Vertical Utility Icons */}
          <div className="flex flex-col items-center gap-3 text-white/70">
            <button
              onClick={onOpenCustomizer}
              className="hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/10"
              title="Pengaturan Teks & Tema (Settings)"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              className="hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/10"
              title="Informasi & Kontrol Keyboard"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* STOCKHUB Logo Text (Menggantikan FC 26 dengan font italic tebal khas EA SPORTS) */}
          <div 
            onClick={onOpenCustomizer}
            className="cursor-pointer group flex items-center"
            title="Klik untuk ubah pengaturan teks & tema"
          >
            <span 
              className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] transition-transform group-hover:scale-105"
              style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
            >
              STOCKHUB
            </span>
          </div>
        </div>

        {/* Top Right: User Status & Level Info (Persis seperti layout screenshot) */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-semibold">
          {/* Username */}
          <span className="text-white/80 tracking-wide uppercase font-bold">
            {user.username || 'FutbolPasion'}
          </span>

          {/* Hexagon Crest Badge */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/90">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current stroke-[1.8]">
              <polygon points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          {/* Level Badge */}
          <span className="text-white/80 font-bold uppercase tracking-wider">
            LVL 0
          </span>

          {/* Purple Hexagonal Points Badge: BP 0/1,000 */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
            <div className="w-4 h-4 rounded-full bg-purple-500/80 flex items-center justify-center text-[10px] text-white font-black">
              BP
            </div>
            <span className="text-white/90 text-xs font-bold tracking-tight">
              0/1,000
            </span>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title={soundMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              onLogout();
            }}
            className="p-1.5 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN BODY: Menu List di Kiri & Konten Terpilih di Tengah                  */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 grid grid-cols-12 px-6 sm:px-12 py-2 items-center overflow-hidden">
        
        {/* Kolom Kiri: Menu List Vertikal */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col justify-center space-y-1.5 sm:space-y-2.5 max-h-[70vh] overflow-y-auto pr-4 scrollbar-none">
          {MENU_ITEMS.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(index);
                  soundEngine.playBlip();
                }}
                onMouseEnter={() => {
                  if (selectedIndex !== index) {
                    setSelectedIndex(index);
                    soundEngine.playBlip();
                  }
                }}
                className={`text-left transition-all duration-200 cursor-pointer flex items-center group ${
                  isSelected ? 'translate-x-2' : 'hover:translate-x-1'
                }`}
              >
                {/* Active Left Indicator Bar */}
                <div 
                  className={`w-1 sm:w-1.5 h-4 sm:h-5 rounded-full mr-3 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-y-110' 
                      : 'bg-transparent'
                  }`}
                />
                
                <span
                  className={`text-sm sm:text-base font-black tracking-wide uppercase transition-colors duration-200 ${
                    isSelected 
                      ? 'text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]' 
                      : 'text-white/40 group-hover:text-white/80'
                  }`}
                  style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kolom Tengah / Kanan: Konten Menu Aktif (Persis seperti screenshot) */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMenu.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center max-w-2xl"
            >
              {/* Main Title: e.g. STOCK BARANG */}
              <h1
                className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] mb-3"
                style={{ fontFamily: "'Chakra Petch', 'Barlow Condensed', sans-serif" }}
              >
                {selectedMenu.title}
              </h1>

              {/* Subtitle: Current Stock Summary and Quick Actions */}
              <h2 className="text-base sm:text-xl font-bold text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2 tracking-wide">
                {selectedMenu.subtitle}
              </h2>

              {/* Description: Review current items • Add new stock • Generate reorder list */}
              <p className="text-xs sm:text-sm text-white/60 mb-8 max-w-xl font-medium tracking-wide">
                {selectedMenu.description}
              </p>

              {/* Interactive Controller Pill Action Button: (A) Enter Stock View */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleActionClick}
                className="relative group px-7 py-3 rounded-full bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-emerald-900/40 border border-white/30 hover:border-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.7)] flex items-center gap-3 cursor-pointer transition-all"
              >
                {/* Controller Button Icon (A) */}
                <div className="w-6 h-6 rounded-full bg-blue-500/80 border border-blue-300/80 flex items-center justify-center text-white font-black text-xs shadow-md">
                  A
                </div>

                <span className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase">
                  {selectedMenu.actionText}
                </span>

                <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* BOTTOM BAR: Garis Merah Aksentuasi + Petunjuk Tombol Kontroler (EA FC)     */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full px-6 sm:px-12 pb-5 pt-2">
        {/* Red accent timeline bar (Garis merah khas dari tangkapan layar) */}
        <div className="w-full h-0.5 bg-white/10 rounded-full mb-3 overflow-hidden relative">
          <div 
            className="h-full bg-red-600 transition-all duration-300 relative"
            style={{ width: `${((selectedIndex + 1) / MENU_ITEMS.length) * 100}%` }}
          >
            {/* Scrubber head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
          </div>
        </div>

        {/* Bottom Controller Shortcuts & Helpers */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/60">
          {/* Left: Console Controller Prompts */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] text-white font-bold">
                A
              </span>
              <span>Pilih / Select (Enter)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/15 border border-white/30 text-[10px] text-white font-bold">
                W / S
              </span>
              <span className="hidden sm:inline">atau ↑ / ↓ Navigasi Menu</span>
            </div>

            <button
              onClick={onReplayStartup}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] text-white font-bold">
                R
              </span>
              <span>Uji Ulang Startup (R)</span>
            </button>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCustomizer}
              className="hover:text-[#00ff87] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Ganti Teks & Desain</span>
            </button>
            <span>•</span>
            <button
              onClick={onLogout}
              className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: Interactive Stock Items Viewer (Ketika tombol 'A' diklik)          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isStockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl max-h-[85vh] bg-[#0c1424] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 
                      className="text-xl font-black uppercase italic tracking-tight text-white"
                      style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                    >
                      {selectedMenu.title} • INVENTARIS SISTEM
                    </h3>
                    <p className="text-xs text-white/50">
                      {selectedMenu.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsStockModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Action Bar */}
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama barang atau SKU..."
                    className="w-full bg-white/5 border border-white/15 focus:border-[#00ff87] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const newSku = `SH-ITEM-${Math.floor(100 + Math.random() * 900)}`;
                      const newItem: StockItem = {
                        id: String(Date.now()),
                        sku: newSku,
                        name: `Produk Baru ${newSku}`,
                        category: 'Umum',
                        quantity: 50,
                        minStock: 20,
                        unitPrice: 'Rp 250.000',
                        status: 'Aman',
                      };
                      setStockItems((prev) => [newItem, ...prev]);
                      soundEngine.playStartupSwell();
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#00ff87] hover:bg-[#00ff87]/90 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tambah Item Baru</span>
                  </button>
                </div>
              </div>

              {/* Table Data */}
              <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider font-semibold">
                      <th className="pb-3 pl-2">SKU</th>
                      <th className="pb-3">Nama Produk</th>
                      <th className="pb-3">Kategori</th>
                      <th className="pb-3 text-center">Jumlah Stok</th>
                      <th className="pb-3">Harga Satuan</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-2 font-mono font-bold text-[#00ff87]">{item.sku}</td>
                        <td className="py-3 font-semibold text-white">{item.name}</td>
                        <td className="py-3 text-white/60">{item.category}</td>
                        <td className="py-3 text-center">
                          <span className="font-mono font-bold text-sm">{item.quantity}</span>
                          <span className="text-[10px] text-white/40 block">min {item.minStock}</span>
                        </td>
                        <td className="py-3 text-white/80 font-mono">{item.unitPrice}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Aman'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : item.status === 'Menipis'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-red-500/20 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => handleAddStock(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/15 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            +10 Stok
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/50">
                <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Esc</kbd> untuk kembali ke menu utama</span>
                <button
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: Info & Panduan Kontrol (Ketika ikon Info di pojok kiri atas diklik) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0c1424] border border-white/20 rounded-2xl p-6 text-left shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black uppercase tracking-tight text-lg text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#00ff87]" />
                  <span>Navigasi Menu Konsol</span>
                </h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-white/80">
                <p className="text-white/60">
                  Antarmuka menu dirancang seperti menu konsol game olahraga autentik:
                </p>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="font-semibold">Tombol Panah / W & S</span>
                  <span className="text-white/50">Navigasi ke atas / ke bawah</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="font-semibold">Enter / Spasi / Tombol (A)</span>
                  <span className="text-white/50">Buka menu aktif</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="font-semibold">Tombol R</span>
                  <span className="text-white/50">Putar ulang startup loading screen</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="font-semibold">Slot Video Latar Belakang</span>
                  <span className="text-[#00ff87]">Biarkan kosong / siap dimasukkan video</span>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
