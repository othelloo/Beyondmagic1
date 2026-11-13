import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SliderNavigationControls } from './SliderNavigationControls';
import { ScrollModeId, useCard3D } from '../context/Card3DContext';

interface SlidingCardTrackProps {
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (index: number) => void;
  touchHandlers?: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  children: React.ReactNode[];
  className?: string;
  showSideArrows?: boolean;
  scrollModeOverride?: ScrollModeId;
}

export const SlidingCardTrack: React.FC<SlidingCardTrackProps> = ({
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  onSelect,
  touchHandlers,
  children,
  className = '',
  showSideArrows = true,
  scrollModeOverride,
}) => {
  const { scrollMode: contextScrollMode } = useCard3D();
  const activeScrollMode = scrollModeOverride || contextScrollMode;
  const childArray = React.Children.toArray(children);

  // Shortest signed circular offset for 3D Coverflow and Stacked Deck modes
  const getSignedOffset = (idx: number) => {
    let offset = idx - currentIndex;
    if (totalItems > 2) {
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;
    }
    return offset;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Mode 1: Silky Horizontal Glide (Track TranslateX + Spring Easing) */}
      {activeScrollMode === 'scroll-v1-glide' && (
        <div
          className="overflow-hidden w-full rounded-2xl touch-pan-y py-5 -my-5 px-1 -mx-1"
          {...touchHandlers}
        >
          <div
            className="flex flex-nowrap items-stretch w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {childArray.map((child, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={idx}
                  className="w-full shrink-0 min-w-full px-1 flex flex-col transition-all duration-500 ease-out"
                  style={{
                    transform: isActive ? 'scale(1)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0.45,
                  }}
                  aria-hidden={!isActive}
                >
                  <div className="w-full h-full flex-1 flex flex-col">
                    {child}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: 3D Carousel Turn (Coverflow Depth with RotateY + TranslateZ) */}
      {activeScrollMode === 'scroll-v2-coverflow' && (
        <div
          className="relative w-full perspective-1200 touch-pan-y py-5 -my-5 overflow-x-clip"
          {...touchHandlers}
        >
          <div className="relative w-full preserve-3d grid">
            {childArray.map((child, idx) => {
              const offset = getSignedOffset(idx);
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              // Position active card in normal flow so container sizes naturally to max card height
              const translateXPercent = offset * 82;
              const rotateYDeg = offset * -24;
              const translateZPx = isActive ? 0 : -110 * absOffset;
              const scaleVal = isActive ? 1 : Math.max(0.78, 0.88 - (absOffset - 1) * 0.08);
              const opacityVal = isActive ? 1 : absOffset === 1 ? 0.38 : 0;

              return (
                <div
                  key={idx}
                  onClick={!isActive && onSelect ? () => onSelect(idx) : undefined}
                  className={`col-start-1 row-start-1 w-full px-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
                    isActive ? 'z-20 pointer-events-auto' : 'z-10 cursor-pointer'
                  }`}
                  style={{
                    transform: `translateX(${translateXPercent}%) translateZ(${translateZPx}px) rotateY(${rotateYDeg}deg) scale(${scaleVal})`,
                    opacity: opacityVal,
                    pointerEvents: absOffset > 1 ? 'none' : 'auto',
                  }}
                  aria-hidden={!isActive}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Stacked Atelier Deck (Overlapping Physical Z-Stack Peel) */}
      {activeScrollMode === 'scroll-v3-deck' && (
        <div
          className="relative w-full perspective-1200 touch-pan-y py-5 -my-5 overflow-x-clip"
          {...touchHandlers}
        >
          <div className="relative w-full preserve-3d grid">
            {childArray.map((child, idx) => {
              const offset = getSignedOffset(idx);
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              // Active card sits cleanly in foreground; background cards tuck diagonally behind in Z-space
              const translateXPercent = isActive ? 0 : offset > 0 ? 7 : -7;
              const translateYPx = isActive ? 0 : 12 * absOffset;
              const translateZPx = isActive ? 0 : -90 * absOffset;
              const rotateZDeg = isActive ? 0 : offset * 1.8;
              const scaleVal = isActive ? 1 : Math.max(0.86, 0.94 - (absOffset - 1) * 0.05);
              const opacityVal = isActive ? 1 : absOffset === 1 ? 0.58 : 0.25;

              return (
                <div
                  key={idx}
                  onClick={!isActive && onSelect ? () => onSelect(idx) : undefined}
                  className={`col-start-1 row-start-1 w-full px-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                    isActive ? 'z-20' : 'z-10 cursor-pointer'
                  }`}
                  style={{
                    transform: `translate3d(${translateXPercent}%, ${translateYPx}px, ${translateZPx}px) rotateZ(${rotateZDeg}deg) scale(${scaleVal})`,
                    opacity: opacityVal,
                    filter: isActive ? 'none' : 'brightness(0.75)',
                  }}
                  aria-hidden={!isActive}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Side Nav Arrows */}
      {showSideArrows && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous card"
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#181d2a]/95 text-[#c49750] border border-[#c49750]/50 shadow-xl flex items-center justify-center active:scale-90 cursor-pointer backdrop-blur-sm hover:bg-[#c49750] hover:text-black transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next card"
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#181d2a]/95 text-[#c49750] border border-[#c49750]/50 shadow-xl flex items-center justify-center active:scale-90 cursor-pointer backdrop-blur-sm hover:bg-[#c49750] hover:text-black transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Purely informative discreet page indicator directly under the card */}
      <SliderNavigationControls
        currentIndex={currentIndex}
        totalItems={totalItems}
        onSelect={onSelect}
        className="mt-4"
      />
    </div>
  );
};
