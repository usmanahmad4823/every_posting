'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 'md', readOnly = false }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [clickedStar, setClickedStar] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7 sm:w-8 sm:h-8',
  };

  const currentDisplayRating = hoveredStar !== null ? hoveredStar : value;

  const handleStarClick = (index: number) => {
    if (readOnly) return;
    setClickedStar(index);
    onChange?.(index);
    setTimeout(() => setClickedStar(null), 500);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= currentDisplayRating;
        const isJustClicked = clickedStar === starIndex;

        return (
          <motion.button
            key={starIndex}
            type="button"
            disabled={readOnly}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => !readOnly && setHoveredStar(starIndex)}
            onMouseLeave={() => !readOnly && setHoveredStar(null)}
            whileHover={readOnly ? undefined : { scale: 1.25, rotate: 6 }}
            whileTap={readOnly ? undefined : { scale: 0.8 }}
            animate={
              isJustClicked
                ? {
                    scale: [1, 1.45, 0.9, 1.15, 1],
                    rotate: [0, -15, 15, -5, 0],
                  }
                : undefined
            }
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className={`transition-colors p-1 rounded-full relative focus:outline-none ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            {/* Twitter Like Ring Pulse Animation */}
            <AnimatePresence>
              {isJustClicked && (
                <motion.span
                  initial={{ scale: 0.3, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <Star
              className={`${starSizes[size]} transition-colors duration-150 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                  : 'fill-transparent text-[#CBD5E1] hover:text-amber-300'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
