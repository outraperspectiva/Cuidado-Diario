import React, { useState } from 'react';
import { BodyPart, PainLevel } from '../../types';
import { PainService } from '../../services/painService';

interface BodyMapProps {
  selectedLocations: BodyPart[];
  onToggleLocation: (location: BodyPart) => void;
  painLevel?: number;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedLocations,
  onToggleLocation,
  painLevel = 4
}) => {
  const [view, setView] = useState<'frente' | 'costas'>('frente');

  const severityCat = PainService.getSeverityCategory(painLevel);
  const activeColor = PainService.getSeverityColor(severityCat);

  // Anatomical points coordinate mapping
  const frontPoints: { id: BodyPart; label: string; x: number; y: number }[] = [
    { id: 'cabeca', label: 'Cabeça / Face', x: 50, y: 12 },
    { id: 'cervical', label: 'Pescoço / Cervical', x: 50, y: 21 },
    { id: 'ombro_esquerdo', label: 'Ombro E', x: 30, y: 26 },
    { id: 'ombro_direito', label: 'Ombro D', x: 70, y: 26 },
    { id: 'torax', label: 'Tórax / Peito', x: 50, y: 33 },
    { id: 'braco_esquerdo', label: 'Braço E', x: 23, y: 40 },
    { id: 'braco_direito', label: 'Braço D', x: 77, y: 40 },
    { id: 'quadril', label: 'Pélvis / Quadril', x: 50, y: 53 },
    { id: 'mao_esquerda', label: 'Mão E', x: 18, y: 55 },
    { id: 'mao_direita', label: 'Mão D', x: 82, y: 55 },
    { id: 'joelho_esquerdo', label: 'Joelho E', x: 40, y: 72 },
    { id: 'joelho_direito', label: 'Joelho D', x: 60, y: 72 },
    { id: 'tornozelo_esquerdo', label: 'Tornozelo / Pé E', x: 38, y: 90 },
    { id: 'tornozelo_direito', label: 'Tornozelo / Pé D', x: 62, y: 90 },
  ];

  const backPoints: { id: BodyPart; label: string; x: number; y: number }[] = [
    { id: 'cabeca', label: 'Nuca / Occipital', x: 50, y: 12 },
    { id: 'cervical', label: 'Cervical Posterior', x: 50, y: 21 },
    { id: 'ombro_direito', label: 'Ombro D', x: 30, y: 26 },
    { id: 'ombro_esquerdo', label: 'Ombro E', x: 70, y: 26 },
    { id: 'lombar', label: 'Lombar / Coluna Baixa', x: 50, y: 44 },
    { id: 'quadril', label: 'Glúteos / Sacro', x: 50, y: 54 },
    { id: 'joelho_direito', label: 'Fossa Poplítea D', x: 40, y: 72 },
    { id: 'joelho_esquerdo', label: 'Fossa Poplítea E', x: 60, y: 72 },
    { id: 'tornozelo_direito', label: 'Tendão Calcanhar D', x: 38, y: 90 },
    { id: 'tornozelo_esquerdo', label: 'Tendão Calcanhar E', x: 62, y: 90 },
  ];

  const currentPoints = view === 'frente' ? frontPoints : backPoints;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#103557]">Mapa Corporal de Dor</h3>
          <p className="text-xs text-[#53606B]">Toque nos pontos onde você sente dor</p>
        </div>
        
        {/* Toggle Frente / Costas */}
        <div className="flex bg-[#EEF2F5] p-0.5 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => setView('frente')}
            className={`px-3 py-1 rounded-full transition-all ${
              view === 'frente'
                ? 'bg-[#103557] text-white shadow-xs'
                : 'text-[#53606B] hover:text-[#103557]'
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => setView('costas')}
            className={`px-3 py-1 rounded-full transition-all ${
              view === 'costas'
                ? 'bg-[#103557] text-white shadow-xs'
                : 'text-[#53606B] hover:text-[#103557]'
            }`}
          >
            Costas
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[280px] mx-auto h-[320px] bg-[#F6F8FA] rounded-xl flex items-center justify-center border border-[#E2F0FD] overflow-hidden">
        {/* Minimalist Vector Human Silhouette */}
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full object-contain pointer-events-none opacity-85"
          fill="#E2F0FD"
          stroke="#CEDCE9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Head */}
          <ellipse cx="100" cy="50" rx="22" ry="28" />
          {/* Neck */}
          <path d="M92 78 L92 92 L108 92 L108 78 Z" />
          {/* Torso */}
          <path d="M60 96 C70 92 130 92 140 96 C148 115 142 165 136 210 C128 218 72 218 64 210 C58 165 52 115 60 96 Z" />
          {/* Left Arm */}
          <path d="M58 100 C46 115 36 150 34 190 C32 208 30 220 34 230 C38 232 44 225 46 215 C48 185 56 140 66 118 Z" />
          {/* Right Arm */}
          <path d="M142 100 C154 115 164 150 166 190 C168 208 170 220 166 230 C162 232 156 225 154 215 C152 185 144 140 134 118 Z" />
          {/* Legs */}
          <path d="M72 215 L70 300 C68 335 66 360 64 380 C68 382 78 382 82 376 C86 350 90 310 93 270 L97 230 L103 230 L107 270 C110 310 114 350 118 376 C122 382 132 382 136 380 C134 360 132 335 130 300 L128 215 Z" />
        </svg>

        {/* Interactive Clickable Anatomical Discs */}
        {currentPoints.map((pt) => {
          const isSelected = selectedLocations.includes(pt.id);
          return (
            <button
              key={`${pt.id}-${view}`}
              type="button"
              onClick={() => onToggleLocation(pt.id)}
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`${pt.label} (${isSelected ? 'Selecionado' : 'Clique para marcar'})`}
              className={`absolute group p-1.5 focus:outline-hidden transition-all z-10`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all border ${
                  isSelected
                    ? 'scale-125 shadow-md text-white font-bold'
                    : 'bg-white/90 border-[#73777F]/30 hover:scale-110 hover:border-[#103557]'
                }`}
                style={{
                  backgroundColor: isSelected ? activeColor : undefined,
                  borderColor: isSelected ? activeColor : undefined,
                }}
              >
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-40 pointer-events-none"
                    style={{ backgroundColor: activeColor }}
                  />
                )}
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#2B4C6F]/40'}`} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Locations Chips */}
      <div className="mt-3">
        <div className="text-[11px] font-semibold text-[#53606B] uppercase tracking-wider mb-1.5">
          Regiões marcadas ({selectedLocations.length}):
        </div>
        {selectedLocations.length === 0 ? (
          <p className="text-xs text-[#73777F] italic">Nenhuma região selecionada ainda.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedLocations.map((loc) => {
              const point = [...frontPoints, ...backPoints].find(p => p.id === loc);
              const label = point ? point.label : loc;
              return (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white transition-all shadow-xs"
                  style={{ backgroundColor: activeColor }}
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={() => onToggleLocation(loc)}
                    className="hover:bg-black/20 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
