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

      ctx.fillStyle = colorSet.bg;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text drawing
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);

      const textRadiusStart = radius * 0.45; // Start closer to center
      const maxTextWidth = radius * 0.45; // Max space available radially
      
      ctx.translate(textRadiusStart, 0);

      ctx.fillStyle = '#ffffff';
      // Font size scales with number of segments
      const fontSize = Math.max(10, Math.min(14, 300 / segments));
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      let label = items[i].toUpperCase();
      
      // Truncate if too long for the segment width
      const metrics = ctx.measureText(label);
      if (metrics.width > maxTextWidth) {
        // Simple truncation for safety
        while (ctx.measureText(label + '...').width > maxTextWidth && label.length > 0) {
          label = label.substring(0, label.length - 1);
        }
        label += '...';
      }
      
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }

    // Outer Rim
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Metallic Center Hub
    const hubRadius = 40;
    const gradient = ctx.createRadialGradient(center - 10, center - 10, 0, center, center, hubRadius);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(0.5, '#64748b');
    gradient.addColorStop(1, '#0f172a');

    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.fill();

    // Hub Inner Detail
    ctx.beginPath();
    ctx.arc(center, center, hubRadius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [items, segments, segmentAngle]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [items, drawWheel]);

  useEffect(() => {
    if (!isSpinning || winnerIndex === null) return;

    const extraSpins = 6 + Math.random() * 4;
    const targetSegmentAngleDeg = (360 / segments) * winnerIndex;
    const segmentCenterOffset = 180 / segments;
    const targetAngleRad = ( (360 * extraSpins - targetSegmentAngleDeg + segmentCenterOffset) * Math.PI ) / 180;

    const startTime = performance.now();
    const duration = 7000; // Slower, more majestic spin
    const startRotation = currentRotationRef.current;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 5); // Quartic ease out
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
      {/* Premium Pointer */}
      <div className="absolute top-[-20px] z-20 flex flex-col items-center">
        <motion.div 
          animate={isSpinning ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
          className="w-1.5 h-12 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] relative"
        >
          <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-[5px] border-accent-primary shadow-2xl flex items-center justify-center">
             <div className="w-1 h-1 bg-accent-primary rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="wheel-container-shadow bg-main/40 p-8 rounded-full border border-white/5 backdrop-blur-sm">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          className="max-w-full h-auto drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default SpinWheel;
