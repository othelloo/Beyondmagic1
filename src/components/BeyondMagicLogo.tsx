import React from 'react';
import { generateStandaloneSvg, generateCircleAvatarSvg } from '../utils/svgVectorGenerator';

interface BeyondMagicLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  withCircle?: boolean;
  showName?: boolean;
  useMetallic3D?: boolean;
}

/**
 * BeyondMagicLogo
 * 
 * Vector SVG component of the Beyond Magic logo:
 * Golden Key, BEY and ND, MAGIC in red, optional Abdellah Lasri signature, with 3D metallic light texture.
 */
export const BeyondMagicLogo: React.FC<BeyondMagicLogoProps> = ({
  className = "h-11 w-auto",
  width,
  height,
  withCircle = false,
  showName = false,
  useMetallic3D = false,
}) => {
  const svgMarkup = withCircle
    ? generateCircleAvatarSvg({
        clefColor: 'gold',
        circleTheme: 'gold',
        circleStrokeWidth: 2.5,
        showMagic: true,
        showName,
        useMetallic3D,
      })
    : generateStandaloneSvg({
        clefColor: 'gold',
        showMagic: true,
        showName,
        useMetallic3D,
        centered: true,
      });

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      aria-label="Beyond Magic Logo"
    />
  );
};
