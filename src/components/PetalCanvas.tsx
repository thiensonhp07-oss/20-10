import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  z: number; // Simulated depth (0.5 to 1.5)
  size: number;
  speedY: number;
  speedX: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  opacity: number;
  colorFront: string;
  colorBack: string;
  type: number; // 0: Rose petal, 1: Peony/Lotus petal, 2: Cherry blossom, 3: Golden pollen
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
}

interface PetalCanvasProps {
  isActive?: boolean;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; prevX: number; prevY: number; velocity: number }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    velocity: 0,
  });
  const dynamicBreezeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    };

    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.prevX;
      mouseRef.current.velocity = Math.abs(dx);
      // Gentle wind nudge based on mouse horizontal speed
      dynamicBreezeRef.current = Math.max(-2, Math.min(3, dx * 0.04));
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn a soft burst of 6 petals gently swirling out
      for (let i = 0; i < 6; i++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 30 + 10;
        const px = e.clientX + Math.cos(offsetAngle) * dist;
        const py = e.clientY + Math.sin(offsetAngle) * dist;
        petals.push(createPetal(px, py));
      }
      if (petals.length > 85) {
        petals.splice(0, 6);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    // Luxury Color Palettes (Face / Back of petals with delicate contrast)
    const petalPalettes = [
      {
        front: 'rgba(255, 175, 195, 0.92)', // Juliet Soft Peach-Pink
        back: 'rgba(244, 135, 165, 0.88)',
      },
      {
        front: 'rgba(255, 195, 210, 0.90)', // Tender Rose Quartz
        back: 'rgba(250, 160, 185, 0.85)',
      },
      {
        front: 'rgba(255, 222, 230, 0.94)', // Soft Pearlescent Blossom
        back: 'rgba(248, 185, 205, 0.90)',
      },
      {
        front: 'rgba(254, 237, 228, 0.92)', // Champagne Cream Bloom
        back: 'rgba(249, 205, 195, 0.86)',
      },
      {
        front: 'rgba(255, 140, 175, 0.85)', // Radiant Pink Accent
        back: 'rgba(235, 105, 150, 0.82)',
      },
    ];

    const createPetal = (initialX?: number, initialY?: number): Petal => {
      const typeRand = Math.random();
      let type = 0;
      if (typeRand < 0.45) type = 0; // Rose petal
      else if (typeRand < 0.75) type = 1; // Peony / Lotus petal
      else if (typeRand < 0.92) type = 2; // Cherry blossom petal
      else type = 3; // Golden sparkle spore

      const palette = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
      const z = Math.random() * 0.8 + 0.6; // Depth factor

      return {
        x: initialX !== undefined ? initialX : Math.random() * (cssWidth + 200) - 100,
        y: initialY !== undefined ? initialY : Math.random() * -cssHeight * 0.8,
        z,
        size: (Math.random() * 11 + 10) * z,
        speedY: (Math.random() * 1.1 + 0.7) * z,
        speedX: (Math.random() * 0.7 + 0.5) * z,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.035,
        rotationSpeedY: (Math.random() - 0.5) * 0.045,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.35 + 0.60,
        colorFront: palette.front,
        colorBack: palette.back,
        type,
        swayAmplitude: (Math.random() * 2.8 + 1.2) * z,
        swaySpeed: Math.random() * 0.025 + 0.012,
        swayOffset: Math.random() * Math.PI * 2,
      };
    };

    // Calculate count based on viewport width (densely and gracefully dispersed across screen)
    const targetCount = Math.min(65, Math.max(38, Math.floor(cssWidth / 24)));
    const petals: Petal[] = [];
    for (let i = 0; i < targetCount; i++) {
      // Pre-seed across full viewport so screen is immediately filled with flying petals
      const p = createPetal(
        Math.random() * (cssWidth + 100) - 50,
        Math.random() * cssHeight
      );
      petals.push(p);
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 3) {
        // Golden / Champagne Micro Sparkle Spore
        const glowRadius = p.size * 0.35;
        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius * 2);
        radGrad.addColorStop(0, 'rgba(255, 235, 170, 0.95)');
        radGrad.addColorStop(0.5, 'rgba(245, 195, 120, 0.6)');
        radGrad.addColorStop(1, 'rgba(245, 195, 120, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // 3D rotation projection simulation
      const scaleX = Math.cos(p.rotationY);
      const scaleY = Math.sin(p.rotationX);
      const isFacingFront = scaleX * scaleY >= 0;

      ctx.scale(scaleX, Math.abs(scaleY) > 0.12 ? scaleY : 0.12);
      ctx.rotate(p.rotationZ);

      // Color based on front/back flip with subtle depth shadow
      ctx.fillStyle = isFacingFront ? p.colorFront : p.colorBack;
      ctx.shadowColor = 'rgba(244, 114, 182, 0.25)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();

      if (p.type === 0) {
        // Natural Rose Petal heart-curved shape with indented top
        const s = p.size;
        ctx.moveTo(0, -s * 0.95);
        ctx.bezierCurveTo(s * 0.85, -s * 0.7, s * 0.95, s * 0.45, 0, s);
        ctx.bezierCurveTo(-s * 0.95, s * 0.45, -s * 0.85, -s * 0.7, 0, -s * 0.95);
      } else if (p.type === 1) {
        // Rounded Peony / Lotus Petal with soft organic contour
        const s = p.size;
        ctx.moveTo(0, -s * 0.9);
        ctx.bezierCurveTo(s * 0.75, -s * 0.6, s * 0.7, s * 0.7, 0, s);
        ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.75, -s * 0.6, 0, -s * 0.9);
      } else {
        // Cherry Blossom / Peach Petal with delicate notched cleft tip
        const s = p.size;
        ctx.moveTo(0, -s * 0.75);
        ctx.bezierCurveTo(s * 0.55, -s * 0.4, s * 0.5, s * 0.6, 0, s * 0.9);
        ctx.bezierCurveTo(-s * 0.5, s * 0.6, -s * 0.55, -s * 0.4, 0, -s * 0.75);
      }

      ctx.fill();

      // Subtle translucent white highlight line on petal spine
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = isFacingFront
        ? 'rgba(255, 255, 255, 0.55)'
        : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.65);
      ctx.lineTo(0, p.size * 0.45);
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      tick++;

      // CONTINUOUS ORGANIC AUTUMN BREEZE (Never stops, always runs!)
      // Sinusoidal wind gusts simulate a soft, natural breeze carrying petals across the page
      const baseWindX = 1.6 + Math.sin(tick * 0.008) * 0.9 + Math.cos(tick * 0.016) * 0.4;
      const baseWindY = 1.0 + Math.sin(tick * 0.006) * 0.35;

      // Mouse speed decay
      dynamicBreezeRef.current *= 0.96;

      const currentWindX = baseWindX + dynamicBreezeRef.current;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 3D rotations
        p.rotationX += p.rotationSpeedX;
        p.rotationY += p.rotationSpeedY;
        p.rotationZ += p.rotationSpeedZ;

        // Downward fall + horizontal wind + sway oscillation
        p.y += p.speedY * baseWindY;
        const sway = Math.sin(tick * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
        p.x += (p.speedX + currentWindX) * p.z + sway;

        // Interactive mouse proximity repulsion (gentle swirl when cursor approaches)
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400) { // 120px radius
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 120) * 2.2;
          p.x += (dx / (dist || 1)) * force;
          p.y += (dy / (dist || 1)) * force;
        }

        // Loop smoothly when falling off screen
        if (p.y > cssHeight + 40) {
          p.y = -30;
          p.x = Math.random() * (cssWidth + 150) - 100;
        }
        if (p.x > cssWidth + 60) {
          p.x = -40;
          p.y = Math.random() * (cssHeight * 0.8);
        }
        if (p.x < -60) {
          p.x = cssWidth + 40;
        }

        drawPetal(p);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{
        zIndex: 35, // Positioned visibly over section backgrounds and card layouts
      }}
      aria-hidden="true"
    />
  );
};
