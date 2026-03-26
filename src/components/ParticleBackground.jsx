import { useEffect, useRef, useState } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResizeCheck = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResizeCheck);
    return () => window.removeEventListener('resize', handleResizeCheck);
  }, []);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = isMobile ? 60 : 45;
    let mouse = { x: -9999, y: -9999, radius: isMobile ? 80 : 140 };

    let particles = [];
    let cols, rows;

    class Particle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        this.size = isMobile ? (Math.random() * 1.5 + 1) : (Math.random() * 2 + 2);
        this.opacity = isMobile ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.6 + 0.2);
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx -= (dx / dist) * force * 4;
          this.vy -= (dy / dist) * force * 4;
        }

        this.vx += (this.baseX - this.x) * 0.05;
        this.vy += (this.baseY - this.y) * 0.05;

        this.vx *= 0.7;
        this.vy *= 0.7;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        const edgeFadeX = Math.min(this.x / 200, (width - this.x) / 200);
        const edgeFadeY = Math.min(this.y / 200, (height - this.y) / 200);
        const edgeFade = Math.max(0, Math.min(edgeFadeX, edgeFadeY));

        ctx.beginPath();
        ctx.fillStyle = `rgba(163,230,53, ${this.opacity * edgeFade})`;

        ctx.shadowColor = 'rgba(163,230,53,0.4)';
        ctx.shadowBlur = 10;

        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.shadowBlur = 0;
      }
    }

    function init() {
      particles = [];
      cols = Math.ceil(width / spacing);
      rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push(
            new Particle(i * spacing, j * spacing)
          );
        }
      }
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  // Mobilde sadə arxa fon (kənar elementlər olmadan)

  return (
    <div className="fixed inset-0 z-0 bg-gray-50 dark:bg-[#07070a] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/70 dark:from-[#07070a]/30 via-transparent to-gray-50/90 dark:to-[#07070a]/90" />

      <div className="absolute bottom-10 left-0 w-full flex justify-center md:justify-start px-8 md:px-12 lg:px-16 pointer-events-none">
        <h1 className="text-5xl md:text-7xl lg:text-[130px] font-black text-slate-200 dark:text-white/40 tracking-tighter blur-[0.5px]">
          KENO
        </h1>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.05))] dark:bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.8))]" />
    </div>
  );
}