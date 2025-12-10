import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

export function SparkleTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const colors = ['#FFD700', '#FFF44F', '#FFED4E', '#FFC700', '#FFE66D', '#FFFFFF'];

  useEffect(() => {
    let particleId = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      // Throttle particle creation to every 30ms
      if (now - lastTime < 30) return;
      lastTime = now;

      // Create new particle
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after animation completes
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x - particle.size / 2,
              y: particle.y - particle.size / 2,
              opacity: 1,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              opacity: [1, 0.8, 0],
              scale: [0, 1, 0.5],
              rotate: particle.rotation + 180,
              y: particle.y - particle.size / 2 - Math.random() * 30 - 20,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
            className="absolute"
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            <Star color={particle.color} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
    >
      <path
        d="M12 2L14.09 8.26L20 9.27L15.18 13.14L16.18 19L12 15.77L7.82 19L8.82 13.14L4 9.27L9.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M12 6L12.7 8.5L15 9L13 10.5L13.5 13L12 11.7L10.5 13L11 10.5L9 9L11.3 8.5L12 6Z"
        fill="white"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </svg>
  );
}
