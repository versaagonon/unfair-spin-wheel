import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, History as HistoryIcon, Download } from 'lucide-react';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const History = ({ history, onClear }) => {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-accent-primary" />
          <h2 className="text-white font-bold text-lg font-heading">Journal</h2>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onClear}
              className="p-2 text-text-dim hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-400/5"
              title="Clear Journal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <HistoryIcon className="w-6 h-6 text-text-dim" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">No records found</p>
                <p className="text-text-dim text-[11px] uppercase tracking-wider font-bold">Initiate a spin to start recording</p>
              </div>
            </div>
          ) : (
            [...history].reverse().map((entry, index) => {
              const color = SEGMENT_COLORS[entry.index % SEGMENT_COLORS.length].bg;
              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all group"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-black/20"
                    style={{ backgroundColor: color }}
                  >
                    {history.length - index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text-primary truncate font-heading uppercase tracking-wide">
                      {entry.item}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-dim font-bold uppercase tracking-widest mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-accent-primary font-bold px-2 py-0.5 rounded bg-accent-primary/10">RECORDED</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      {history.length > 0 && (
        <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-text-dim hover:text-text-secondary hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Download className="w-3.5 h-3.5" />
          Export Session Data
        </button>
      )}
    </div>
  );
};

export default History;
