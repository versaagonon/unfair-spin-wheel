import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { SEGMENT_COLORS } from '../utils/wheelUtils';

const SpinWheel = ({ items, isSpinning, winnerIndex, onSpinComplete }) => {
  const canvasRef = useRef(null);
  const currentRotationRef = useRef(0);
  const animationRef = useRef(null);
  const pointerControls = useAnimation();
  const lastSegmentRef = useRef(0);
  
  const spinningRef = useRef(false);
  const onSpinCompleteRef = useRef(onSpinComplete);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  const segments = items.length;
  const segmentAngle = (2 * Math.PI) / segments;

  const drawWheel = useCallback((rotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 40;

    ctx.clearRect(0, 0, size, size);

    // Glow
    ctx.beginPath();
    ctx.arc(center, center, radius + 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.04)';
    ctx.fill();

    // Segments
    for (let i = 0; i < segments; i++) {
      // Logic: Segment i starts at rotation + i*angle - 90deg
      const startAngle = rotation + i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;
      const colorSet = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
      grad.addColorStop(0, colorSet.bg);
      grad.addColorStop(1, colorSet.bg + 'CC');

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.translate(radius * 0.4, 0);
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.max(10, Math.min(14, 320 / segments));
      ctx.font = `800 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      let label = items[i].toUpperCase();
      const maxW = radius * 0.5;
      if (ctx.measureText(label).width > maxW) {
        while (ctx.measureText(label + '...').width > maxW && label.length > 0) {
          label = label.substring(0, label.length - 1);
        }
        label += '...';
      }
      ctx.fillText(label, 0, 0);
      ctx.restore();

      // Pegs
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle);
      ctx.beginPath();
      ctx.arc(radius + 12, 0, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    // Rim
    ctx.beginPath();
    ctx.arc(center, center, radius + 18, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Hub
    ctx.beginPath();
    ctx.arc(center, center, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

  }, [items, segments, segmentAngle]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [items, drawWheel]);

  useEffect(() => {
    if (!isSpinning || winnerIndex === null || spinningRef.current) return;

    spinningRef.current = true;
    
    const duration = 8000; // Longer for more precision
    const extraSpins = 10;
    const startRotation = currentRotationRef.current;
    
    // Correct Math to land winnerIndex at the TOP (-PI/2)
    // 1. Current position relative to 2PI: currentRotationRef.current % 2PI
    // 2. Target position relative to 2PI: - (winnerIndex + 0.5) * segmentAngle
    // 3. Delta needed: (Target - Current) + (Extra Spins)
    
    const currentNorm = startRotation % (2 * Math.PI);
    const targetNorm = - (winnerIndex + 0.5) * segmentAngle;
    
    // Ensure targetAngleRad is positive and results in clockwise rotation
    let delta = targetNorm - currentNorm;
    while (delta < 0) delta += 2 * Math.PI;
    const totalRotation = delta + (extraSpins * 2 * Math.PI);

    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quintic ease out
      const eased = 1 - Math.pow(1 - progress, 5);
      const rotation = startRotation + totalRotation * eased;
      
      currentRotationRef.current = rotation;
      drawWheel(rotation);

      // Ticker
      const rotNorm = rotation % (2 * Math.PI);
      // Determine which segment is at the top (-PI/2)
      // Angle at top = -PI/2. 
      // Angle of segment i = rotation + i*angle - PI/2.
      // Top points at segment i if: rotation + i*angle - PI/2 <= -PI/2 <= rotation + (i+1)*angle - PI/2
      // 0 <= rotation + i*angle <= angle ? No.
      // -rotation <= i*angle <= angle - rotation
      // i = Math.floor((-rotation % 2PI) / angle) ... need to handle negatives.
      const currentSegment = Math.floor(((2 * Math.PI - (rotation % (2 * Math.PI))) % (2 * Math.PI)) / segmentAngle);
      
      if (currentSegment !== lastSegmentRef.current) {
        pointerControls.start({ rotate: [0, -15, 0], transition: { duration: 0.04 } });
        lastSegmentRef.current = currentSegment;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        spinningRef.current = false;
        if (onSpinCompleteRef.current) onSpinCompleteRef.current();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {};
  }, [isSpinning, winnerIndex, segments, segmentAngle, drawWheel, pointerControls]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-[-25px] z-30 flex flex-col items-center">
        <motion.div animate={pointerControls} className="relative">
          <div className="w-1.5 h-16 bg-white rounded-full shadow-2xl" />
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-[6px] border-accent-primary shadow-xl" />
          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-white" />
        </motion.div>
      </div>
      <div className="relative p-6 flex items-center justify-center">
        <canvas ref={canvasRef} width={550} height={550} className="max-w-full h-auto drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default SpinWheel;
