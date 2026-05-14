import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings2, 
  History as HistoryIcon, 
  BarChart3, 
  Sliders, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Disc,
  Plus,
  Trash2,
  Layers,
  Play,
  RefreshCw
} from 'lucide-react';
import { SEGMENT_COLORS } from '../utils/wheelUtils';
import { AnimatePresence } from 'framer-motion';

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
  const [inputValue, setInputValue] = React.useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Spin History', icon: HistoryIcon },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || items.length >= 12) return;
    setItems([...items, trimmed]);
    setInputValue('');
  };

  const handleRemove = (index) => {
    if (items.length <= 2) return;
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-white/5 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Logo */}
      <div className={`p-6 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
          <Disc className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-lg font-heading">SpinForge</span>
            <span className="text-[10px] text-accent-primary font-bold uppercase tracking-widest leading-none">Enterprise</span>
          </div>
        )}
      </div>

      {/* Navigation */}
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

      {/* WHEEL CONFIG SECTION (Inside Sidebar) */}
      {!collapsed ? (
        <div className="flex-1 flex flex-col px-6 py-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-primary" />
              <h3 className="text-white font-bold text-sm font-heading">Configure</h3>
            </div>
            <span className="text-[10px] font-bold text-text-dim bg-white/5 px-2 py-0.5 rounded">
              {items.length}/12
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add segment..."
              className="saas-input flex-1 rounded-lg px-3 py-2 text-xs"
            />
            <button
              onClick={handleAdd}
              className="btn-primary p-2 rounded-lg text-white disabled:opacity-50"
              disabled={!inputValue.trim() || items.length >= 12}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={index + item}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5 group"
                >
                  <div 
                    className="w-1 h-4 rounded-full" 
                    style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length].bg }}
                  />
                  <span className="flex-1 text-[11px] text-text-secondary truncate font-medium uppercase tracking-wide">
                    {item}
                  </span>
                  <button 
                    onClick={() => handleRemove(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-dim hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SPIN BUTTON */}
          <div className="pt-6 pb-2">
            <button
              onClick={onSpin}
              disabled={isSpinning}
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg disabled:grayscale disabled:opacity-50"
            >
              {isSpinning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span className="tracking-widest uppercase text-[10px]">{isSpinning ? 'Running' : 'Initiate Spin'}</span>
            </button>
            <p className="text-[9px] text-center text-text-dim font-bold uppercase tracking-[0.2em] mt-3">
              Press Space to Spin
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center py-6 gap-6">
           <Layers className="w-5 h-5 text-text-dim" />
           <div className="h-px w-8 bg-white/5" />
           <button 
             onClick={onSpin} 
             disabled={isSpinning}
             className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20 hover:scale-110 transition-transform disabled:grayscale"
           >
             <Play className="w-5 h-5 text-white fill-current" />
           </button>
        </div>
      )}

      {/* Footer / User Profile */}
      <div className={`p-4 border-t border-white/5 ${collapsed ? 'items-center' : ''}`}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
