import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  type: 'click' | 'move';
}

interface Blob {
  orbitX: number; // center of orbit (fraction of W/H, set at init)
  orbitY: number;
  orbitRx: number; // orbit radius x
  orbitRy: number;
  speed: number;  // radians/ms
  phase: number;  // initial angle
  radius: number; // influence radius (px)
  strength: number;
}

const HexBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef<Ripple[]>([]);
  const lastMoveRippleRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>([]);

  const hexRadius = 25;
  const hexHeight = hexRadius * 2;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const vertDist = hexHeight * 0.75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initBlobs = (W: number, H: number) => {
      blobsRef.current = [
        // Two large primary blobs — slow, sweeping
        { orbitX: W * 0.5, orbitY: H * 0.42, orbitRx: W * 0.28, orbitRy: H * 0.22, speed: 0.00028, phase: 0,         radius: W * 0.28, strength: 1.0 },
        { orbitX: W * 0.5, orbitY: H * 0.58, orbitRx: W * 0.24, orbitRy: H * 0.20, speed: 0.00022, phase: Math.PI,    radius: W * 0.26, strength: 0.9 },
        // Two satellite blobs — faster, tighter
        { orbitX: W * 0.38, orbitY: H * 0.5, orbitRx: W * 0.14, orbitRy: H * 0.11, speed: 0.00060, phase: 1.3,        radius: W * 0.16, strength: 0.65 },
        { orbitX: W * 0.62, orbitY: H * 0.5, orbitRx: W * 0.12, orbitRy: H * 0.13, speed: 0.00050, phase: 4.1,        radius: W * 0.15, strength: 0.60 },
      ];
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlobs(canvas.width, canvas.height);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const now = performance.now();
      if (now - lastMoveRippleRef.current > 100) {
        ripplesRef.current.push({ x: mouseRef.current.x, y: mouseRef.current.y, startTime: now, type: 'move' });
        lastMoveRippleRef.current = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, startTime: performance.now(), type: 'click' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const drawHex = (x: number, y: number, color: string, stroke: string, scale = 1) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + hexRadius * scale * Math.cos(angle);
        const hy = y + hexRadius * scale * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Returns 0–1 field intensity at (px, py) from all blobs at time t
    const fieldAt = (px: number, py: number, t: number): number => {
      let total = 0;
      for (const blob of blobsRef.current) {
        const bx = blob.orbitX + Math.cos(t * blob.speed + blob.phase) * blob.orbitRx;
        const by = blob.orbitY + Math.sin(t * blob.speed * 0.65 + blob.phase) * blob.orbitRy;
        const dx = px - bx;
        const dy = py - by;
        // Inverse-square falloff, normalized by blob radius
        total += blob.strength / (1 + (dx * dx + dy * dy) / (blob.radius * blob.radius));
      }
      // Normalize: at blob center total ~= sum of strengths ~3.15; soft cap
      return Math.min(total / 1.4, 1);
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Global palette slowly oscillates teal ↔ purple over ~60 s
      const palette = (Math.sin(time * 0.000105) + 1) * 0.5; // 0 = teal, 1 = purple
      const tR = 45,  tG = 212, tB = 191; // teal
      const pR = 168, pG = 85,  pB = 247; // purple
      const cR = Math.round(tR + (pR - tR) * palette);
      const cG = Math.round(tG + (pG - tG) * palette);
      const cB = Math.round(tB + (pB - tB) * palette);

      const strokeBase = 'rgba(30, 41, 59, 0.45)';

      ripplesRef.current = ripplesRef.current.filter(r => (time - r.startTime) < 2500);

      const cols = Math.ceil(canvas.width / hexWidth) + 2;
      const rows = Math.ceil(canvas.height / vertDist) + 2;

      for (let r = -1; r < rows; r++) {
        for (let q = -1; q < cols; q++) {
          const xOffset = (r % 2) * (hexWidth / 2);
          const cx = q * hexWidth + xOffset;
          const cy = r * vertDist;

          // --- Blob field ---
          const intensity = fieldAt(cx, cy, time);
          const fillAlpha  = intensity * 0.22;
          const strokeAlpha = intensity * 0.40;
          let fillColor   = intensity > 0.025 ? `rgba(${cR}, ${cG}, ${cB}, ${fillAlpha})` : 'rgba(15, 23, 42, 1)';
          let activeStroke = intensity > 0.025 ? `rgba(${cR}, ${cG}, ${cB}, ${strokeAlpha})` : strokeBase;
          let scale = 0.88 + intensity * 0.13;

          // --- Mouse proximity (teal) ---
          const dx = cx - mouseRef.current.x;
          const dy = cy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const mi = 1 - dist / 150;
            fillColor    = `rgba(45, 212, 191, ${Math.max(fillAlpha, mi * 0.13)})`;
            activeStroke = `rgba(45, 212, 191, ${Math.max(strokeAlpha, mi * 0.35)})`;
            scale = Math.max(scale, 0.88 + mi * 0.12);
          }

          // --- Click / move ripples (purple) ---
          for (const ripple of ripplesRef.current) {
            const rTime = time - ripple.startTime;
            const waveRadius = rTime * 0.15;
            const waveWidth  = ripple.type === 'click' ? 120 : 80;
            const rDist = Math.sqrt((cx - ripple.x) ** 2 + (cy - ripple.y) ** 2);
            if (Math.abs(rDist - waveRadius) < waveWidth) {
              const distFactor = 1 - Math.abs(rDist - waveRadius) / waveWidth;
              const timeFactor = Math.max(0, 1 - rTime / 2000);
              let wi = distFactor * timeFactor;
              if (ripple.type === 'move') wi *= 0.3;
              if (wi > 0.01) {
                const fa = wi * (ripple.type === 'click' ? 0.30 : 0.15);
                const sa = wi * (ripple.type === 'click' ? 0.60 : 0.30);
                fillColor    = `rgba(168, 85, 247, ${fa})`;
                activeStroke = `rgba(168, 85, 247, ${sa})`;
                scale = Math.max(scale, 0.88 + wi * 0.22);
              }
            }
          }

          drawHex(cx, cy, fillColor, activeStroke, scale);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-75 pointer-events-none"
    />
  );
};

export default HexBackground;
