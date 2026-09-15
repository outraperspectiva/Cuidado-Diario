import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import { AnalyticsService } from '../../services/analyticsService';
import { PainService } from '../../services/painService';
import { PhysioAdherenceChart } from '../evolution/PhysioAdherenceChart';
import { TrendingUp, TrendingDown, Minus, Download, FileText, Calendar, AlertTriangle, Moon, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const EvolutionScreen: React.FC = () => {
  const painLogs = useAppSelector((state) => state.pain.logs);
  const sleepLogs = useAppSelector((state) => state.sleep.logs);
  const exerciseLogs = useAppSelector((state) => state.exercise.logs);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);
  const historyExecutions = useAppSelector((state) => state.exercise.historyExecutions || []);
  const prescriptions = useAppSelector((state) => state.exercise.prescriptions || []);
  const user = useAppSelector((state) => state.auth.user);

  const [copiedReport, setCopiedReport] = useState(false);

  const summary = AnalyticsService.computeSummary(
    painLogs,
    sleepLogs,
    exerciseLogs,
    todayIntakes,
    todayExecutions,
    historyExecutions,
    prescriptions
  );

  // Reverse pain logs chronologically for the trend graph
  const chronologicalPain = [...painLogs].reverse().slice(-7);

  const handleExportReport = () => {
    const reportText = `
========================================
MELHORA - RELATÓRIO DE SAÚDE E DOR
========================================
Paciente: ${user?.name || 'Não informado'}
Diagnósticos: ${user?.diagnosis?.join(', ') || 'Em investigação'}
Período Analisado: ${summary.weekPeriod}
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}

1. PARÂMETROS DE DOR
- Média de Dor (EVA 0-10): ${summary.averagePain} / 10
- Tendência Geral: ${summary.painTrend.toUpperCase()}
- Episódios Agudos / Flare-ups: ${summary.totalFlareUps}
- Principais Regiões Afetadas: ${summary.mostAffectedAreas.map(a => `${a.bodyPart} (${a.count}x)`).join(', ') || 'Nenhuma registrada'}
- Gatilhos Mais Recorrentes: ${summary.topTriggers.map(t => `${t.trigger} (${t.count}x)`).join(', ') || 'Nenhum identificado'}

2. SONO E DESCANSO
- Duração Média: ${summary.avgSleepHours} horas por noite

3. ATIVIDADE E REABILITAÇÃO
- Total de Exercícios/Fisioterapia: ${summary.exerciseMinutesTotal} minutos
- Adesão à Fisioterapia/Reabilitação Prescrita: ${summary.physioAdherencePercent}%

4. ADESÃO FARMACOLÓGICA
- Taxa de Adesão aos Medicamentos: ${summary.medicationAdherencePercent}%

========================================
Gerado via Cuidado Diário - Acompanhamento de Saúde e Dor
========================================
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3500);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header & Export CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#103557]">Evolução & Métricas</h2>
          <p className="text-xs text-[#53606B]">Análise integrada de dor, sono e adesão</p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-1.5 bg-[#103557] hover:bg-[#2B4C6F] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
          title="Copiar Resumo de Evolução formatado"
        >
          {copiedReport ? <CheckCircle2 className="w-4 h-4 text-[#88C6B0]" /> : <Download className="w-4 h-4" />}
          <span>{copiedReport ? 'Copiado!' : 'Exportar Relatório'}</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="bg-white rounded-2xl p-3.5 border border-[#DCE3E8] elevation-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#53606B]">
            Média da Dor
          </span>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums mt-0.5">
            {summary.averagePain} <span className="text-xs text-[#73777F] font-normal">/ 10</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold mt-1">
            {summary.painTrend === 'diminuindo' ? (
              <span className="text-[#003B2E] flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> Reduzindo
              </span>
            ) : summary.painTrend === 'aumentando' ? (
              <span className="text-[#93000A] flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Elevando
              </span>
            ) : (
              <span className="text-[#2B4C6F] flex items-center gap-0.5">
                <Minus className="w-3.5 h-3.5" /> Estável
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#DCE3E8] elevation-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#53606B]">
            Crises Agudas
          </span>
          <div className="text-2xl font-extrabold text-[#D96B5B] tabular-nums mt-0.5">
            {summary.totalFlareUps}
          </div>
          <span className="text-[11px] text-[#73777F] mt-1 block">Últimos 7 dias</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#DCE3E8] elevation-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#53606B]">
            Sono Médio
          </span>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums mt-0.5">
            {summary.avgSleepHours}h
          </div>
          <span className="text-[11px] text-[#68A691] font-semibold mt-1 block">Descanso reparador</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#DCE3E8] elevation-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#53606B]">
            Adesão Remédios
          </span>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums mt-0.5">
            {summary.medicationAdherencePercent}%
          </div>
          <span className="text-[11px] text-[#356572] font-semibold mt-1 block">Conformidade alta</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#DCE3E8] elevation-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#53606B]">
            Adesão Fisio
          </span>
          <div className="text-2xl font-extrabold text-[#00875A] tabular-nums mt-0.5">
            {summary.physioAdherencePercent}%
          </div>
          <span className="text-[11px] text-[#00875A] font-semibold mt-1 block">Reabilitação ativa</span>
        </div>
      </div>

      {/* Physiotherapy & Rehabilitation Adherence Chart */}
      <PhysioAdherenceChart />

      {/* Visual Pain Trend Chart (Clean pure SVG visualizer adhering to Anti-Slop principles) */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE3E8] elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#103557]">Curva de Intensidade da Dor</h3>
            <p className="text-xs text-[#53606B]">Registros sequenciais na escala de 0 a 10</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F]">
            Últimos registros
          </span>
        </div>

        {chronologicalPain.length > 0 ? (
          <div className="w-full h-44 pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Baseline Grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#EEF2F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#EEF2F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#EEF2F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#DCE3E8" strokeWidth="1" />

              {/* Grid labels */}
              <text x="5" y="24" fill="#73777F" fontSize="10" fontWeight="bold">10</text>
              <text x="5" y="64" fill="#73777F" fontSize="10" fontWeight="bold">6</text>
              <text x="5" y="104" fill="#73777F" fontSize="10" fontWeight="bold">3</text>
              <text x="5" y="144" fill="#73777F" fontSize="10" fontWeight="bold">0</text>

              {/* Data points & connecting line */}
              {(() => {
                const step = 460 / Math.max(chronologicalPain.length - 1, 1);
                const points = chronologicalPain.map((p, idx) => {
                  const x = 30 + idx * step;
                  const y = 140 - (p.painLevel / 10) * 120;
                  return { x, y, level: p.painLevel, date: new Date(p.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) };
                });

                const polylinePoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');

                return (
                  <>
                    {/* Trend line */}
                    <polyline
                      fill="none"
                      stroke="#2B4C6F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylinePoints}
                    />

                    {/* Area under line */}
                    <polygon
                      fill="url(#painGradient)"
                      opacity="0.2"
                      points={`30,140 ${polylinePoints} ${points[points.length - 1].x},140`}
                    />

                    <defs>
                      <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2B4C6F" />
                        <stop offset="100%" stopColor="#2B4C6F" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Circles on points */}
                    {points.map((pt, i) => {
                      const col = pt.level <= 2 ? '#5E9E87' : pt.level <= 5 ? '#D99B4E' : pt.level <= 8 ? '#D96B5B' : '#B34045';
                      return (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill={col} stroke="#FFFFFF" strokeWidth="2" />
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            textAnchor="middle"
                            fill="#101D26"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {pt.level}
                          </text>
                          <text
                            x={pt.x}
                            y={155}
                            textAnchor="middle"
                            fill="#73777F"
                            fontSize="9"
                          >
                            {pt.date}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        ) : (
          <p className="text-xs text-[#73777F] italic text-center py-6">Registros insuficientes para curva temporal.</p>
        )}
      </div>

      {/* Two columns: Gatilhos & Regiões mais afetadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Triggers */}
        <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
          <h4 className="text-xs font-bold text-[#103557] uppercase tracking-wider mb-2.5">
            Gatilhos Mais Frequentes
          </h4>
          {summary.topTriggers.length === 0 ? (
            <p className="text-xs text-[#73777F] italic">Sem dados registrados.</p>
          ) : (
            <div className="space-y-2">
              {summary.topTriggers.map((t, idx) => (
                <div key={t.trigger} className="flex items-center justify-between text-xs">
                  <span className="text-[#101D26] font-semibold">{t.trigger}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF2F5] text-[#2B4C6F] font-bold text-[10px]">
                    {t.count} episódios
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Affected Body Areas */}
        <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1">
          <h4 className="text-xs font-bold text-[#103557] uppercase tracking-wider mb-2.5">
            Top Regiões de Dor
          </h4>
          {summary.mostAffectedAreas.length === 0 ? (
            <p className="text-xs text-[#73777F] italic">Sem dados registrados.</p>
          ) : (
            <div className="space-y-2">
              {summary.mostAffectedAreas.map((a) => (
                <div key={a.bodyPart} className="flex items-center justify-between text-xs">
                  <span className="text-[#101D26] font-semibold capitalize">
                    {a.bodyPart.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#103557] font-bold text-[10px]">
                    {a.count} ocorrências
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medical Sharing Reassurance Tile */}
      <div className="bg-[#F6F8FA] rounded-2xl p-4 border border-[#DCE3E8] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#356572]" />
          <div>
            <h4 className="text-xs font-bold text-[#103557]">Pronto para Compartilhar na Consulta</h4>
            <p className="text-[11px] text-[#53606B]">Copie o relatório resumido para enviar ao seu médico via WhatsApp ou e-mail.</p>
          </div>
        </div>
        <button
          onClick={handleExportReport}
          className="px-3 py-1.5 rounded-full bg-white border border-[#DCE3E8] text-xs font-bold text-[#103557] hover:bg-[#E2F0FD] whitespace-nowrap shadow-xs"
        >
          {copiedReport ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
};
