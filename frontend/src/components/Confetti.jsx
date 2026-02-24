import { useEffect, useRef } from 'react';

const COLORS = ['#f953c6', '#6c63ff', '#3bc4f2', '#00e5a0', '#ffd60a', '#ff7849', '#ffffff'];
const SHAPES = ['circle', 'rect', 'triangle'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti({ active, onDone }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    particlesRef.current = Array.from({ length: 120 }, () => ({
      x: randomBetween(0, canvas.width),
      y: randomBetween(-100, -10),
      vx: randomBetween(-3, 3),
      vy: randomBetween(3, 8),
      size: randomBetween(6, 14),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: randomBetween(0, 360),
      rotationSpeed: randomBetween(-5, 5),
      opacity: 1,
      gravity: randomBetween(0.1, 0.3),
      wobble: randomBetween(0, Math.PI * 2),
      wobbleSpeed: randomBetween(0.05, 0.12),
    }));

    let startTime = null;
    const duration = 3500;

    function drawParticle(p) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 1.5;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - (progress > 0.6 ? (progress - 0.6) / 0.4 : 0));
        drawParticle(p);
      });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onDone) onDone();
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}
