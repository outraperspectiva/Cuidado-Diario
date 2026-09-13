import React from 'react';
import { PainLevel, SeverityCategory } from '../../types';
import { PainService } from '../../services/painService';

interface PainScaleSelectorProps {
  value: PainLevel;
  onChange: (level: PainLevel) => void;
}

export const PainScaleSelector: React.FC<PainScaleSelectorProps> = ({ value, onChange }) => {
  const levels: PainLevel[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getLevelColor = (level: number) => {
    if (level <= 2) return '#5E9E87'; // Soft Sage
    if (level <= 5) return '#D99B4E'; // Muted Amber
    if (level <= 8) return '#D96B5B'; // Softened Coral
    return '#B34045'; // Deep Crimson
  };

  const currentCategory: SeverityCategory = PainService.getSeverityCategory(value);
  const currentColor = PainService.getSeverityColor(currentCategory);

  const getPainDescription = (val: number): string => {
    switch (val) {
      case 0:
        return 'Sem dor. Estado de equilíbrio e conforto.';
      case 1:
      case 2:
        return 'Dor leve. Perceptível, mas não interfere nas atividades.';
      case 3:
      case 4:
        return 'Dor moderada. Incômoda, exige pausas ou ajustes posturais.';
      case 5:
        return 'Dor moderada a intensa. Dificulta concentração e movimentos.';
      case 6:
      case 7:
        return 'Dor severa. Limita significativamente as atividades cotidianas.';
      case 8:
        return 'Dor muito severa. Incapacitante, impede tarefas básicas.';
      case 9:
      case 10:
        return 'Dor intensa e intolerável. Necessita intervenção médica urgente.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-[#103557]">
          Intensidade da Dor (Escala Visual Analógica)
        </label>
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white transition-all shadow-xs"
          style={{ backgroundColor: currentColor }}
        >
          {PainService.getSeverityLabel(currentCategory)}
        </span>
      </div>

      {/* Hero Display of Selected Number */}
      <div className="flex items-baseline justify-center gap-2 my-2 py-2">
        <span
          className="text-4xl sm:text-5xl font-extrabold tracking-tight transition-all tabular-nums"
          style={{ color: currentColor }}
        >
          {value}
        </span>
        <span className="text-sm font-medium text-[#73777F]">/ 10</span>
      </div>

      {/* Description Box */}
      <p className="text-xs text-center text-[#53606B] min-h-[32px] px-2 mb-3 leading-relaxed">
        {getPainDescription(value)}
      </p>

      {/* 0 to 10 Tactile Button Selector */}
      <div className="grid grid-cols-11 gap-1 sm:gap-1.5 pt-1">
        {levels.map((lvl) => {
          const isSelected = lvl === value;
          const lvlColor = getLevelColor(lvl);
          return (
            <button
              key={lvl}
              type="button"
              id={`pain-level-btn-${lvl}`}
              onClick={() => onChange(lvl)}
              style={{
                backgroundColor: isSelected ? lvlColor : undefined,
                borderColor: isSelected ? lvlColor : undefined,
              }}
              className={`h-11 sm:h-12 flex flex-col items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                isSelected
                  ? 'text-white scale-105 shadow-md -translate-y-0.5'
                  : 'bg-[#F6F8FA] border-[#DCE3E8] text-[#43474E] hover:border-[#103557] hover:bg-[#E2F0FD]'
              }`}
            >
              <span className="tabular-nums">{lvl}</span>
            </button>
          );
        })}
      </div>

      {/* Spectrum Legend Bar */}
      <div className="flex justify-between items-center text-[10px] font-semibold text-[#73777F] mt-2.5 px-0.5">
        <span className="text-[#5E9E87]">0 Leve</span>
        <span className="text-[#D99B4E]">4 Moderada</span>
        <span className="text-[#D96B5B]">7 Severa</span>
        <span className="text-[#B34045]">10 Crítica</span>
      </div>
    </div>
  );
};
