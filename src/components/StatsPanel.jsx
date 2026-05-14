import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Hash, PieChart, Activity, Calendar } from 'lucide-react';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const StatCard = ({ icon: Icon, label, value, subvalue, colorClass }) => (
  <div className="premium-card rounded-2xl p-4 flex flex-col gap-1">
    <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest">
      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      {label}
    </div>
    <div className="text-xl font-bold text-white font-heading">{value}</div>
    {subvalue && <div className="text-[10px] text-text-dim font-medium">{subvalue}</div>}
  </div>
);

const StatsPanel = ({ result, spinCount, history, items }) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-accent-primary" />
        <h2 className="text-white font-bold text-lg font-heading">Ringkasan</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Pemenang Terakhir */}
        <div className="premium-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-16 h-16 text-accent-primary" />
          </div>
          <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-accent-primary" />
            Pemenang Terakhir
          </div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-1"
              >
                <div className="text-2xl font-bold text-white font-heading truncate">
                  {result.item}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-dim font-medium">
                  <Calendar className="w-3 h-3" />
                  Pukul {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            ) : (
              <div className="text-text-dim text-sm italic py-2">Belum ada pemenang</div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon={Hash} 
            label="Total Undian" 
            value={spinCount} 
            colorClass="text-accent-primary"
          />
          <StatCard 
            icon={PieChart} 
            label="Peserta" 
            value={items.length} 
            colorClass="text-emerald-400"
          />
        </div>
      </div>

      {/* Distribusi Peserta */}
      <div className="premium-card rounded-2xl p-5 flex-1 flex flex-col gap-4">
        <div className="text-text-dim text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">
          Statistik Kemenangan
        </div>
        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item, index) => {
            const count = history.filter(h => h.item === item).length;
            const percentage = spinCount > 0 ? (count / spinCount) * 100 : 0;
            const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length].bg;

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-secondary font-medium truncate w-24">{item}</span>
                  <span className="text-text-dim font-bold">{count} Poin</span>
                </div>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
