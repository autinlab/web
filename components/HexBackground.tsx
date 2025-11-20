import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  type: 'click' | 'move'; // Differentiate to make move ripples more subtle
}

const HexBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const lastMoveRippleRef = useRef<number>(0);

  const hexRadius = 25;
  const hexHeight = hexRadius * 2;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const vertDist = hexHeight * 0.75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseRef.current = { x, y };

      // Add subtle ripple on move (throttled)
      const now = performance.now();
      if (now - lastMoveRippleRef.current > 100) { // Create a ripple every 100ms on move
        ripplesRef.current.push({
          x,
          y,
          startTime: now,
          type: 'move'
        });
        lastMoveRippleRef.current = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       ripplesRef.current.push({
         x: e.clientX - rect.left,
         y: e.clientY - rect.top,
         startTime: performance.now(),
         type: 'click'
       });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const drawHex = (x: number, y: number, color: string, stroke: string, scale = 1) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
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

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Base Grid Color
      const baseColor = 'rgba(15, 23, 42, 1)'; // Match bg-slate-900
      const strokeColor = 'rgba(30, 41, 59, 0.5)'; // Slate-800

      // Cleanup old ripples
      ripplesRef.current = ripplesRef.current.filter(r => (time - r.startTime) < 2500);

      // Grid Loop
      const cols = Math.ceil(canvas.width / hexWidth) + 2;
      const rows = Math.ceil(canvas.height / vertDist) + 2;

      for (let r = -1; r < rows; r++) {
        for (let q = -1; q < cols; q++) {
            const xOffset = (r % 2) * (hexWidth / 2);
            const cx = q * hexWidth + xOffset;
            const cy = r * vertDist;

            // Distance from mouse
            const dx = cx - mouseRef.current.x;
            const dy = cy - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let fillColor = baseColor;
            let scale = 0.9;
            let activeStroke = strokeColor;

            // Mouse Glow Interaction
            if (dist < 150) {
                const intensity = 1 - dist / 150;
                // Very subtle glow
                fillColor = `rgba(45, 212, 191, ${intensity * 0.1})`; 
                scale = 0.9 + (intensity * 0.1);
                activeStroke = `rgba(45, 212, 191, ${intensity * 0.3})`;
            }

            // Ripple Interaction
            ripplesRef.current.forEach(ripple => {
                const rTime = time - ripple.startTime;
                const waveSpeed = 0.15; // Slower speed
                const waveRadius = rTime * waveSpeed;
                const waveWidth = ripple.type === 'click' ? 120 : 80; // Click ripples are wider
                
                const rDist = Math.sqrt(Math.pow(cx - ripple.x, 2) + Math.pow(cy - ripple.y, 2));
                
                if (Math.abs(rDist - waveRadius) < waveWidth) {
                    const distFactor = 1 - Math.abs(rDist - waveRadius) / waveWidth;
                    const timeFactor = Math.max(0, 1 - rTime / 2000);
                    let waveIntensity = distFactor * timeFactor;

                    // Move ripples are much more subtle
                    if (ripple.type === 'move') waveIntensity *= 0.3; 

                     if (waveIntensity > 0.01) {
                         // Blend purple
                         const alpha = waveIntensity * (ripple.type === 'click' ? 0.3 : 0.15);
                         const strokeAlpha = waveIntensity * (ripple.type === 'click' ? 0.6 : 0.3);
                         
                         fillColor = `rgba(168, 85, 247, ${alpha})`; 
                         activeStroke = `rgba(168, 85, 247, ${strokeAlpha})`;
                         scale = Math.max(scale, 0.9 + waveIntensity * 0.2);
                     }
                }
            });

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
        className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none" 
        style={{ pointerEvents: 'none' }} 
    />
  );
};

export default HexBackground;