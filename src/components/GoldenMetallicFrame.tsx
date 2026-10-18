import React from 'react';

interface GoldenMetallicFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'beveled' | 'ornate' | 'minimal' | 'plaque';
  padding?: string;
  showCornerAccents?: boolean;
}

/**
 * GoldenMetallicFrame
 * 
 * Elegant 3D golden metallic border frame with:
 * - Multi-tier beveled metallic gold gradients (#ffd56b, #d4af37, #aa771c, #7a4f10)
 * - 45-degree specular light highlights
 * - Deep inset shadow channel
 * - Inner 1px gold hairline fillet
 * - Optional ornamental corner brackets
 */
export const GoldenMetallicFrame: React.FC<GoldenMetallicFrameProps> = ({
  children,
  className = '',
  style = {},
  variant = 'beveled',
  padding = 'p-4 sm:p-6',
  showCornerAccents = true,
}) => {
  return (
    <div
      className={`relative group rounded-xl transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #fae082 0%, #d4af37 20%, #aa771c 45%, #ffd56b 70%, #8a5e12 100%)',
        padding: '3px',
        boxShadow: '0 12px 36px -4px rgba(0,0,0,0.85), 0 0 24px rgba(212,175,55,0.22), inset 0 1px 2px rgba(255,255,255,0.6)',
        ...style,
      }}
    >
      {/* 3D Stepped Inner Frame with Dark Inset Shadow */}
      <div
        className="relative rounded-[9px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7a4f10 0%, #aa771c 25%, #d4af37 50%, #422a07 100%)',
          padding: '2px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85)',
        }}
      >
        {/* Fine Inner Hairline Bead (Fillet) */}
        <div
          className="relative rounded-[7px] overflow-hidden border border-[#ffd56b]/40"
          style={{
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
          }}
        >
          {/* Corner Ornamental Accents */}
          {showCornerAccents && (
            <>
              {/* Top-Left Corner Accent */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 pointer-events-none z-20 border-t-2 border-l-2 border-[#fef3c7]/70" />
              {/* Top-Right Corner Accent */}
              <div className="absolute top-1.5 right-1.5 w-3 h-3 pointer-events-none z-20 border-t-2 border-r-2 border-[#fef3c7]/70" />
              {/* Bottom-Left Corner Accent */}
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 pointer-events-none z-20 border-b-2 border-l-2 border-[#fef3c7]/70" />
              {/* Bottom-Right Corner Accent */}
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 pointer-events-none z-20 border-b-2 border-r-2 border-[#fef3c7]/70" />
              
              {/* Delicate Corner Studs / Rivets */}
              <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#fdf497] shadow-[0_0_4px_#ffd56b] pointer-events-none z-20" />
              <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#fdf497] shadow-[0_0_4px_#ffd56b] pointer-events-none z-20" />
              <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[#fdf497] shadow-[0_0_4px_#ffd56b] pointer-events-none z-20" />
              <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-[#fdf497] shadow-[0_0_4px_#ffd56b] pointer-events-none z-20" />
            </>
          )}

          {/* Inner Content Area */}
          <div className={`relative bg-[#0c0e12] rounded-[6px] ${padding}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
