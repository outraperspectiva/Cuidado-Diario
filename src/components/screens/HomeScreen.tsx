import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setActiveTab,
  setAddPainLogOpen,
  setQuickSosOpen,
  setAddMedicationOpen,
  setAddExerciseOpen,
  setQuickIntakeModalOpen,
  setQuickPhysioModalOpen,
  setAppointmentsModalOpen,
  showToast
} from '../../store/slices/uiSlice';
import { toggleIntakeStatus } from '../../store/slices/medicationSlice';
import { togglePhysioExecutionStatus } from '../../store/slices/exerciseSlice';
import { PainService } from '../../services/painService';
import { PhysiotherapyService } from '../../services/activityService';
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
  Clock,
  Stethoscope
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const painLogs = useAppSelector((state) => state.pain.logs);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const sleepLogs = useAppSelector((state) => state.sleep.logs);
  const exerciseLogs = useAppSelector((state) => state.exercise.logs);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);
  const appointments = useAppSelector((state) => state.appointments?.appointments || []);

  const latestPain = painLogs[0];
  const todaySleep = sleepLogs[0];
  const todayExercise = exerciseLogs[0];
  const pendingPhysioCount = todayExecutions.filter((e) => e.status === 'pending').length;
  const completedPhysioCount = todayExecutions.filter((e) => e.status === 'completed').length;
  const totalPhysioCount = todayExecutions.length;

  const takenMedsCount = todayIntakes.filter((i) => i.status === 'taken').length;
  const totalMedsCount = todayIntakes.length;

  const upcomingAppointments = appointments.filter((a) => a.status === 'agendada');
  const nextAppointment = upcomingAppointments[0];

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

  const quickAccessCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Ao iniciar a sessão, garantir que o card azul com o dia da semana e mês seja apresentado na rolagem
    const scrollToCard = () => {
      if (quickAccessCardRef.current) {
        quickAccessCardRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    scrollToCard();
    const timer = setTimeout(scrollToCard, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleMed = (intakeId: string, medName: string) => {
    dispatch(toggleIntakeStatus({ id: intakeId }));
    dispatch(showToast({ message: `Status de ${medName} atualizado com sucesso!` }));
  };

  const handleTogglePhysio = async (execId: string, title: string, currentStatus: 'completed' | 'pending') => {
    dispatch(togglePhysioExecutionStatus({ id: execId }));
    await PhysiotherapyService.toggleExecution(user?.uid || 'user-anon', execId);
    if (currentStatus === 'pending') {
      dispatch(showToast({ message: `Sessão de "${title}" realizada! Muito bem!` }));
    } else {
      dispatch(showToast({ message: `Sessão de "${title}" remarcada como a fazer.` }));
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Quick Access Card (Card de Registro Rápido) */}
      <div
        ref={quickAccessCardRef}
        id="card-hoje-destaque-data"
        className="bg-gradient-to-r from-[#103557] to-[#2B4C6F] rounded-3xl p-4 sm:p-5 text-white shadow-sm space-y-3.5 scroll-mt-4"
      >
        {/* Date & Pain/SOS Quick Actions Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-white/15">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-[#88C6B0] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight capitalize block leading-snug">
                {todayDateFormatted}
              </span>
              <span className="text-[10px] text-[#88C6B0] font-medium block">
                Plano Diário de Cuidado
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-register-pain-home"
              type="button"
              onClick={() => dispatch(setAddPainLogOpen(true))}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border border-white/10 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Registrar Dor</span>
            </button>
            <button
              id="btn-sos-crise-feeling-card"
              type="button"
              onClick={() => dispatch(setQuickSosOpen(true))}
              className="flex items-center gap-1 bg-[#D96B5B] hover:bg-[#B34045] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs border border-white/20 cursor-pointer"
              title="Registrar Crise de Dor Imediata (SOS)"
            >
              <AlertCircle className="w-3 h-3 fill-white/20" />
              <span>SOS Crise</span>
            </button>
          </div>
        </div>

        {/* 3 Botões de Acesso Rápido para Registrar: Medicamentos, Fisioterapia, Consultas */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* a) Medicamentos */}
            <button
              id="btn-quick-meds-home"
              type="button"
              onClick={() => dispatch(setQuickIntakeModalOpen(true))}
              className="w-full text-left bg-white text-[#101D26] p-3 sm:p-3.5 rounded-2xl shadow-xs hover:bg-[#F6F8FA] transition-all active:scale-[0.99] border border-white/20 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E2F0FD] text-[#2B4C6F] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#103557]">
                    {takenMedsCount}/{totalMedsCount} tomados
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#103557]">Medicamentos</h4>
                <p className="text-[11px] text-[#53606B] mt-0.5 leading-snug">
                  Dosagem certa, via certa, no horário certo
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EEF2F5] flex items-center justify-between text-[11px] font-bold text-[#2B4C6F]">
                <span>Registrar doses</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#73777F] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* b) Fisioterapia */}
            <button
              id="btn-quick-physio-home"
              type="button"
              onClick={() => dispatch(setQuickPhysioModalOpen(true))}
              className="w-full text-left bg-white text-[#101D26] p-3 sm:p-3.5 rounded-2xl shadow-xs hover:bg-[#F6F8FA] transition-all active:scale-[0.99] border border-white/20 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#AFF0D8] text-[#003B2E] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#AFF0D8] text-[#003B2E]">
                    {completedPhysioCount}/{totalPhysioCount} feitas
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#103557]">Fisioterapia</h4>
                <p className="text-[11px] text-[#53606B] mt-0.5 leading-snug">
                  Adesão às Atividades de Fisioterapia Hoje
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EEF2F5] flex items-center justify-between text-[11px] font-bold text-[#00875A]">
                <span>Registrar atividades</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#73777F] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* c) Consultas */}
            <button
              id="btn-quick-appointments-home"
              type="button"
              onClick={() => dispatch(setAppointmentsModalOpen(true))}
              className="w-full text-left bg-white text-[#101D26] p-3 sm:p-3.5 rounded-2xl shadow-xs hover:bg-[#F6F8FA] transition-all active:scale-[0.99] border border-white/20 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E2F0FD] text-[#103557] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#103557]">
                    {upcomingAppointments.length} agendada{upcomingAppointments.length === 1 ? '' : 's'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#103557]">Consultas</h4>
                <p className="text-[11px] text-[#53606B] mt-0.5 leading-snug">
                  Próximas consultas agendadas e novos registros
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EEF2F5] flex items-center justify-between text-[11px] font-bold text-[#103557]">
                <span>
                  {nextAppointment
                    ? `Próx: ${nextAppointment.date.split('-')[2]}/${nextAppointment.date.split('-')[1]}`
                    : 'Marcar consulta'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#73777F] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
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

      {/* Physiotherapy & Rehabilitation Activities Timeline Card (A Fazer / Feito) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E2F0FD] flex items-center justify-center text-[#2B4C6F]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#103557]">Fisioterapia & Reabilitação de Hoje</h3>
              <p className="text-[11px] text-[#53606B]">Toque no círculo para confirmar a sessão realizada</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-manage-physio-home"
            onClick={() => dispatch(setActiveTab('atividades'))}
            className="text-xs font-bold text-[#2B4C6F] hover:text-[#103557] flex items-center gap-0.5"
          >
            <span>Gerenciar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {todayExecutions.length === 0 ? (
          <div className="text-center py-5 px-3 bg-[#F6F8FA] rounded-xl border border-dashed border-[#DCE3E8] space-y-1.5">
            <p className="text-xs font-semibold text-[#53606B]">Nenhuma atividade de fisioterapia programada para hoje</p>
            <p className="text-[11px] text-[#73777F]">Cadastre seu protocolo para acompanhar as sessões diárias.</p>
            <button
              type="button"
              id="btn-goto-physio-from-home"
              onClick={() => dispatch(setActiveTab('atividades'))}
              className="mt-1 text-xs font-bold text-[#2B4C6F] hover:underline inline-flex items-center gap-1"
            >
              <span>Ver protocolos de Fisioterapia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayExecutions.map((exec) => {
              const isDone = exec.status === 'completed';
              return (
                <div
                  key={exec.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#E2F0FD]/40 border-[#B7E7F7]'
                      : 'bg-[#F6F8FA] border-[#DCE3E8] hover:border-[#2B4C6F]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      id={`btn-home-physio-${exec.id}`}
                      onClick={() => handleTogglePhysio(exec.id, exec.prescriptionTitle, exec.status)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border shrink-0 ${
                        isDone
                          ? 'bg-[#68A691] border-[#68A691] text-white shadow-xs'
                          : 'bg-white border-[#DCE3E8] text-transparent hover:border-[#68A691]'
                      }`}
                      title={isDone ? 'Marcar como a fazer' : 'Marcar como feito'}
                      aria-label={`Marcar ${exec.prescriptionTitle} (${exec.sessionNumber}ª execução) como ${isDone ? 'a fazer' : 'feito'}`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold truncate ${isDone ? 'line-through text-[#73777F]' : 'text-[#103557]'}`}>
                          {exec.prescriptionTitle}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#53606B] font-medium border border-[#DCE3E8] shrink-0">
                          {exec.sessionNumber}ª execução
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#73777F] mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Horário: {exec.scheduledTime}
                        </span>
                        {exec.completedAt && (
                          <span className="text-[#00875A] font-medium">
                            • Feito às {new Date(exec.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isDone ? 'bg-[#AFF0D8] text-[#003B2E]' : 'bg-[#EEF2F5] text-[#53606B]'
                    }`}
                  >
                    {isDone ? 'Feito' : 'A Fazer'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
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
            {pendingPhysioCount > 0 ? (
              <span className="text-[10px] font-bold text-[#93000A] bg-[#FFDAD6] px-2 py-0.5 rounded-full">
                Faltam {pendingPhysioCount}
              </span>
            ) : todayExecutions.length > 0 ? (
              <span className="text-[10px] font-bold text-[#003B2E] bg-[#AFF0D8] px-2 py-0.5 rounded-full">
                Fisio em dia ✓
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#2B4C6F] bg-[#E2F0FD] px-2 py-0.5 rounded-full capitalize">
                {todayExercise ? todayExercise.painImpact : 'Sem registros'}
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums">
            {todayExecutions.length > 0
              ? `${completedPhysioCount}/${todayExecutions.length}`
              : todayExercise
              ? `${todayExercise.durationMinutes} min`
              : '--'}
          </div>
          <p className="text-[11px] text-[#53606B] mt-1 capitalize line-clamp-1">
            {todayExecutions.length > 0
              ? `${completedPhysioCount} de ${todayExecutions.length} sessões de fisioterapia concluídas hoje`
              : todayExercise
              ? `${todayExercise.activityType} • ${todayExercise.intensity}`
              : 'Toque para acompanhar suas sessões de fisioterapia.'}
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
