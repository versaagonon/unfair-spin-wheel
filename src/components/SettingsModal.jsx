import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Trophy, Image as ImageIcon, Search, Check, Trash2, Gamepad2 } from 'lucide-react';

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  gameTitle, 
  setGameTitle, 
  items, 
  forcedWinner, 
  setForcedWinner 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForcedWinner(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = items.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-sidebar/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30">
              <Sliders className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg font-heading">Konfigurasi Game</h2>
              <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest">Pengaturan Pemenang & Judul</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-dim hover:text-white transition-colors hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 custom-scrollbar max-h-[70vh] overflow-y-auto">
          
          {/* Judul Game */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
              <Gamepad2 className="w-3.5 h-3.5" />
              Judul Undian
            </label>
            <input 
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              placeholder="Masukkan judul undian..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-all font-semibold"
            />
          </div>

          {/* Pengaturan Pemenang (Cheat Mode) */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
              <Trophy className="w-3.5 h-3.5 text-accent-primary" />
              Atur Pemenang (Mode Admin)
            </label>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama peserta..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-accent-primary/30"
              />
            </div>

            {/* List Selection */}
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar border border-white/5 rounded-xl bg-black/20">
              {filteredItems.map((name) => (
                <button
                  key={name}
                  onClick={() => setForcedWinner(prev => ({ ...prev, name: name === prev.name ? null : name }))}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    forcedWinner.name === name 
                      ? 'bg-accent-primary text-white' 
                      : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  {name}
                  {forcedWinner.name === name && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="p-4 text-center text-[10px] text-text-dim font-bold uppercase">Nama tidak ditemukan</div>
              )}
            </div>
          </div>

          {/* Upload Foto */}
          {forcedWinner.name && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
                <ImageIcon className="w-3.5 h-3.5" />
                Foto Profil Pemenang
              </label>
              
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
                  {forcedWinner.photo ? (
                    <>
                      <img src={forcedWinner.photo} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setForcedWinner(prev => ({ ...prev, photo: null }))}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="w-full h-full flex flex-col items-center justify-center gap-1 text-text-dim hover:text-white transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[8px] font-bold">UPLOAD</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <p className="text-white font-bold mb-1">Pilih Foto Khusus</p>
                  <p className="text-text-dim text-[10px]">Akan ditampilkan di modal pemenang dan panel statistik.</p>
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/20 border-t border-white/5">
          <button 
            onClick={onClose}
            className="btn-primary w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent-primary/20"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
