import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  shape: "circle" | "star" | "cross";
  rotation: number;
  rotationSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface BrandParticleFieldProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean; // react to mouse
  colors?: string[];
}

const BRAND_COLORS = [
  "#C8A96E",  // gold
  "#2E4E45",  // forest
  "#D4C9B0",  // cream
  "#8FB5AC",  // forest-200
  "#E3DAC9",  // cream-200
];

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  // 4-point star (brand star shape)
  const s = size;
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.15, -s * 0.15, s * 0.15, -s * 0.15, s, 0);
  ctx.bezierCurveTo(s * 0.15, s * 0.15, s * 0.15, s * 0.15, 0, s);
  ctx.bezierCurveTo(-s * 0.15, s * 0.15, -s * 0.15, s * 0.15, -s, 0);
  ctx.bezierCurveTo(-s * 0.15, -s * 0.15, -s * 0.15, -s * 0.15, 0, -s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const arm = size * 0.35;
  const thick = size * 0.12;
  ctx.beginPath();
  ctx.rect(-thick, -size, thick * 2, size * 2);
  ctx.rect(-size, -thick, size * 2, thick * 2);
  ctx.fill();
  ctx.restore();
}

export default function BrandParticleField({
  className = "",
  particleCount = 55,
  interactive = true,
  colors = BRAND_COLORS,
}: BrandParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    const shapes: Particle["shape"][] = ["circle", "star", "cross"];
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size: Math.random() * 3.5 + 1.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Mouse tracking — use window since canvas is pointer-events-none
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    if (interactive) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
    }

    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      particlesRef.current.forEach((p) => {
        // Mouse repulsion
        if (interactive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 0.8;
            p.vy += (dy / dist) * force * 0.8;
          }
        }

        // Velocity damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Gentle drift upward
        p.vy -= 0.003;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Pulse opacity
        const pulse = Math.sin(timeRef.current * p.pulseSpeed + p.pulsePhase);
        const currentOpacity = p.opacity * (0.7 + pulse * 0.3);

        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size * 1.4, p.rotation);
        } else {
          drawCross(ctx, p.x, p.y, p.size * 1.6, p.rotation);
        }
      });

      // Draw connection lines between nearby particles
      ctx.globalAlpha = 1;
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const lineOpacity = (1 - dist / 90) * 0.08;
            ctx.globalAlpha = lineOpacity;
            ctx.strokeStyle = a.color;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, interactive, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
