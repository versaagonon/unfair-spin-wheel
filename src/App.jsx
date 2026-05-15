import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpinWheel from './components/SpinWheel';
import ResultModal from './components/ResultModal';
import StatsPanel from './components/StatsPanel';
import SettingsModal from './components/SettingsModal';
import ConfettiEffect from './components/ConfettiEffect';
import { DEFAULT_ITEMS, SEGMENT_COLORS, getRandomIndex } from './utils/wheelUtils';
import { Search, Sliders, Disc } from 'lucide-react';

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
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [gameTitle, setGameTitle] = useState('Sistem Pengundian');
  const [forcedWinner, setForcedWinner] = useState({ name: null, photo: null });

  const spinCountRef = useRef(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && !isSpinning && !showModal && !showSettings) {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSpinning, showModal, showSettings, items]);

  const handleSpin = useCallback(() => {
    if (isSpinning || items.length < 2) return;
    
    let randomIndex;
    // Check if there is a forced winner and they are still in the items list
    if (forcedWinner.name && items.includes(forcedWinner.name)) {
      randomIndex = items.indexOf(forcedWinner.name);
    } else {
      randomIndex = getRandomIndex(items.length);
    }

    setPendingWinner(randomIndex);
    setWinnerIndex(randomIndex);
    setIsSpinning(true);
    setResult(null);
    setShowModal(false);
  }, [isSpinning, items, forcedWinner]);

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
      // Attach photo if the winner was forced and photo was uploaded
      photo: (forcedWinner.name === item) ? forcedWinner.photo : null
    };

    setResult(newResult);
    setHistory((prev) => [...prev, newResult]);
    setConfettiColor(SEGMENT_COLORS[idx % SEGMENT_COLORS.length].bg);

    setTimeout(() => {
      setIsSpinning(false);
      setConfettiTrigger(v => !v);
      setTimeout(() => setShowModal(true), 400);
    }, 400);
  }, [pendingWinner, items, forcedWinner]);

  return (
    <div className="flex flex-col min-h-screen bg-main text-text-primary">
      
      {/* TOP NAVBAR */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-sidebar/30 backdrop-blur-2xl sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-lg font-heading uppercase leading-none">Undian</span>
              <span className="text-[10px] text-accent-primary font-bold uppercase tracking-widest leading-none mt-0.5">Berhadiah</span>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <span className="hidden md:block text-xs font-bold text-text-dim uppercase tracking-widest">
            {gameTitle}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Cari data..." 
              className="saas-input rounded-lg py-2.5 pl-9 pr-4 text-xs w-64 border-white/5 bg-white/5"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 text-text-secondary hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 px-12 pt-4 pb-10 overflow-hidden flex items-start justify-center">
        <div className="max-w-full w-full flex flex-col xl:flex-row gap-12 items-start justify-between h-full pt-6">
          
          {/* SPIN WHEEL */}
          <div className="flex-[1.5] flex flex-col items-center justify-start pt-8 relative">
            <div className="absolute inset-0 bg-accent-primary/5 blur-[120px] rounded-full -z-10" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <SpinWheel 
                items={items} 
                isSpinning={isSpinning} 
                winnerIndex={winnerIndex} 
                onSpinComplete={handleSpinComplete}
                onSpin={handleSpin}
              />
            </motion.div>
          </div>

          {/* CONTROL CENTER */}
          <div className="w-full xl:w-[380px]">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatsPanel 
                result={result} 
                spinCount={spinCount} 
                history={history} 
                items={items}
                setItems={setItems}
                onSpin={handleSpin}
                isSpinning={isSpinning}
              />
            </motion.div>
          </div>

        </div>
      </main>

      {/* OVERLAYS */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            gameTitle={gameTitle}
            setGameTitle={setGameTitle}
            items={items}
            forcedWinner={forcedWinner}
            setForcedWinner={setForcedWinner}
          />
        )}
        
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
