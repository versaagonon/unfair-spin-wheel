// Palette Warna Premium untuk Giveaway
export const SEGMENT_COLORS = [
  { bg: '#6366f1', text: '#ffffff', border: '#4f46e5' }, // Indigo
  { bg: '#8b5cf6', text: '#ffffff', border: '#7c3aed' }, // Violet
  { bg: '#ec4899', text: '#ffffff', border: '#db2777' }, // Pink
  { bg: '#06b6d4', text: '#ffffff', border: '#0891b2' }, // Cyan
  { bg: '#10b981', text: '#ffffff', border: '#059669' }, // Emerald
  { bg: '#f59e0b', text: '#ffffff', border: '#d97706' }, // Amber
  { bg: '#3b82f6', text: '#ffffff', border: '#2563eb' }, // Blue
  { bg: '#ef4444', text: '#ffffff', border: '#dc2626' }, // Red
  { bg: '#f43f5e', text: '#ffffff', border: '#e11d48' }, // Rose
  { bg: '#84cc16', text: '#ffffff', border: '#65a30d' }, // Lime
  { bg: '#fb923c', text: '#ffffff', border: '#f97316' }, // Orange
  { bg: '#a855f7', text: '#ffffff', border: '#9333ea' }, // Purple
];

// Daftar Peserta Default (Bahasa Indonesia)
export const DEFAULT_ITEMS = [
  'Andi Setiawan',
  'Budi Santoso',
  'Citra Lestari',
  'Dewi Sartika',
  'Eko Prasetyo',
  'Fany Rahmawati',
  'Gilang Ramadhan',
  'Hani Fitriani',
];

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}
