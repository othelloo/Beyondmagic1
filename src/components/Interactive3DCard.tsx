import React from 'react';
import { Card3DStyleId, useCard3D } from '../context/Card3DContext';

interface Interactive3DCardProps {
  children: React.ReactNode;
  styleId?: Card3DStyleId;
  className?: string;
  showSpecularSheen?: boolean;
  intensity?: number;
  onClick?: () => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  styleId,
  className = '',
  onClick,
}) => {
  const { activeStyle } = useCard3D();
  const currentStyle = styleId || activeStyle;

  const styleClass =
    currentStyle === 'v1-obsidian' ? 'style-v1-obsidian' :
    currentStyle === 'v2-gold-chamfer' ? 'style-v2-gold-chamfer' :
    'style-v3-spatial-crystal';

  return (
    <div
      className={`perspective-1200 w-full h-full flex flex-col ${className}`}
      onClick={onClick}
    >
      <div className={`relative w-full h-full flex-1 flex flex-col rounded-2xl preserve-3d select-none ${styleClass}`}>
        <div className="relative z-10 preserve-3d w-full h-full flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
