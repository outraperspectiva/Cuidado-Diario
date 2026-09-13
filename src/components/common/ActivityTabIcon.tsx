import React from 'react';
import { Dumbbell } from 'lucide-react';

interface ActivityTabIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ActivityTabIcon: React.FC<ActivityTabIconProps> = ({
  className = '',
  size = 'md'
}) => {
  if (size === 'lg') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none w-8 h-8 ${className}`}
        aria-label="Físio & Sono"
      >
        <Dumbbell className="w-6 h-6 stroke-[2.2] translate-y-0.5 -translate-x-1" />
        <span className="absolute -top-1 -right-0.5 flex items-baseline font-black tracking-[-0.06em] leading-none text-current">
          <span className="text-[11px] font-extrabold italic">z</span>
          <span className="text-[9px] font-bold italic opacity-90">z</span>
          <span className="text-[7.5px] font-semibold italic opacity-80">z</span>
        </span>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none w-4 h-4 ${className}`}
        aria-label="Físio & Sono"
      >
        <Dumbbell className="w-3.5 h-3.5 stroke-[2.2] translate-y-0.5 -translate-x-0.5" />
        <span className="absolute -top-1 -right-1 flex items-baseline font-black tracking-[-0.08em] leading-none text-current">
          <span className="text-[7px] font-extrabold italic">z</span>
          <span className="text-[6px] font-bold italic opacity-85">z</span>
          <span className="text-[5px] font-semibold italic opacity-75">z</span>
        </span>
      </div>
    );
  }

  // Default 'md' (standard 20x20px / w-5 h-5)
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none w-5 h-5 ${className}`}
      aria-label="Físio & Sono"
    >
      {/* Peso de Musculação (Atividade Física) */}
      <Dumbbell className="w-4 h-4 stroke-[2.2] translate-y-[2px] -translate-x-[2px]" />

      {/* ZZZ (Sono) */}
      <span className="absolute -top-1.5 -right-1.5 flex items-baseline font-black tracking-[-0.08em] leading-none text-current">
        <span className="text-[8px] font-black italic">z</span>
        <span className="text-[7px] font-extrabold italic opacity-90">z</span>
        <span className="text-[5.5px] font-bold italic opacity-80">z</span>
      </span>
    </div>
  );
};

