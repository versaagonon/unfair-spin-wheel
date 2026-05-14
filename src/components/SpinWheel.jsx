import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const SpinWheel = ({ items, isSpinning, winnerIndex, onSpinComplete }) => {
  const canvasRef = useRef(null);
  const currentRotationRef = useRef(0);
  const animationRef = useRef(null);

  const segments = items.length;
  const segmentAngle = (2 * Math.PI) / segments;

  const drawWheel = useCallback((rotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    for (let i = 0; i < segments; i++) {
      const startAngle = rotation + i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;
      const colorSet = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      // Clean segment fill
      ctx.fillStyle = colorSet.bg;
      ctx.fill();

      // Minimal border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text drawing
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);

      const textRadius = radius * 0.65;
      ctx.translate(textRadius, 0);
      ctx.rotate(Math.PI / 2);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 ${Math.min(13, 240 / segments)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const label = items[i].length > 14 ? items[i].substring(0, 12) + '...' : items[i];
      ctx.fillText(label.toUpperCase(), 0, 0);
      ctx.restore();
    }

    // Outer Rim
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Metallic Center Hub
    const hubRadius = 35;
    const gradient = ctx.createRadialGradient(center - 10, center - 10, 0, center, center, hubRadius);
    gradient.addColorStop(0, '#f1f5f9'); // Slate 100
    gradient.addColorStop(0.5, '#94a3b8'); // Slate 400
    gradient.addColorStop(1, '#475569'); // Slate 600

    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Hub Inner Circle
    ctx.beginPath();
    ctx.arc(center, center, hubRadius - 4, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [items, segments, segmentAngle]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [items, drawWheel]);

  useEffect(() => {
    if (!isSpinning || winnerIndex === null) return;

    const extraSpins = 5 + Math.random() * 5;
    const targetSegmentAngleDeg = (360 / segments) * winnerIndex;
    const segmentCenterOffset = 180 / segments;
    const targetAngleRad = ( (360 * extraSpins - targetSegmentAngleDeg + segmentCenterOffset) * Math.PI ) / 180;

    const startTime = performance.now();
    const duration = 6000;
    const startRotation = currentRotationRef.current;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Professional deceleration inertia
      const eased = 1 - Math.pow(1 - progress, 4);
      const rotation = startRotation + targetAngleRad * eased;
      
      currentRotationRef.current = rotation;
      drawWheel(rotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onSpinComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isSpinning, winnerIndex, segments, drawWheel, onSpinComplete]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer */}
      <div className="absolute top-[-15px] z-20 flex flex-col items-center">
        <div className="w-1.5 h-10 bg-slate-200 rounded-full shadow-lg relative">
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-slate-200 rounded-full border-[4px] border-indigo-600 shadow-xl" />
        </div>
      </div>

      <div className="wheel-container-shadow bg-slate-900/50 p-6 rounded-full border border-white/5">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={500} 
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SpinWheel;
