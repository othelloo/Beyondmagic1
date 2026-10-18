import React from 'react';
import { BeyondMagicItem } from './BeyondMagicItem';

/**
 * BeyondMagicNavbarLogo
 * 
 * Renders the authentic Beyond Magic signature emblem in the navbar:
 * - Golden Key (G-Clef) centered
 * - BEY and OND
 * - M A G I C in red
 * - Metallic Golden Framing Circle
 */
interface BeyondMagicNavbarLogoProps {
  className?: string;
}

export const BeyondMagicNavbarLogo: React.FC<BeyondMagicNavbarLogoProps> = ({ className }) => {
  return (
    <div 
      className="relative select-none whitespace-nowrap group-hover:scale-[1.03] transition-transform duration-200 flex items-center py-0.5"
      title="Beyond Magic"
    >
      <BeyondMagicItem
        withCircle={false}
        useMetallic3D={false}
        showName={false}
        centered={true}
        className={className || "h-[60px] sm:h-[68px] w-auto max-w-[220px] sm:max-w-[260px]"}
        style={{ aspectRatio: '560 / 240' }}
      />
    </div>
  );
};
