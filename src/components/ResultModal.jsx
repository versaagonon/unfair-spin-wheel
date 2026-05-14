import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, RotateCcw, Share2, ShieldCheck } from 'lucide-react';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const ResultModal = ({ result, onClose, spinCount }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const color = SEGMENT_COLORS[result.index % SEGMENT_COLORS.length].bg;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          className="relative w-full max-w-lg bg-sidebar border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Top Decorative Banner */}
          <div 
            className="h-3 w-full"
            style={{ backgroundColor: color }}
          />

          <div className="p-10 flex flex-col items-center text-center">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-text-dim hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Achievement Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 rounded-3xl mb-8 flex items-center justify-center shadow-2xl relative"
              style={{ background: `linear-gradient(135deg, ${color}, #000000)` }}
            >
              <Award className="w-12 h-12 text-white" />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-sidebar">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-2 mb-10">
              <span className="text-accent-primary font-bold text-[10px] uppercase tracking-[0.2em]">Achievement Unlocked</span>
              <h2 className="text-4xl font-extrabold text-white font-heading leading-tight uppercase tracking-tight">
                {result.item}
              </h2>
              <p className="text-text-dim text-sm font-medium">
                Successfully recorded in session #{spinCount}
              </p>
            </div>

            {/* Verification Info */}
            <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-10">
              <div className="flex-1 text-left">
                <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest">Verification ID</p>
                <p className="text-text-secondary font-mono text-[11px] mt-0.5">{result.id.split('-')[0].toUpperCase()}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex-1 text-right">
                <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest">Segment Index</p>
                <p className="text-text-secondary font-bold text-xs mt-0.5">{result.index + 1}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="btn-secondary py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 group"
              >
                <Share2 className="w-4 h-4 text-text-dim group-hover:text-accent-primary" />
                Dispatch Results
              </button>
              <button
                onClick={onClose}
                className="btn-primary py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/20"
              >
                <RotateCcw className="w-4 h-4" />
                Resume Session
              </button>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default ResultModal;
