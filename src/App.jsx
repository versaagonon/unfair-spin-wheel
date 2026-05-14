import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SpinWheel from './components/SpinWheel';
import ControlPanel from './components/ControlPanel';
import ResultModal from './components/ResultModal';
import History from './components/History';
import StatsPanel from './components/StatsPanel';
import ConfettiEffect from './components/ConfettiEffect';
import { DEFAULT_ITEMS, SEGMENT_COLORS, getRandomIndex } from './utils/wheelUtils';
import { Bell, Search, User, Sliders } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [pendingWinner, setPendingWinner] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [confettiColor, setConfettiColor] = useState('#6366f1');
  const [spinCount, setSpinCount] = useState(0);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const spinCountRef = useRef(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && !isSpinning && !showModal) {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSpinning, showModal, items]);

  const handleSpin = useCallback(() => {
    if (isSpinning || items.length < 2) return;
    const randomIndex = getRandomIndex(items.length);
    setPendingWinner(randomIndex);
    setWinnerIndex(randomIndex);
    setIsSpinning(true);
    setResult(null);
    setShowModal(false);
  }, [isSpinning, items]);

  const handleSpinComplete = useCallback(() => {
    const idx = pendingWinner;
    const item = items[idx];
    const timestamp = Date.now();
    spinCountRef.current += 1;
    setSpinCount(spinCountRef.current);

    const newResult = {
      item,
      index: idx,
      timestamp,
      id: `${timestamp}-${Math.random()}`,
    };

    setResult(newResult);
    setHistory((prev) => [...prev, newResult]);
    setConfettiColor(SEGMENT_COLORS[idx % SEGMENT_COLORS.length].bg);

    setTimeout(() => {
      setIsSpinning(false);
      setConfettiTrigger(v => !v);
      setTimeout(() => setShowModal(true), 400);
    }, 400);
  }, [pendingWinner, items]);

  return (
    <div className="flex min-h-screen bg-main text-text-primary">
      {/* SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* MAIN CONTAINER */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* TOP NAVBAR */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-main/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-white tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-xs font-bold text-text-dim uppercase tracking-widest">
              Wheel Management Console
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="saas-input rounded-lg py-2 pl-9 pr-4 text-xs w-48"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-text-secondary hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 text-text-secondary hover:text-white transition-colors"><Sliders className="w-5 h-5" /></button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] cursor-pointer">
                <div className="w-full h-full rounded-full bg-main flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 items-start h-full">
            
            {/* LEFT CONTENT AREA: Config / History */}
            <div className="w-full xl:w-[320px] 2xl:w-[380px] h-full flex flex-col gap-6 order-2 xl:order-1">
              <motion.div 
                className="premium-card rounded-3xl p-6 h-full flex flex-col min-h-[500px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AnimatePresence mode="wait">
                  {activeTab === 'config' || activeTab === 'dashboard' ? (
                    <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                      <ControlPanel items={items} setItems={setItems} onSpin={handleSpin} isSpinning={isSpinning} />
                    </motion.div>
                  ) : activeTab === 'history' ? (
                    <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                      <History history={history} onClear={() => setHistory([])} />
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 italic">Feature coming soon</div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* CENTER: SPIN WHEEL */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 order-1 xl:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative"
              >
                <SpinWheel 
                  items={items} 
                  isSpinning={isSpinning} 
                  winnerIndex={winnerIndex} 
                  onSpinComplete={handleSpinComplete} 
                />
              </motion.div>
            </div>

            {/* RIGHT PANEL: Stats & Insights */}
            <div className="w-full xl:w-[320px] 2xl:w-[380px] h-full order-3">
              <motion.div 
                className="h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <StatsPanel 
                  result={result} 
                  spinCount={spinCount} 
                  history={history} 
                  items={items}
                />
              </motion.div>
            </div>

          </div>
        </main>

        <footer className="p-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span>© 2026 SpinForge Enterprise</span>
        </footer>
      </div>

      {/* MODALS & OVERLAYS */}
      <AnimatePresence>
        {showModal && (
          <ResultModal 
            result={result} 
            onClose={() => { setShowModal(false); setWinnerIndex(null); }} 
            spinCount={spinCount} 
          />
        )}
      </AnimatePresence>
      <ConfettiEffect trigger={confettiTrigger} color={confettiColor} />
    </div>
  );
}
