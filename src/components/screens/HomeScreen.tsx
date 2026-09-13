import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, setAddPainLogOpen, setQuickSosOpen, setAddMedicationOpen, showToast } from '../../store/slices/uiSlice';
import { toggleIntakeStatus } from '../../store/slices/medicationSlice';
import { PainService } from '../../services/painService';
import {
  HeartPulse,
  Pill,
  Moon,
  Sparkles,
  Check,
  ChevronRight,
  Plus,
  AlertCircle,
  Activity,
  Calendar,
  Clock
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const painLogs = useAppSelector((state) => state.pain.logs);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const sleepLogs = useAppSelector((state) => state.sleep.logs);
  const exerciseLogs = useAppSelector((state) => state.exercise.logs);

  const latestPain = painLogs[0];
  const todaySleep = sleepLogs[0];
  const todayExercise = exerciseLogs[0];

  const severityCat = latestPain ? PainService.getSeverityCategory(latestPain.painLevel) : 'mild';
  const severityColor = PainService.getSeverityColor(severityCat);

  // Nome do paciente legível e acolhedor (sem abreviação de e-mail)
  const patientDisplayName =
    user?.name &&
    !user.name.toLowerCase().includes('outraperspectiva') &&
    user.name.toLowerCase() !== 'outra' &&
    !user.name.includes('@')
      ? user.name
      : 'Fábio Fernandez';

  const todayDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const handleToggleMed = (intakeId: string, medName: string) => {
    dispatch(toggleIntakeStatus({ id: intakeId }));
    dispatch(showToast({ message: `Status de ${medName} atualizado com sucesso!` }));
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Date & Welcoming Context */}
      <div className="bg-gradient-to-r from-[#103557] to-[#2B4C6F] rounded-3xl p-5 text-white shadow-sm">
        <div className="flex items-center gap-1.5 text-xs text-[#88C6B0] font-semibold capitalize mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{todayDateFormatted}</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Como você está se sentindo agora, {patientDisplayName}?
        </h2>
        <p className="text-xs text-[#E2F0FD]/80 mt-1 leading-relaxed">
          Seu espaço seguro para registrar cada detalhe e acompanhar seu progresso sem sobrecarga.
        </p>

        {/* Quick Action Pills inside banner */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-white/15">
          <button
            id="btn-register-pain-home"
            type="button"
            onClick={() => dispatch(setAddPainLogOpen(true))}
            className="flex items-center gap-1.5 bg-white text-[#103557] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#E2F0FD] transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Dor</span>
          </button>
          <button
            id="btn-sos-crise-feeling-card"
            type="button"
            onClick={() => dispatch(setQuickSosOpen(true))}
            className="flex items-center gap-1.5 bg-[#D96B5B] hover:bg-[#B34045] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs border border-white/20"
            title="Registrar Crise de Dor Imediata (SOS)"
          >
            <AlertCircle className="w-3.5 h-3.5 fill-white/20" />
            <span>SOS Crise</span>
          </button>
        </div>
      </div>

      {/* Pain Status Card (3px Left Severity Border per design specs) */}
      <div
        className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1 relative overflow-hidden transition-all"
        style={{ borderLeftWidth: '4px', borderLeftColor: severityColor }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#53606B]">
              Último Registro de Dor
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold tracking-tight tabular-nums" style={{ color: severityColor }}>
                {latestPain ? `${latestPain.painLevel}/10` : 'Sem registros'}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white shadow-xs"
                style={{ backgroundColor: severityColor }}
              >
                {latestPain ? PainService.getSeverityLabel(severityCat) : 'Equilíbrio'}
              </span>
            </div>
          </div>
          <button
            onClick={() => dispatch(setActiveTab('dor'))}
            className="text-xs font-bold text-[#2B4C6F] hover:text-[#103557] flex items-center gap-0.5 p-1"
          >
            <span>Ver Mapa</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {latestPain && (
          <div className="mt-3 pt-3 border-t border-[#DCE3E8]/60 space-y-1.5 text-xs text-[#53606B]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[#101D26]">Regiões:</span>
              {latestPain.bodyLocations.map((loc) => (
                <span key={loc} className="px-2 py-0.5 bg-[#EEF2F5] rounded-md text-[11px] text-[#2B4C6F] font-medium capitalize">
                  {loc.replace('_', ' ')}
                </span>
              ))}
            </div>
            {latestPain.notes && (
              <p className="italic text-[#73777F] line-clamp-1">"{latestPain.notes}"</p>
            )}
          </div>
        )}
      </div>

      {/* Medication Timeline Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E2F0FD] flex items-center justify-center text-[#2B4C6F]">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#103557]">Medicamentos de Hoje</h3>
              <p className="text-[11px] text-[#53606B]">Toque no círculo para confirmar a dose tomada</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setActiveTab('medicamentos'))}
            className="text-xs font-bold text-[#2B4C6F] hover:text-[#103557] flex items-center gap-0.5"
          >
            <span>Gerenciar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {todayIntakes.slice(0, 4).map((intake) => {
            const isTaken = intake.status === 'taken';
            return (
              <div
                key={intake.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isTaken
                    ? 'bg-[#E2F0FD]/40 border-[#B7E7F7]'
                    : 'bg-[#F6F8FA] border-[#DCE3E8] hover:border-[#2B4C6F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleMed(intake.id, intake.medicationName)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border ${
                      isTaken
                        ? 'bg-[#68A691] border-[#68A691] text-white shadow-xs'
                        : 'bg-white border-[#DCE3E8] text-transparent hover:border-[#68A691]'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isTaken ? 'line-through text-[#73777F]' : 'text-[#103557]'}`}>
                        {intake.medicationName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#53606B] font-medium border border-[#DCE3E8]">
                        {intake.dosage}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#73777F] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> Horário: {intake.scheduledTime}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isTaken ? 'bg-[#AFF0D8] text-[#003B2E]' : 'bg-[#EEF2F5] text-[#53606B]'
                  }`}
                >
                  {isTaken ? 'Tomado' : 'Pendente'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Sono & Atividade Restaurativa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Sleep Card */}
        <div
          onClick={() => dispatch(setActiveTab('atividades'))}
          className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 hover:border-[#2B4C6F] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#103557] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#356572]" /> Sono da Noite
            </span>
            <span className="text-[10px] font-bold text-[#68A691] bg-[#AFF0D8]/40 px-2 py-0.5 rounded-full">
              {todaySleep ? `Score ${todaySleep.restedScore}%` : 'Sem registros'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums">
            {todaySleep ? `${todaySleep.durationHours}h ${todaySleep.durationMinutes}min` : '--'}
          </div>
          <p className="text-[11px] text-[#53606B] mt-1 line-clamp-1">
            {todaySleep ? todaySleep.notes : 'Toque para registrar o descanso da noite.'}
          </p>
        </div>

        {/* Activity Card */}
        <div
          onClick={() => dispatch(setActiveTab('atividades'))}
          className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 hover:border-[#2B4C6F] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#103557] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#356572]" /> Movimento / Fisio
            </span>
            <span className="text-[10px] font-bold text-[#2B4C6F] bg-[#E2F0FD] px-2 py-0.5 rounded-full capitalize">
              {todayExercise ? todayExercise.painImpact : 'Sem registros'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums">
            {todayExercise ? `${todayExercise.durationMinutes} min` : '--'}
          </div>
          <p className="text-[11px] text-[#53606B] mt-1 capitalize line-clamp-1">
            {todayExercise ? `${todayExercise.activityType} • ${todayExercise.intensity}` : 'Toque para registrar sua atividade.'}
          </p>
        </div>
      </div>

      {/* Gentle Reassurance Quote Tile */}
      <div className="p-4 rounded-2xl bg-[#E2F0FD]/60 border border-[#B7E7F7] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#356572] shrink-0 mt-0.5" />
        <p className="text-xs text-[#2B4C6F] leading-relaxed font-medium">
          Lembre-se: gerenciar a dor é um processo diário de escuta do próprio corpo. Respeite seus limites e faça pausas sempre que necessário.
        </p>
      </div>
    </div>
  );
};
