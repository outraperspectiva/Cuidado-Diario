import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../store';
import { AnalyticsService } from '../../services/analyticsService';
import { DailyPhysioAdherence } from '../../types';
import { Activity, CheckCircle2, AlertCircle, TrendingUp, Calendar, Info, Award } from 'lucide-react';

interface PhysioAdherenceChartProps {
  onPeriodChange?: (days: number) => void;
}

export const PhysioAdherenceChart: React.FC<PhysioAdherenceChartProps> = ({ onPeriodChange }) => {
  const [periodDays, setPeriodDays] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prescriptions = useAppSelector((state) => state.exercise.prescriptions || []);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);
  const historyExecutions = useAppSelector((state) => state.exercise.historyExecutions || []);
  const exerciseLogs = useAppSelector((state) => state.exercise.logs || []);

  const summary = useMemo(() => {
    return AnalyticsService.computePhysioAdherence(
      prescriptions,
      todayExecutions,
      historyExecutions,
      exerciseLogs,
      periodDays
    );
  }, [prescriptions, todayExecutions, historyExecutions, exerciseLogs, periodDays]);

  const handleSelectPeriod = (days: number) => {
    setPeriodDays(days);
    setSelectedDate(null);
    if (onPeriodChange) onPeriodChange(days);
  };

  const activeSelectedDay: DailyPhysioAdherence | undefined = useMemo(() => {
    if (!selectedDate) return summary.dailyData[summary.dailyData.length - 1]; // Default to today
    return summary.dailyData.find((d) => d.date === selectedDate) || summary.dailyData[summary.dailyData.length - 1];
  }, [selectedDate, summary.dailyData]);

  // Chart layout dimensions
  const svgWidth = 500;
  const svgHeight = 180;
  const topPadding = 25;
  const bottomPadding = 45;
  const chartHeight = svgHeight - topPadding - bottomPadding;

  const dataCount = summary.dailyData.length;
  const colWidth = svgWidth / Math.max(dataCount, 1);
  const barWidth = Math.max(8, Math.min(26, colWidth * 0.55));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1 space-y-4">
      {/* Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E2F0FD] flex items-center justify-center text-[#2B4C6F]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#103557]">Adesão à Fisioterapia & Reabilitação</h3>
            <p className="text-xs text-[#53606B]">% de atividade física prescrita realizada no período</p>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-[#F6F8FA] p-1 rounded-xl border border-[#DCE3E8] self-start sm:self-auto">
          {[
            { label: '7 dias', value: 7 },
            { label: '14 dias', value: 14 },
            { label: '30 dias', value: 30 }
          ].map((period) => (
            <button
              key={period.value}
              type="button"
              id={`btn-period-${period.value}`}
              onClick={() => handleSelectPeriod(period.value)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                periodDays === period.value
                  ? 'bg-white text-[#103557] shadow-xs border border-[#DCE3E8]'
                  : 'text-[#53606B] hover:text-[#103557]'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-[#F6F8FA] rounded-xl border border-[#DCE3E8]">
        <div>
          <span className="text-[10px] font-bold text-[#53606B] uppercase tracking-wider block">
            Realização Média
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#103557] tabular-nums">
              {summary.overallPercentage}%
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              summary.overallPercentage >= 85
                ? 'bg-[#AFF0D8] text-[#003B2E]'
                : summary.overallPercentage >= 60
                ? 'bg-[#E2F0FD] text-[#103557]'
                : 'bg-[#FFF0D4] text-[#8C5800]'
            }`}
          >
            {summary.overallPercentage >= 85
              ? 'Excelente Adesão'
              : summary.overallPercentage >= 60
              ? 'Bom Desempenho'
              : 'Adesão Irregular'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#53606B] uppercase tracking-wider block">
            Sessões Feitas
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#103557] tabular-nums mt-0.5">
            {summary.totalCompleted}
            <span className="text-xs text-[#73777F] font-normal"> / {summary.totalPlanned}</span>
          </div>
          <span className="text-[10px] text-[#53606B] mt-1 block">no período</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#53606B] uppercase tracking-wider block">
            Metas 100%
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#00875A] tabular-nums mt-0.5 flex items-center gap-1">
            <Award className="w-4 h-4 text-[#00875A] hidden sm:inline" />
            <span>{summary.daysWithFullAdherence}</span>
            <span className="text-xs text-[#73777F] font-normal"> / {periodDays} d</span>
          </div>
          <span className="text-[10px] text-[#53606B] mt-1 block">dias concluídos</span>
        </div>
      </div>

      {/* SVG Bar Chart with Goal Baseline */}
      <div className="w-full pt-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label={`Gráfico de adesão à fisioterapia nos últimos ${periodDays} dias`}
        >
          <defs>
            {/* Success gradient (100% adherence) */}
            <linearGradient id="barSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00875A" />
              <stop offset="100%" stopColor="#43A047" />
            </linearGradient>

            {/* Partial gradient (50-99% adherence) */}
            <linearGradient id="barPartial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#103557" />
              <stop offset="100%" stopColor="#2B4C6F" />
            </linearGradient>

            {/* Low gradient (<50%) */}
            <linearGradient id="barLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D99B4E" />
              <stop offset="100%" stopColor="#E6A756" />
            </linearGradient>
          </defs>

          {/* Reference Grid lines */}
          {/* 100% Target Line */}
          <line
            x1="0"
            y1={topPadding}
            x2={svgWidth}
            y2={topPadding}
            stroke="#68A691"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <text
            x={svgWidth - 4}
            y={topPadding - 5}
            textAnchor="end"
            fill="#00875A"
            fontSize="9"
            fontWeight="bold"
          >
            Meta 100%
          </text>

          {/* 50% line */}
          <line
            x1="0"
            y1={topPadding + chartHeight / 2}
            x2={svgWidth}
            y2={topPadding + chartHeight / 2}
            stroke="#EEF2F5"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <text
            x="4"
            y={topPadding + chartHeight / 2 - 4}
            fill="#73777F"
            fontSize="8"
          >
            50%
          </text>

          {/* Baseline 0% */}
          <line
            x1="0"
            y1={topPadding + chartHeight}
            x2={svgWidth}
            y2={topPadding + chartHeight}
            stroke="#DCE3E8"
            strokeWidth="1.5"
          />

          {/* Columns / Bars for each day */}
          {summary.dailyData.map((day, idx) => {
            const centerX = idx * colWidth + colWidth / 2;
            const barHeight = Math.max(4, (day.percentage / 100) * chartHeight);
            const barY = topPadding + chartHeight - barHeight;
            const isSelected = activeSelectedDay?.date === day.date;
            const isToday = day.dayLabel === 'Hoje';

            // Choose bar fill
            let fillUrl = 'url(#barPartial)';
            if (day.percentage >= 100) fillUrl = 'url(#barSuccess)';
            else if (day.percentage < 50 && day.percentage > 0) fillUrl = 'url(#barLow)';
            else if (day.percentage === 0) fillUrl = '#DCE3E8';

            return (
              <g
                key={day.date}
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedDate(day.date)}
              >
                {/* Background column click area */}
                <rect
                  x={idx * colWidth}
                  y={0}
                  width={colWidth}
                  height={svgHeight}
                  fill={isSelected ? '#E2F0FD' : 'transparent'}
                  opacity={isSelected ? 0.45 : 0}
                  rx="6"
                />

                {/* Vertical Bar */}
                <rect
                  x={centerX - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx={barWidth / 3}
                  fill={fillUrl}
                  stroke={isSelected ? '#103557' : isToday ? '#2B4C6F' : 'none'}
                  strokeWidth={isSelected ? 2 : isToday ? 1 : 0}
                />

                {/* Percentage label above the bar (only if bar allows space or on selected/peaks) */}
                {(periodDays <= 14 || isSelected || day.percentage === 100) && (
                  <text
                    x={centerX}
                    y={barY - 5}
                    textAnchor="middle"
                    fill={day.percentage >= 100 ? '#00875A' : '#103557'}
                    fontSize={periodDays === 7 ? '10' : '8'}
                    fontWeight="bold"
                  >
                    {day.percentage}%
                  </text>
                )}

                {/* Day label (Seg, Ter, ..., Hoje) */}
                <text
                  x={centerX}
                  y={topPadding + chartHeight + 16}
                  textAnchor="middle"
                  fill={isSelected ? '#103557' : isToday ? '#2B4C6F' : '#53606B'}
                  fontSize={periodDays === 7 ? '10' : periodDays === 14 ? '8.5' : '7'}
                  fontWeight={isToday || isSelected ? 'bold' : 'normal'}
                >
                  {day.dayLabel}
                </text>

                {/* Date sublabel (14/09) */}
                {periodDays <= 14 && (
                  <text
                    x={centerX}
                    y={topPadding + chartHeight + 28}
                    textAnchor="middle"
                    fill="#73777F"
                    fontSize={periodDays === 7 ? '8.5' : '7.5'}
                  >
                    {day.shortDate}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Detail Card */}
      {activeSelectedDay && (
        <div className="p-3 bg-[#F6F8FA] rounded-xl border border-[#DCE3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                activeSelectedDay.percentage >= 100
                  ? 'bg-[#AFF0D8] text-[#003B2E]'
                  : activeSelectedDay.percentage > 0
                  ? 'bg-[#E2F0FD] text-[#103557]'
                  : 'bg-[#EEF2F5] text-[#73777F]'
              }`}
            >
              {activeSelectedDay.percentage >= 100 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#103557]">
                  {activeSelectedDay.dayLabel === 'Hoje'
                    ? 'Hoje'
                    : activeSelectedDay.dayLabel === 'Ontem'
                    ? 'Ontem'
                    : `${activeSelectedDay.dayLabel}`}{' '}
                  ({activeSelectedDay.shortDate})
                </span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    activeSelectedDay.percentage >= 100
                      ? 'bg-[#AFF0D8] text-[#003B2E]'
                      : activeSelectedDay.percentage > 0
                      ? 'bg-[#E2F0FD] text-[#103557]'
                      : 'bg-[#EEF2F5] text-[#73777F]'
                  }`}
                >
                  {activeSelectedDay.percentage}% Realizado
                </span>
              </div>
              <p className="text-[11px] text-[#53606B] mt-0.5">
                {activeSelectedDay.plannedCount > 0
                  ? `${activeSelectedDay.completedCount} de ${activeSelectedDay.plannedCount} sessões prescritas concluídas`
                  : 'Nenhuma sessão específica prescrita para esta data'}
                {activeSelectedDay.exerciseMinutes > 0 &&
                  ` • ${activeSelectedDay.exerciseMinutes} min de atividade física`}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] text-[#73777F] block">Toque em qualquer barra</span>
            <span className="text-[11px] font-semibold text-[#2B4C6F]">para inspecionar o dia</span>
          </div>
        </div>
      )}

      {/* Clinical Legend & Context */}
      <div className="flex items-center justify-between text-[11px] text-[#73777F] pt-1 border-t border-[#EEF2F5] flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00875A]" /> 100% Meta Concluída
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4C6F]" /> 50% - 99% Parcial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCE3E8]" /> 0% Pendente
          </span>
        </div>
        <span className="text-[10px] italic text-[#53606B]">Atualização em tempo real</span>
      </div>
    </div>
  );
};
