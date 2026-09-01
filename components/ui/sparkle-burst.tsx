'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
}

const SPARKLE_COLORS = ['#FF529A', '#FF007A', '#9333EA', '#0088FF', '#FF5500', '#FBBF24'];

export function useSparkleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerBurst = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
      size: Math.random() * 6 + 4,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      angle: (i * (360 / 8) * Math.PI) / 180,
      distance: Math.random() * 35 + 25,
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

  const SparkleContainer = () => (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            opacity: 1,
            scale: 0.2,
            x: p.x,
            y: p.y,
          }}
          animate={{
            opacity: 0,
            scale: [0.2, 1.4, 0.4],
            x: p.x + Math.cos(p.angle) * p.distance,
            y: p.y + Math.sin(p.angle) * p.distance,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute rounded-full pointer-events-none z-50 shadow-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </AnimatePresence>
  );

  return { triggerBurst, SparkleContainer };
}

interface AnimatedClickWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function AnimatedClickWrapper({ children, className = '', onClick }: AnimatedClickWrapperProps) {
  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    triggerBurst(e);
    onClick?.(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 17 }}
      onClick={handleClick}
      className={`relative inline-block overflow-hidden ${className}`}
    >
      <SparkleContainer />
      {children}
    </motion.div>
  );
}
