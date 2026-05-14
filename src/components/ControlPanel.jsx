import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Play, RefreshCw, Layers } from 'lucide-react';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const ControlPanel = ({ items, setItems, onSpin, isSpinning }) => {
  const [inputValue, setInputValue] = useState('');

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
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent-primary" />
          <h2 className="text-white font-bold text-lg font-heading">Configure</h2>
        </div>
        <span className="text-xs font-bold text-text-dim bg-white/5 px-2.5 py-1 rounded-full">
          {items.length}/12
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New segment name..."
          className="saas-input flex-1 rounded-lg px-4 py-2.5 text-sm"
        />
        <button
          onClick={handleAdd}
          className="btn-primary p-2.5 rounded-lg text-white disabled:opacity-50"
          disabled={!inputValue.trim() || items.length >= 12}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={index + item}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors"
            >
              <div 
                className="w-1.5 h-6 rounded-full" 
                style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length].bg }}
              />
              <span className="flex-1 text-sm text-text-secondary truncate font-medium">
                {item}
              </span>
              <button 
                onClick={() => handleRemove(index)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-text-dim hover:text-rose-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={onSpin}
        disabled={isSpinning}
        className="btn-primary w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 shadow-xl disabled:grayscale disabled:opacity-50"
      >
        {isSpinning ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Play className="w-5 h-5 fill-current" />
        )}
        <span className="tracking-wide uppercase text-sm">{isSpinning ? 'Spinning...' : 'Initiate Spin'}</span>
      </button>
      
      <p className="text-[10px] text-center text-text-dim font-medium uppercase tracking-widest">
        Shortcut: Press Space to Spin
      </p>
    </div>
  );
};

export default ControlPanel;
