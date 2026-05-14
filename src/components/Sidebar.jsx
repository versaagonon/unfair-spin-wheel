import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Disc, 
  Layers, 
  Play, 
  RefreshCw,
  Info
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group ${
      active 
        ? 'sidebar-active text-white' 
        : 'text-text-secondary hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent-primary' : 'group-hover:text-accent-primary'}`} />
    {!collapsed && <span className="truncate">{label}</span>}
  </motion.button>
);

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  items,
  setItems,
  onSpin,
  isSpinning
}) => {
  // Local state for the textarea content
  const [textValue, setTextValue] = React.useState(items.join('\n'));

  const handleChange = (e) => {
    const val = e.target.value;
    setTextValue(val);
    
    // Extract names, ignoring empty lines
    const newItems = val.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Only update the wheel if the list of names has actually changed
    // and we have at least 2 participants.
    if (newItems.length >= 2 && JSON.stringify(newItems) !== JSON.stringify(items)) {
      setItems(newItems);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'history', label: 'Riwayat Pemenang', icon: HistoryIcon },
    { id: 'stats', label: 'Statistik Peserta', icon: BarChart3 },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-white/5 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Aplikasi */}
      <div className={`p-6 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
          <Disc className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-lg font-heading uppercase">Undian</span>
            <span className="text-[10px] text-accent-primary font-bold uppercase tracking-widest leading-none">Berhadiah</span>
          </div>
        )}
      </div>

      {/* Navigasi Utama */}
      <nav className="px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="h-px bg-white/5 mx-6 my-2" />

      {/* Pengaturan Peserta (Input Langsung) */}
      {!collapsed ? (
        <div className="flex-1 flex flex-col px-6 py-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-primary" />
              <h3 className="text-white font-bold text-sm font-heading">Daftar Nama</h3>
            </div>
            <span className="text-[10px] font-bold text-text-dim bg-white/5 px-2 py-0.5 rounded">
              {items.length} Peserta
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-2 border-b border-white/5 flex items-center gap-2 text-[9px] text-text-dim uppercase font-bold tracking-wider">
              <Info className="w-3 h-3" />
              Satu nama per baris
            </div>
            <textarea
              value={textValue}
              onChange={handleChange}
              placeholder="Masukkan nama..."
              className="flex-1 w-full bg-transparent p-4 text-xs text-text-secondary focus:outline-none resize-none custom-scrollbar leading-relaxed font-medium"
            />
          </div>

          {/* Tombol Putar */}
          <div className="pt-6 pb-2">
            <button
              onClick={onSpin}
              disabled={isSpinning || items.length < 2}
              className="btn-primary w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg disabled:grayscale disabled:opacity-50"
            >
              {isSpinning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              <span className="tracking-widest uppercase text-xs">{isSpinning ? 'Sedang Memutar' : 'Putar Sekarang'}</span>
            </button>
            <p className="text-[9px] text-center text-text-dim font-bold uppercase tracking-[0.2em] mt-3">
              Spasi untuk memutar
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center py-6 gap-6">
           <Layers className="w-5 h-5 text-text-dim" />
           <div className="h-px w-8 bg-white/5" />
           <button 
             onClick={onSpin} 
             disabled={isSpinning || items.length < 2}
             className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20 hover:scale-110 transition-transform disabled:grayscale"
           >
             <Play className="w-5 h-5 text-white fill-current" />
           </button>
        </div>
      )}

      {/* Kontrol Collapse */}
      <div className={`p-4 border-t border-white/5 ${collapsed ? 'items-center' : ''}`}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Sembunyikan Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
