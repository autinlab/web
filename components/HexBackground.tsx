import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

const HexBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef<Ripple[]>([]);

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
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleClick = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       ripplesRef.current.push({
         x: e.clientX - rect.left,
         y: e.clientY - rect.top,
         startTime: performance.now()
       });
       // Limit ripples
       if (ripplesRef.current.length > 5) ripplesRef.current.shift();
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

      // Grid Loop
      // Offset coordinate system
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

            // Mouse Interaction
            if (dist < 150) {
                const intensity = 1 - dist / 150;
                // Glow cyan/teal
                fillColor = `rgba(45, 212, 191, ${intensity * 0.15})`; 
                scale = 0.9 + (intensity * 0.15);
                activeStroke = `rgba(45, 212, 191, ${intensity * 0.5})`;
            }

            // Ripple Interaction
            ripplesRef.current.forEach(ripple => {
                const rTime = time - ripple.startTime;
                const waveSpeed = 0.2; // pixels per ms
                const waveRadius = rTime * waveSpeed;
                const waveWidth = 100;
                
                const rDist = Math.sqrt(Math.pow(cx - ripple.x, 2) + Math.pow(cy - ripple.y, 2));
                
                if (Math.abs(rDist - waveRadius) < waveWidth) {
                    const waveIntensity = (1 - Math.abs(rDist - waveRadius) / waveWidth) * Math.max(0, 1 - rTime / 2000);
                     if (waveIntensity > 0.01) {
                         fillColor = `rgba(168, 85, 247, ${waveIntensity * 0.3})`; // Purple ripple
                         activeStroke = `rgba(168, 85, 247, ${waveIntensity * 0.8})`;
                         scale = Math.max(scale, 0.9 + waveIntensity * 0.3);
                     }
                }
            });

            drawHex(cx, cy, fillColor, activeStroke, scale);
        }
      }
      
      // Cleanup old ripples
      ripplesRef.current = ripplesRef.current.filter(r => (time - r.startTime) < 2000);

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
        style={{ pointerEvents: 'none' }} // Allow clicks to pass through for logical clicks, but we attach listener to window
    />
  );
};

export default HexBackground;