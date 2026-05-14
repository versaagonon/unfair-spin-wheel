import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ─── ConfettiEffect Component ────────────────────────────────────────────────
const ConfettiEffect = ({ trigger, color }) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    const primaryColor = color || '#8b5cf6';

    // Burst from center
    confetti({
      particleCount: 150,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.5 },
      colors: [primaryColor, '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ffffff'],
      ticks: 300,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ['circle', 'square'],
    });

    // Sides burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0, y: 0.6 },
        colors: [primaryColor, '#ffffff', '#ec4899'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1, y: 0.6 },
        colors: [primaryColor, '#ffffff', '#8b5cf6'],
      });
    }, 200);

    // Star burst after delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 360,
        startVelocity: 20,
        decay: 0.95,
        origin: { x: 0.5, y: 0.4 },
        shapes: ['star'],
        colors: [primaryColor, '#f59e0b', '#ffffff'],
        scalar: 1.5,
      });
    }, 500);

    // Reset after animation
    setTimeout(() => {
      firedRef.current = false;
    }, 4000);
  }, [trigger, color]);

  return null;
};

export default ConfettiEffect;
