import React from 'react';

interface SliderNavigationControlsProps {
  currentIndex: number;
  totalItems: number;
  onSelect?: (index: number) => void;
  className?: string;
}

export const SliderNavigationControls: React.FC<SliderNavigationControlsProps> = ({
  currentIndex,
  totalItems,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
      {/* Subtle indicator dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalItems }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect?.(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === idx
                ? 'w-4 h-1 bg-[#c49750]'
                : 'w-1 h-1 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
      {/* Purely informative page count without redundant arrows or frame */}
      <span className="text-[10px] font-mono tracking-widest text-[#8c887d] uppercase ml-1">
        {currentIndex + 1} / {totalItems}
      </span>
    </div>
  );
};
