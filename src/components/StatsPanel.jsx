import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Hash, PieChart, Activity, Calendar, Layers, Info, Play, RefreshCw } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-sm">
    <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest">
      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      {label}
    </div>
    <div className="text-lg font-bold text-white font-heading">{value}</div>
  </div>
);

const StatsPanel = ({ 
  result, 
  spinCount, 
  items, 
  setItems, 
  onSpin, 
  isSpinning 
}) => {
  const [textValue, setTextValue] = useState(items.join('\n'));

  useEffect(() => {
    setTextValue(items.join('\n'));
  }, [items]);

  const handleChange = (e) => {
    const val = e.target.value;
    setTextValue(val);
    
    const newItems = val.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (newItems.length >= 2 && JSON.stringify(newItems) !== JSON.stringify(items)) {
      setItems(newItems);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Panel */}
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-accent-primary" />
        <h2 className="text-white font-bold text-lg font-heading">Panel Kontrol</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Pemenang Terakhir - Transparent style */}
        <div className="relative overflow-hidden group p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-12 h-12 text-accent-primary" />
          </div>
          <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-accent-primary" />
            Pemenang Terakhir
          </div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                {result.photo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={result.photo} alt="Winner" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-2xl font-black text-white font-heading truncate uppercase tracking-tight leading-tight">
                    {result.item}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-dim font-bold uppercase mt-1">
                    <Calendar className="w-3 h-3" />
                    Baru Saja
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-text-dim text-xs font-medium italic">Menunggu putaran...</div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <StatCard 
            icon={PieChart} 
            label="Peserta" 
            value={items.length} 
            colorClass="text-emerald-400"
          />
        </div>
      </div>

      {/* Daftar Nama - Transparent style */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-accent-primary" />
            Daftar Nama
          </div>
          <span className="text-[10px] font-bold text-text-dim bg-white/5 px-2 py-0.5 rounded">
            {items.length} PESERTA
          </span>
        </div>

        <div className="flex-1 flex flex-col min-h-[350px] rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 text-[9px] text-text-dim uppercase font-black tracking-widest">
            <Info className="w-3 h-3" />
            Per Baris 1 Nama
          </div>
          <textarea
            value={textValue}
            onChange={handleChange}
            placeholder="Masukkan nama peserta..."
            className="flex-1 w-full bg-transparent p-4 text-xs text-text-secondary focus:outline-none resize-none custom-scrollbar leading-relaxed font-semibold placeholder:text-text-dim/50"
          />
        </div>

        {/* Tombol Putar Sekarang */}
        <div className="pt-2">
          <button
            onClick={onSpin}
            disabled={isSpinning || items.length < 2}
            className="btn-primary w-full py-4 rounded-lg text-white font-extrabold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:grayscale disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isSpinning ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            <span className="tracking-[0.2em] uppercase text-xs">
              {isSpinning ? 'MEMUTAR...' : 'PUTAR SEKARANG'}
            </span>
          </button>
          <p className="text-[9px] text-center text-text-dim font-black uppercase tracking-[0.2em] mt-4 opacity-50">
            Tekan Spasi untuk Memutar
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
