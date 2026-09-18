import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addSleepLog, deleteSleepLog } from '../../store/slices/sleepSlice';
import {
  addExerciseLog,
  deleteExerciseLog,
  addPhysioPrescription,
  deletePhysioPrescription,
  togglePhysioExecutionStatus
} from '../../store/slices/exerciseSlice';
import { showToast, setAddExerciseOpen, setAddSleepOpen } from '../../store/slices/uiSlice';
import { SleepService, ExerciseService, PhysiotherapyService } from '../../services/activityService';
import { formatExerciseDateTime, formatSleepDate } from '../../utils/dateUtils';
import {
  Moon,
  Activity,
  Plus,
  Star,
  Clock,
  Heart,
  AlertCircle,
  X,
  Trash2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Check,
  FileText
} from 'lucide-react';
import {
  SleepLog,
  ExerciseLog,
  PhysiotherapyDetails,
  PhysiotherapyPrescription,
  PhysiotherapyExecution
} from '../../types';
import { PhysiotherapyDetailsModal } from '../activities/PhysiotherapyDetailsModal';

const UPPER_LIMB_LABELS: Record<string, { code: string; nerve: string; color: string }> = {
  ulnt_1: { code: 'ULNT 1', nerve: 'N. Mediano', color: 'bg-[#E2F0FD] text-[#103557]' },
  ulnt_2a: { code: 'ULNT 2a', nerve: 'N. Mediano', color: 'bg-[#E2F0FD] text-[#103557]' },
  ulnt_2b: { code: 'ULNT 2b', nerve: 'N. Radial', color: 'bg-[#FFF0D4] text-[#8C5800]' },
  ulnt_3: { code: 'ULNT 3', nerve: 'N. Ulnar', color: 'bg-[#AFF0D8] text-[#003B2E]' }
};

const SENSATION_LABELS: Record<string, string> = {
  formigamento_parestesia: 'Formigamento / Parestesia',
  pontada_fisgada: 'Pontada / Fisgada',
  tensao_muscular_suave: 'Tensão Muscular Suave',
  queimacao_trajeto: 'Queimação no Trajeto',
  alivio_imediato: 'Alívio Imediato'
};

const EFFORT_LABELS: Record<string, { label: string; bg: string }> = {
  muito_facil: { label: 'Muito Fácil', bg: 'bg-[#AFF0D8] text-[#003B2E]' },
  moderado: { label: 'Moderado', bg: 'bg-[#E2F0FD] text-[#103557]' },
  dificil: { label: 'Difícil', bg: 'bg-[#FFF0D4] text-[#8C5800]' },
  no_limite: { label: 'No Limite', bg: 'bg-[#FFDAD6] text-[#93000A]' }
};

export const ActivitiesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const sleepLogs = useAppSelector((state) => state.sleep.logs);
  const exerciseLogs = useAppSelector((state) => state.exercise.logs);
  const physioPrescriptions = useAppSelector((state) => state.exercise.prescriptions || []);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);
  const user = useAppSelector((state) => state.auth.user);
  const isAddExerciseOpen = useAppSelector((state) => state.ui.isAddExerciseOpen);
  const isAddSleepOpen = useAppSelector((state) => state.ui.isAddSleepOpen);

  const completedExecsCount = todayExecutions.filter((e) => e.status === 'completed').length;
  const pendingPhysioCount = todayExecutions.filter((e) => e.status === 'pending').length;
  const physioAdherencePercent =
    todayExecutions.length > 0 ? Math.round((completedExecsCount / todayExecutions.length) * 100) : 100;

  const [activeTab, setActiveTab] = useState<'sono' | 'exercicio'>('sono');
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  // Physiotherapy Prescription form state
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [rxToDelete, setRxToDelete] = useState<PhysiotherapyPrescription | null>(null);
  const [rxTitle, setRxTitle] = useState('Neurodinâmica / Mobilização Neural ULNT');
  const [rxPrescribedBy, setRxPrescribedBy] = useState('Dra. Patrícia Lima (Fisioterapeuta)');
  const [rxIsChronic, setRxIsChronic] = useState(false);
  const [rxTimesPerDay, setRxTimesPerDay] = useState(2);
  const [rxDurationDays, setRxDurationDays] = useState(14);
  const [rxStartDate, setRxStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rxScheduledTimesStr, setRxScheduledTimesStr] = useState('09:00, 16:00');
  const [rxInstructions, setRxInstructions] = useState('Realizar 3 séries de 10 repetições por membro. Respeitar o limiar de dor.');
  const [rxPhysioDetails, setRxPhysioDetails] = useState<PhysiotherapyDetails | undefined>(undefined);
  const [isRxDetailsModalOpen, setIsRxDetailsModalOpen] = useState(false);

  // Physiotherapy Details Modal State for ad-hoc log
  const [isPhysioModalOpen, setIsPhysioModalOpen] = useState(false);
  const [physioDetails, setPhysioDetails] = useState<PhysiotherapyDetails | undefined>(undefined);
  const [expandedPhysioCardId, setExpandedPhysioCardId] = useState<string | null>(null);

  // Helper to format local date for datetime-local input (YYYY-MM-DDTHH:mm)
  const getNowDatetimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  const calculateEndDateStr = (start: string, days: number): string => {
    try {
      const date = new Date(start + 'T00:00:00');
      date.setDate(date.getDate() + Number(days) - 1);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  // Sleep form state
  const [sleepDate, setSleepDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(0);
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [wakeUps, setWakeUps] = useState(1);
  const [sleepNotes, setSleepNotes] = useState('');

  // Exercise form state
  const [exerciseDateTime, setExerciseDateTime] = useState(getNowDatetimeLocal());
  const [activityType, setActivityType] = useState<ExerciseLog['activityType']>('alongamento');
  const [duration, setDuration] = useState(25);
  const [intensity, setIntensity] = useState<ExerciseLog['intensity']>('leve');
  const [painImpact, setPainImpact] = useState<ExerciseLog['painImpact']>('aliviou');
  const [exerciseNotes, setExerciseNotes] = useState('');

  // Delete exercise state
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseLog | null>(null);
  // Delete sleep state
  const [sleepToDelete, setSleepToDelete] = useState<SleepLog | null>(null);

  React.useEffect(() => {
    if (isAddExerciseOpen) {
      setActiveTab('exercicio');
      setActivityType('fisioterapia');
      setIsExerciseModalOpen(true);
      dispatch(setAddExerciseOpen(false));
    }
  }, [isAddExerciseOpen, dispatch]);

  React.useEffect(() => {
    if (isAddSleepOpen) {
      setActiveTab('sono');
      setIsSleepModalOpen(true);
      dispatch(setAddSleepOpen(false));
    }
  }, [isAddSleepOpen, dispatch]);

  const handleTogglePhysioExecution = async (exec: PhysiotherapyExecution) => {
    dispatch(togglePhysioExecutionStatus({ id: exec.id }));
    await PhysiotherapyService.toggleExecution(user?.uid || 'user-anon', exec.id);
    if (exec.status === 'pending') {
      dispatch(showToast({ message: 'Sessão de fisioterapia realizada! Parabéns pelo cuidado!' }));
    } else {
      dispatch(showToast({ message: 'Sessão remarcada como pendente.' }));
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxTitle.trim()) {
      dispatch(showToast({ message: 'Informe o nome do protocolo de fisioterapia.', type: 'error' }));
      return;
    }

    if (!rxIsChronic) {
      if (!rxTimesPerDay || Number(rxTimesPerDay) < 1) {
        dispatch(showToast({ message: 'Informe o número de execuções diárias.', type: 'error' }));
        return;
      }
      if (!rxDurationDays || Number(rxDurationDays) < 1) {
        dispatch(showToast({ message: 'Informe o período em dias indicado.', type: 'error' }));
        return;
      }
    }

    const times = rxScheduledTimesStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let calculatedEndDate: string | undefined = undefined;
    if (!rxIsChronic && rxDurationDays > 0) {
      const start = new Date(rxStartDate + 'T00:00:00');
      start.setDate(start.getDate() + Number(rxDurationDays) - 1);
      calculatedEndDate = start.toISOString().split('T')[0];
    }

    const newRx = await PhysiotherapyService.createPrescription(user?.uid || 'user-anon', {
      title: rxTitle.trim(),
      prescribedBy: rxPrescribedBy.trim() || undefined,
      isChronic: rxIsChronic,
      timesPerDay: rxIsChronic ? undefined : Number(rxTimesPerDay),
      durationDays: rxIsChronic ? undefined : Number(rxDurationDays),
      startDate: rxStartDate,
      endDate: calculatedEndDate,
      scheduledTimes: times.length > 0 ? times : ['09:00', '16:00'],
      instructions: rxInstructions.trim() || undefined,
      isActive: true,
      physiotherapyDetails: rxPhysioDetails
    });

    dispatch(addPhysioPrescription(newRx));
    dispatch(showToast({ message: `Prescrição "${newRx.title}" cadastrada com sucesso!` }));
    setIsRxModalOpen(false);
    setRxTitle('Neurodinâmica / Mobilização Neural ULNT');
    setRxPrescribedBy('Dra. Patrícia Lima (Fisioterapeuta)');
    setRxInstructions('Realizar 3 séries de 10 repetições por membro. Respeitar o limiar de dor.');
    setRxPhysioDetails(undefined);
    setRxIsChronic(false);
    setRxTimesPerDay(2);
    setRxDurationDays(14);
    setRxScheduledTimesStr('09:00, 16:00');
  };

  const handleConfirmDeletePrescription = async () => {
    if (!rxToDelete) return;
    try {
      await PhysiotherapyService.deletePrescription(user?.uid || 'user-anon', rxToDelete.id);
      dispatch(deletePhysioPrescription(rxToDelete.id));
      dispatch(showToast({ message: `Prescrição "${rxToDelete.title}" removida com sucesso.` }));
    } finally {
      setRxToDelete(null);
    }
  };

  const handleActivityTypeChange = (newType: ExerciseLog['activityType']) => {
    setActivityType(newType);
    if (newType === 'fisioterapia') {
      setIsPhysioModalOpen(true);
    }
  };

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSleep = await SleepService.createSleepLog(user?.uid || 'user-anon', {
      date: sleepDate || new Date().toISOString().split('T')[0],
      durationHours: Number(hours),
      durationMinutes: Number(minutes),
      qualityRating: quality,
      wakeUpsCount: Number(wakeUps),
      sleepTime: '23:00',
      wakeTime: '06:30',
      disruptions: wakeUps > 0 ? ['despertar_noturno'] : [],
      restedScore: quality * 20,
      notes: sleepNotes.trim() || undefined,
    });

    dispatch(addSleepLog(newSleep));
    dispatch(showToast({ message: 'Noite de sono registrada com sucesso!' }));
    setIsSleepModalOpen(false);
    setSleepNotes('');
    setSleepDate(new Date().toISOString().split('T')[0]);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activityType === 'fisioterapia' && !physioDetails) {
      setIsPhysioModalOpen(true);
      dispatch(
        showToast({
          message: 'Por favor, revise e conclua o detalhamento do exercício de fisioterapia.'
        })
      );
      return;
    }

    const dateToSave = exerciseDateTime ? new Date(exerciseDateTime).toISOString() : new Date().toISOString();
    const newEx = await ExerciseService.createExerciseLog(user?.uid || 'user-anon', {
      date: dateToSave,
      activityType,
      durationMinutes: Number(duration),
      intensity,
      painImpact,
      notes: exerciseNotes.trim() || undefined,
      physiotherapyDetails: activityType === 'fisioterapia' ? physioDetails : undefined
    });

    dispatch(addExerciseLog(newEx));
    dispatch(showToast({ message: 'Atividade física registrada com sucesso!' }));
    setIsExerciseModalOpen(false);
    setExerciseNotes('');
    setPhysioDetails(undefined);
    setDuration(25);
    setExerciseDateTime(getNowDatetimeLocal());
  };

  const handleConfirmDelete = async () => {
    if (!exerciseToDelete) return;
    const id = exerciseToDelete.id;
    dispatch(deleteExerciseLog(id));
    if (user?.uid) {
      await ExerciseService.deleteExerciseLog(user.uid, id);
    }
    dispatch(showToast({ message: 'Registro de atividade removido com sucesso.' }));
    setExerciseToDelete(null);
  };

  const handleConfirmDeleteSleep = async () => {
    if (!sleepToDelete) return;
    const id = sleepToDelete.id;
    dispatch(deleteSleepLog(id));
    if (user?.uid) {
      await SleepService.deleteSleepLog(user.uid, id);
    }
    dispatch(showToast({ message: 'Registro de sono excluído com sucesso.' }));
    setSleepToDelete(null);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#103557]">Físio & Sono</h2>
          <p className="text-xs text-[#53606B]">Descanso restaurador, fisioterapia e reabilitação</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#DCE3E8] elevation-1">
        <button
          type="button"
          onClick={() => setActiveTab('sono')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'sono'
              ? 'bg-[#103557] text-white shadow-xs'
              : 'text-[#53606B] hover:text-[#103557]'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Sono & Repouso ({sleepLogs.length})</span>
        </button>
        <button
          type="button"
          id="btn-tab-fisioterapia-exercicio"
          onClick={() => setActiveTab('exercicio')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'exercicio'
              ? 'bg-[#103557] text-white shadow-xs'
              : 'text-[#53606B] hover:text-[#103557]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Fisioterapia & Exercícios</span>
          {pendingPhysioCount > 0 ? (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D96B5B] text-white animate-pulse">
              {pendingPhysioCount}
            </span>
          ) : (
            <span className="text-[11px] opacity-75">({exerciseLogs.length})</span>
          )}
        </button>
      </div>

      {/* Sono View */}
      {activeTab === 'sono' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#103557]">Histórico de Sono</h3>
              <p className="text-xs text-[#53606B]">A qualidade do sono é crucial na modulação da dor</p>
            </div>
            <button
              onClick={() => setIsSleepModalOpen(true)}
              className="flex items-center gap-1 bg-[#2B4C6F] hover:bg-[#103557] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Noite</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {sleepLogs.length === 0 ? (
              <div className="text-center py-8 px-4 bg-white rounded-2xl border border-dashed border-[#DCE3E8] space-y-2">
                <Moon className="w-8 h-8 text-[#73777F] mx-auto opacity-50" />
                <p className="text-xs font-semibold text-[#53606B]">Nenhuma noite de sono registrada ainda</p>
                <p className="text-[11px] text-[#73777F]">Clique em "Registrar Noite" para adicionar seu histórico de descanso.</p>
              </div>
            ) : (
              sleepLogs.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 transition-all hover:border-[#B3C8DB]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#53606B] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#2B4C6F]" />
                        <span>{formatSleepDate(s.date)}</span>
                      </div>
                      <div className="text-xl font-extrabold text-[#103557] tabular-nums mt-0.5">
                        {s.durationHours}h {s.durationMinutes > 0 ? `${s.durationMinutes}min` : ''}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 justify-end">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= s.qualityRating ? 'fill-[#D99B4E] text-[#D99B4E]' : 'text-[#DCE3E8]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#68A691] bg-[#AFF0D8]/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Score {s.restedScore}%
                        </span>
                      </div>

                      {/* Botão de Excluir Registro de Sono */}
                      <button
                        type="button"
                        id={`btn-delete-sleep-${s.id}`}
                        onClick={() => setSleepToDelete(s)}
                        className="p-1.5 text-[#73777F] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/60 rounded-lg transition-colors ml-1"
                        title="Excluir este registro de sono"
                        aria-label="Excluir registro de sono"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#DCE3E8]/60 flex items-center justify-between text-xs text-[#53606B]">
                    <span>Despertares noturnos: <strong>{s.wakeUpsCount}</strong></span>
                    {s.notes && <span className="italic text-[#73777F] truncate max-w-[200px]">"{s.notes}"</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Exercício View */}
      {activeTab === 'exercicio' && (
        <div className="space-y-4">
          {/* Card de Resumo de Adesão Diária da Fisioterapia */}
          <div className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs text-[#53606B] font-semibold block">Adesão às Atividades de Fisioterapia Hoje</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-[#103557] tabular-nums">{physioAdherencePercent}%</span>
                <span className="text-xs text-[#53606B]">
                  ({completedExecsCount} de {todayExecutions.length} {todayExecutions.length === 1 ? 'sessão realizada' : 'sessões realizadas'})
                </span>
              </div>
              <div className="text-[11px] font-semibold mt-1">
                {pendingPhysioCount === 0 && todayExecutions.length > 0 ? (
                  <span className="text-[#00875A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                    Todas as atividades prescritas de hoje foram concluídas!
                  </span>
                ) : pendingPhysioCount > 0 ? (
                  <span className="text-[#D96B5B] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D96B5B]" />
                    Faltam <strong>{pendingPhysioCount}</strong> {pendingPhysioCount === 1 ? 'atividade prescrita' : 'atividades prescritas'} hoje
                  </span>
                ) : (
                  <span className="text-[#73777F]">Nenhuma atividade prescrita agendada para hoje</span>
                )}
              </div>
            </div>

            <div className="w-12 h-12 rounded-full border-4 border-[#EEF2F5] border-t-[#2B4C6F] flex items-center justify-center font-extrabold text-xs text-[#103557] shrink-0">
              {completedExecsCount}/{todayExecutions.length}
            </div>
          </div>

          {/* 1. Sessões Prescritas para Hoje */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#103557]">Sessões Prescritas para Hoje</h3>
                {pendingPhysioCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D96B5B] text-white">
                    Faltam {pendingPhysioCount}
                  </span>
                )}
              </div>
            </div>

            {todayExecutions.length === 0 ? (
              <div className="text-center py-6 px-4 bg-white rounded-2xl border border-dashed border-[#DCE3E8] space-y-1">
                <Activity className="w-7 h-7 text-[#73777F] mx-auto opacity-50" />
                <p className="text-xs font-semibold text-[#53606B]">Nenhuma sessão de fisioterapia agendada para hoje</p>
                <p className="text-[11px] text-[#73777F]">
                  Cadastre uma prescrição abaixo para acompanhar o número de execuções diárias e o período prescrito.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayExecutions.map((exec) => {
                  const isDone = exec.status === 'completed';
                  return (
                    <div
                      key={exec.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-[#F0FAF5] border-[#AFF0D8]'
                          : 'bg-white border-[#DCE3E8] hover:border-[#2B4C6F] elevation-1'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePhysioExecution(exec)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                            isDone
                              ? 'bg-[#00875A] text-white shadow-xs'
                              : 'border-2 border-[#DCE3E8] hover:border-[#2B4C6F] text-transparent hover:text-[#2B4C6F]/40'
                          }`}
                          title={isDone ? 'Marcar como pendente' : 'Marcar como realizada'}
                          aria-label={`Marcar sessão ${exec.sessionNumber} como ${isDone ? 'pendente' : 'realizada'}`}
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold truncate ${isDone ? 'line-through text-[#53606B]' : 'text-[#103557]'}`}>
                              {exec.prescriptionTitle}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EEF2F5] text-[#53606B] font-semibold">
                              {exec.sessionNumber}ª execução do dia
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#53606B] mt-0.5">
                            <span className="flex items-center gap-1 font-semibold text-[#2B4C6F]">
                              <Clock className="w-3 h-3" /> Horário: {exec.scheduledTime}
                            </span>
                            {exec.completedAt && (
                              <span className="text-[10px] text-[#00875A] font-medium">
                                • Concluída às {new Date(exec.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePhysioExecution(exec)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
                          isDone
                            ? 'bg-[#AFF0D8] text-[#003B2E] hover:bg-[#85E2C2]'
                            : 'bg-[#103557] hover:bg-[#2B4C6F] text-white shadow-xs'
                        }`}
                      >
                        {isDone ? 'Concluída ✓' : 'Realizar ✓'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Prescrições de Fisioterapia & Reabilitação */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#103557]">Prescrições de Fisioterapia</h3>
                <p className="text-xs text-[#53606B]">Protocolos com número de execuções diárias e período em dias</p>
              </div>
              <button
                type="button"
                id="btn-new-physio-prescription"
                onClick={() => setIsRxModalOpen(true)}
                className="flex items-center gap-1 bg-[#103557] hover:bg-[#2B4C6F] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Prescrição</span>
              </button>
            </div>

            {physioPrescriptions.length === 0 ? (
              <div className="text-center py-6 px-4 bg-white rounded-2xl border border-dashed border-[#DCE3E8] space-y-1">
                <p className="text-xs font-semibold text-[#53606B]">Nenhuma prescrição de fisioterapia cadastrada</p>
                <p className="text-[11px] text-[#73777F]">
                  Toque em "Nova Prescrição" para registrar o protocolo com número de execuções diárias e duração.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {physioPrescriptions.map((rx) => (
                  <div key={rx.id} className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 hover:border-[#B3C8DB] transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[#103557]">{rx.title}</h4>
                          {rx.isChronic === false ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0D4] text-[#8C5800] font-bold border border-[#E8D1A7]">
                              Tratamento Temporário • {rx.timesPerDay || rx.scheduledTimes.length}x ao dia ({rx.durationDays} dias)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F] font-semibold border border-[#DCE3E8]">
                              Protocolo Contínuo
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#53606B] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2B4C6F]" />
                          <span>Horários Programados: <strong>{rx.scheduledTimes.join(', ')}</strong></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setRxToDelete(rx)}
                        className="text-[#73777F] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 p-2 rounded-xl transition-colors"
                        title={`Excluir ${rx.title}`}
                        aria-label={`Excluir prescrição ${rx.title}`}
                      >
                        <Trash2 className="w-4 h-4 text-[#BA1A1A]" />
                      </button>
                    </div>

                    {rx.instructions && (
                      <p className="text-xs text-[#53606B] bg-[#F6F8FA] p-2.5 rounded-xl border border-[#DCE3E8]/60 mt-2.5">
                        <strong>Orientações:</strong> {rx.instructions}
                      </p>
                    )}

                    {/* ULNT / Physiotherapy details */}
                    {rx.physiotherapyDetails && (
                      <div className="mt-2.5 pt-2.5 border-t border-[#DCE3E8]/60 flex flex-wrap gap-2 text-[11px]">
                        {rx.physiotherapyDetails.upperLimbExercises && rx.physiotherapyDetails.upperLimbExercises.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-bold text-[#53606B]">Exercícios ULNT:</span>
                            {rx.physiotherapyDetails.upperLimbExercises.map((ex) => (
                              <span key={ex} className="px-1.5 py-0.5 rounded bg-[#E2F0FD] text-[#103557] font-semibold text-[10px]">
                                {UPPER_LIMB_LABELS[ex]?.code || ex.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                        {rx.physiotherapyDetails.sets && (
                          <span className="text-[#53606B]">
                            • Dosagem: <strong>{rx.physiotherapyDetails.sets} séries x {rx.physiotherapyDetails.repetitions} reps</strong> ({rx.physiotherapyDetails.holdTimeSeconds}s sustentação)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#DCE3E8]/60 flex-wrap gap-2">
                      <div className="text-[11px] text-[#73777F] italic">
                        {rx.prescribedBy ? `Prescrito por: ${rx.prescribedBy}` : ''}
                        {rx.isChronic === false ? (
                          <span className="text-[#8C5800] font-semibold not-italic ml-1">
                            • Período: {rx.durationDays} dias {rx.endDate ? `(término em ${new Date(rx.endDate + 'T00:00:00').toLocaleDateString('pt-BR')})` : ''}
                          </span>
                        ) : (
                          <span className="ml-1">• Regime Contínuo</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setRxToDelete(rx)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#BA1A1A] hover:text-[#93000A] bg-[#FFDAD6]/30 hover:bg-[#FFDAD6]/60 px-2.5 py-1 rounded-full border border-[#D96B5B]/30 transition-colors active:scale-95"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir Prescrição</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Histórico de Atividades Realizadas & Registros Avulsos */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#103557]">Histórico de Atividades Realizadas</h3>
                <p className="text-xs text-[#53606B]">Registros avulsos de alongamento, caminhada e movimentos</p>
              </div>
              <button
                onClick={() => setIsExerciseModalOpen(true)}
                className="flex items-center gap-1 bg-[#2B4C6F] hover:bg-[#103557] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Atividade Avulsa</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {exerciseLogs.length === 0 ? (
                <div className="text-center py-8 px-4 bg-white rounded-2xl border border-dashed border-[#DCE3E8] space-y-2">
                  <Activity className="w-8 h-8 text-[#73777F] mx-auto opacity-50" />
                  <p className="text-xs font-semibold text-[#53606B]">Nenhuma atividade avulsa registrada ainda</p>
                  <p className="text-[11px] text-[#73777F]">Clique em "Registrar Atividade Avulsa" para adicionar histórico de movimento livre.</p>
                </div>
              ) : (
              exerciseLogs.map((e) => {
                const impactColor =
                  e.painImpact === 'aliviou'
                    ? 'bg-[#AFF0D8] text-[#003B2E]'
                    : e.painImpact === 'neutro'
                    ? 'bg-[#E2F0FD] text-[#2B4C6F]'
                    : 'bg-[#FFDAD6] text-[#93000A]';

                const impactLabel =
                  e.painImpact === 'aliviou'
                    ? 'Aliviou a Dor ✓'
                    : e.painImpact === 'neutro'
                    ? 'Impacto Neutro'
                    : 'Aumentou a Dor ⚠';

                return (
                  <div key={e.id} className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 transition-all hover:border-[#B3C8DB]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#53606B] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#2B4C6F]" />
                          <span>{formatExerciseDateTime(e.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <h4 className="text-sm font-bold text-[#103557] capitalize">
                            {e.activityType.replace('_', ' ')}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EEF2F5] text-[#53606B] font-semibold capitalize">
                            Intensidade {e.intensity}
                          </span>
                          {e.physiotherapyDetails && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#E2F0FD] text-[#103557] font-bold flex items-center gap-1">
                              <Activity className="w-3 h-3 text-[#2B4C6F]" />
                              Neurodinâmica ULNT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="text-right">
                          <div className="text-base font-extrabold text-[#103557] tabular-nums">
                            {e.durationMinutes} min
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${impactColor}`}>
                            {impactLabel}
                          </span>
                        </div>

                        {/* Botão de Remover Atividade */}
                        <button
                          type="button"
                          onClick={() => setExerciseToDelete(e)}
                          className="p-1.5 text-[#73777F] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/60 rounded-lg transition-colors ml-1"
                          title="Remover este registro de atividade"
                          aria-label="Remover atividade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Detalhes específicos de Fisioterapia / Neurodinâmica */}
                    {e.physiotherapyDetails && (
                      <div className="mt-3 pt-3 border-t border-[#DCE3E8]/70 space-y-2">
                        {/* Exercícios de Membros Superiores */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#53606B] mb-1">
                            Exercícios Selecionados (Membros Superiores)
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {e.physiotherapyDetails.upperLimbExercises.map((exKey) => {
                              const meta = UPPER_LIMB_LABELS[exKey] || {
                                code: exKey.toUpperCase(),
                                nerve: '',
                                color: 'bg-[#EEF2F5] text-[#103557]'
                              };
                              return (
                                <span
                                  key={exKey}
                                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#DCE3E8] ${meta.color}`}
                                >
                                  {meta.code} <span className="font-normal opacity-85">({meta.nerve})</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Grade com Lateralidade, Dosagem, EVA e Respostas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                          <div className="bg-[#F6F8FA] p-2 rounded-xl border border-[#DCE3E8]/60">
                            <span className="text-[10px] font-semibold text-[#73777F] block">Execução</span>
                            <span className="font-bold text-[#103557] capitalize">
                              {e.physiotherapyDetails.laterality === 'direito'
                                ? 'Membro Direito'
                                : e.physiotherapyDetails.laterality === 'esquerdo'
                                ? 'Membro Esquerdo'
                                : 'Bilateral'}
                            </span>
                          </div>

                          <div className="bg-[#F6F8FA] p-2 rounded-xl border border-[#DCE3E8]/60">
                            <span className="text-[10px] font-semibold text-[#73777F] block">Dosagem</span>
                            <span className="font-bold text-[#103557]">
                              {e.physiotherapyDetails.sets}x{e.physiotherapyDetails.repetitions}{' '}
                              <span className="text-[11px] font-normal text-[#53606B]">
                                ({e.physiotherapyDetails.holdTimeSeconds}s sust.)
                              </span>
                            </span>
                          </div>

                          <div className="bg-[#F6F8FA] p-2 rounded-xl border border-[#DCE3E8]/60">
                            <span className="text-[10px] font-semibold text-[#73777F] block">Dor EVA</span>
                            <span className="font-bold text-[#103557]">
                              Durante: <span className="text-[#2B7A78]">{e.physiotherapyDetails.painDuring}</span> | Pós:{' '}
                              <span className="text-[#00875A]">{e.physiotherapyDetails.painAfter}</span>
                            </span>
                          </div>

                          <div className="bg-[#F6F8FA] p-2 rounded-xl border border-[#DCE3E8]/60">
                            <span className="text-[10px] font-semibold text-[#73777F] block">Esforço</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${
                                EFFORT_LABELS[e.physiotherapyDetails.perceivedEffort]?.bg || 'bg-[#EEF2F5]'
                              }`}
                            >
                              {EFFORT_LABELS[e.physiotherapyDetails.perceivedEffort]?.label || e.physiotherapyDetails.perceivedEffort}
                            </span>
                          </div>
                        </div>

                        {/* Sensação Sentida */}
                        <div className="flex items-center gap-1.5 text-xs text-[#53606B] bg-[#E2F0FD]/30 px-2.5 py-1.5 rounded-xl border border-[#DCE3E8]/60">
                          <span className="font-bold text-[#103557]">Sensação:</span>
                          <span>
                            {SENSATION_LABELS[e.physiotherapyDetails.sensationType] ||
                              e.physiotherapyDetails.sensationType}
                          </span>
                        </div>

                        {/* Comentários clínicos do detalhamento */}
                        {e.physiotherapyDetails.comments && (
                          <div className="text-xs text-[#53606B] bg-[#F6F8FA] px-2.5 py-1.5 rounded-xl border border-[#DCE3E8]/60">
                            <span className="font-bold text-[#103557] mr-1">Comentários:</span>
                            <span className="italic">"{e.physiotherapyDetails.comments}"</span>
                          </div>
                        )}
                      </div>
                    )}

                    {e.notes && (
                      <p className="text-xs text-[#53606B] bg-[#F6F8FA] p-2.5 rounded-xl border border-[#DCE3E8]/60 mt-2.5 italic">
                        "{e.notes}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>
      )}

      {/* Modal Adicionar Sono */}
      {isSleepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3">
            <div className="bg-[#103557] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Registrar Noite de Sono</h3>
              <button onClick={() => setIsSleepModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSleep} className="p-5 space-y-3.5">
              {/* Data da Noite */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Data da Noite de Sono</label>
                <input
                  type="date"
                  value={sleepDate}
                  onChange={(e) => setSleepDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white font-medium text-[#103557]"
                  required
                />
                <p className="text-[10px] text-[#73777F] mt-1">Exibição no histórico: dd/mm/aa</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Horas dormidas</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Qualidade do Descanso (1 a 5 estrelas)
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        quality === q
                          ? 'bg-[#103557] text-white border-[#103557]'
                          : 'bg-[#F6F8FA] border-[#DCE3E8] text-[#53606B]'
                      }`}
                    >
                      ★ {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Quantas vezes acordou na madrugada?
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={wakeUps}
                  onChange={(e) => setWakeUps(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Observações do Sono</label>
                <input
                  type="text"
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  placeholder="Ex: Acordei com dor na cervical por volta das 3h"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSleepModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#103557] text-white rounded-full"
                >
                  Salvar Sono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Exercício */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3">
            <div className="bg-[#103557] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Registrar Atividade Física</h3>
              <button onClick={() => setIsExerciseModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveExercise} className="p-5 space-y-3.5">
              {/* Data e Horário */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Data e Horário Realizado</label>
                <input
                  type="datetime-local"
                  value={exerciseDateTime}
                  onChange={(e) => setExerciseDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white font-medium text-[#103557]"
                  required
                />
                <p className="text-[10px] text-[#73777F] mt-1">Exibição no formato: dd/mm/aa hh:mm</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Tipo de Atividade</label>
                <select
                  value={activityType}
                  onChange={(e) => handleActivityTypeChange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white"
                >
                  <option value="alongamento">Alongamento / Mobilidade</option>
                  <option value="fisioterapia">Fisioterapia / Reabilitação</option>
                  <option value="caminhada">Caminhada Leve</option>
                  <option value="yoga">Yoga Suave / Respiração</option>
                  <option value="pilates">Pilates Terapêutico</option>
                  <option value="hidroginastica">Hidroginástica</option>
                  <option value="musculacao">Musculação Terapêutica</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Callout quando a opção for Fisioterapia / Reabilitação */}
              {activityType === 'fisioterapia' && (
                <div className="p-3.5 rounded-2xl bg-[#E2F0FD]/60 border border-[#2B4C6F]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#103557]" />
                      <span className="text-xs font-bold text-[#103557]">
                        Detalhamento Clínico da Fisioterapia
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPhysioModalOpen(true)}
                      className="px-3 py-1 bg-[#103557] hover:bg-[#2B4C6F] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      {physioDetails ? 'Editar Detalhes' : 'Preencher Detalhes'}
                    </button>
                  </div>

                  {physioDetails ? (
                    <div className="text-[11px] text-[#53606B] space-y-1 bg-white p-2.5 rounded-xl border border-[#DCE3E8]/80">
                      <div className="flex items-center gap-1.5 font-semibold text-[#103557]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                        <span>
                          {physioDetails.upperLimbExercises.length} exercício(s) (ULNT) •{' '}
                          {physioDetails.laterality === 'direito'
                            ? 'Membro Direito'
                            : physioDetails.laterality === 'esquerdo'
                            ? 'Membro Esquerdo'
                            : 'Bilateral'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#73777F]">
                        {physioDetails.sets}x{physioDetails.repetitions} ({physioDetails.holdTimeSeconds}s sust.) • Dor EVA Durante: {physioDetails.painDuring} | Pós: {physioDetails.painAfter}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#53606B] leading-relaxed">
                      Clique no botão acima para abrir a nova janela de detalhamento com seleção de até 4 exercícios (ULNT), lateralidade, dosagem, EVA e percepção de esforço.
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Intensidade</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white"
                  >
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="intensa">Intensa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Impacto na Dor</label>
                <select
                  value={painImpact}
                  onChange={(e) => setPainImpact(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white font-semibold text-[#103557]"
                >
                  <option value="aliviou">Aliviou a dor / Sensação de relaxamento</option>
                  <option value="neutro">Neutro / Sem alteração na dor</option>
                  <option value="aumentou_dor">Aumentou a dor / Causou desconforto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Observações / Exercícios específicos</label>
                <input
                  type="text"
                  value={exerciseNotes}
                  onChange={(e) => setExerciseNotes(e.target.value)}
                  placeholder="Ex: Exercícios na bola suíça com foco lombar"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#103557] text-white rounded-full"
                >
                  Salvar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Atividade */}
      {exerciseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 animate-in zoom-in-95 duration-150">
            <div className="bg-[#BA1A1A] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold">Remover Atividade</h3>
              </div>
              <button
                type="button"
                onClick={() => setExerciseToDelete(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-[#53606B] leading-relaxed">
                Tem certeza que deseja remover este registro de atividade realizada?
              </p>
              <div className="bg-[#F6F8FA] p-3 rounded-2xl border border-[#DCE3E8]/70 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold text-[#103557]">
                  <span className="capitalize">{exerciseToDelete.activityType.replace('_', ' ')}</span>
                  <span className="tabular-nums">{exerciseToDelete.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#53606B]">
                  <Clock className="w-3.5 h-3.5 text-[#2B4C6F]" />
                  <span>{formatExerciseDateTime(exerciseToDelete.date)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExerciseToDelete(null)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B] hover:text-[#103557] rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-bold bg-[#BA1A1A] hover:bg-[#93000A] text-white rounded-full shadow-xs active:scale-95 transition-all"
                >
                  Sim, Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Sono */}
      {sleepToDelete && (
        <div className="fixed inset-0 z-50 bg-[#103557]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full border border-[#DCE3E8] shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#BA1A1A]">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-[#103557]">Excluir Registro de Sono</h4>
              </div>
              <button
                type="button"
                id="btn-close-delete-sleep-modal"
                onClick={() => setSleepToDelete(null)}
                className="p-1 rounded-full text-[#73777F] hover:bg-[#EEF2F5]"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#53606B] leading-relaxed">
              Tem certeza que deseja excluir este registro de noite de sono?
            </p>

            <div className="bg-[#F6F8FA] p-3 rounded-2xl border border-[#DCE3E8]/70 text-xs space-y-1.5">
              <div className="flex justify-between items-center font-bold text-[#103557]">
                <span>{formatSleepDate(sleepToDelete.date)}</span>
                <span className="tabular-nums">
                  {sleepToDelete.durationHours}h {sleepToDelete.durationMinutes > 0 ? `${sleepToDelete.durationMinutes}min` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#53606B]">
                <span>Qualidade: {sleepToDelete.qualityRating}/5 estrelas</span>
                <span>Despertares: {sleepToDelete.wakeUpsCount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-delete-sleep"
                onClick={() => setSleepToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-[#53606B] hover:text-[#103557] rounded-full transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-delete-sleep"
                onClick={handleConfirmDeleteSleep}
                className="px-4 py-2 text-xs font-bold bg-[#BA1A1A] hover:bg-[#93000A] text-white rounded-full shadow-xs active:scale-95 transition-all"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Janela de Detalhamento da Fisioterapia / Reabilitação (Neurodinâmica ULNT) para atividade avulsa */}
      <PhysiotherapyDetailsModal
        isOpen={isPhysioModalOpen}
        onClose={() => setIsPhysioModalOpen(false)}
        initialData={physioDetails}
        onSave={(details) => {
          setPhysioDetails(details);
          dispatch(
            showToast({
              message: 'Detalhamento de Fisioterapia salvo para este registro!'
            })
          );
        }}
      />

      {/* Janela de Detalhamento da Fisioterapia para Prescrição */}
      <PhysiotherapyDetailsModal
        isOpen={isRxDetailsModalOpen}
        onClose={() => setIsRxDetailsModalOpen(false)}
        initialData={rxPhysioDetails}
        onSave={(details) => {
          setRxPhysioDetails(details);
          dispatch(
            showToast({
              message: 'Protocolo neurodinâmico anexado à prescrição!'
            })
          );
        }}
      />

      {/* Modal de Cadastro de Nova Prescrição de Fisioterapia */}
      {isRxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-[#103557] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#88C6B0]" />
                <h3 className="text-sm font-bold">Nova Prescrição de Fisioterapia</h3>
              </div>
              <button
                type="button"
                id="btn-close-rx-modal"
                onClick={() => setIsRxModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="p-5 space-y-4 overflow-y-auto">
              {/* Título do Protocolo */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Nome do Protocolo / Atividade Prescrita *
                </label>
                <input
                  id="input-rx-title"
                  type="text"
                  required
                  value={rxTitle}
                  onChange={(e) => setRxTitle(e.target.value)}
                  placeholder="Ex: Neurodinâmica ULNT, Fortalecimento Cervical..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white text-[#103557] focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              {/* Fisioterapeuta / Prescritor */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Fisioterapeuta ou Especialista Prescritor
                </label>
                <input
                  id="input-rx-prescriber"
                  type="text"
                  value={rxPrescribedBy}
                  onChange={(e) => setRxPrescribedBy(e.target.value)}
                  placeholder="Ex: Dra. Patrícia Lima (Fisioterapeuta)"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white text-[#103557] focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              {/* Tipo de Tratamento (Mesma regra do Medicamento: Temporário vs Contínuo) */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1.5">
                  Regime do Tratamento / Indicação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="btn-rx-is-chronic-false"
                    onClick={() => setRxIsChronic(false)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      !rxIsChronic
                        ? 'bg-[#E2F0FD] border-[#2B4C6F] text-[#103557]'
                        : 'bg-[#F6F8FA] border-[#DCE3E8] text-[#53606B] hover:bg-white'
                    }`}
                  >
                    <span className="block font-extrabold text-[11px]">Tratamento Temporário</span>
                    <span className="text-[10px] font-normal opacity-85 block">Período e execuções diárias</span>
                  </button>

                  <button
                    type="button"
                    id="btn-rx-is-chronic-true"
                    onClick={() => setRxIsChronic(true)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      rxIsChronic
                        ? 'bg-[#E2F0FD] border-[#2B4C6F] text-[#103557]'
                        : 'bg-[#F6F8FA] border-[#DCE3E8] text-[#53606B] hover:bg-white'
                    }`}
                  >
                    <span className="block font-extrabold text-[11px]">Protocolo Contínuo</span>
                    <span className="text-[10px] font-normal opacity-85 block">Manutenção sem prazo final</span>
                  </button>
                </div>
              </div>

              {/* Campos para Tratamento Temporário: Execuções diárias e Período de dias */}
              {!rxIsChronic && (
                <div className="p-3.5 bg-[#FFF0D4]/40 rounded-2xl border border-[#E8D1A7] space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#8C5800] mb-1">
                        Execuções Diárias *
                      </label>
                      <input
                        id="input-rx-times-per-day"
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={rxTimesPerDay}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRxTimesPerDay(val);
                          if (val === 1) setRxScheduledTimesStr('09:00');
                          else if (val === 2) setRxScheduledTimesStr('09:00, 16:00');
                          else if (val === 3) setRxScheduledTimesStr('08:00, 14:00, 20:00');
                          else if (val === 4) setRxScheduledTimesStr('08:00, 12:00, 16:00, 20:00');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] text-xs bg-white text-[#103557] font-semibold"
                      />
                      <span className="text-[10px] text-[#8C5800]/80 mt-0.5 block">Sessões por dia</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#8C5800] mb-1">
                        Período Indicado (Dias) *
                      </label>
                      <input
                        id="input-rx-duration-days"
                        type="number"
                        min={1}
                        max={365}
                        required
                        value={rxDurationDays}
                        onChange={(e) => setRxDurationDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] text-xs bg-white text-[#103557] font-semibold"
                      />
                      <span className="text-[10px] text-[#8C5800]/80 mt-0.5 block">Ex: 7, 14, 21 dias</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8C5800] mb-1">
                      Data de Início do Tratamento
                    </label>
                    <input
                      id="input-rx-start-date"
                      type="date"
                      value={rxStartDate}
                      onChange={(e) => setRxStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] text-xs bg-white text-[#103557] font-medium"
                    />
                  </div>

                  {rxDurationDays > 0 && rxStartDate && (
                    <div className="text-[11px] text-[#8C5800] bg-white/70 p-2 rounded-xl border border-[#E8D1A7]/60 leading-relaxed">
                      <strong>Resumo do Período:</strong> Duração de <strong>{rxDurationDays} dias</strong>. Término previsto em{' '}
                      <strong>{calculateEndDateStr(rxStartDate, rxDurationDays)}</strong> (total de{' '}
                      <strong>{rxDurationDays * (rxTimesPerDay || 1)} sessões</strong> no tratamento).
                    </div>
                  )}
                </div>
              )}

              {/* Horários Programados */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Horários Programados (separados por vírgula)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#73777F] absolute left-3 top-2.5" />
                  <input
                    id="input-rx-scheduled-times"
                    type="text"
                    value={rxScheduledTimesStr}
                    onChange={(e) => setRxScheduledTimesStr(e.target.value)}
                    placeholder="Ex: 09:00, 16:00"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white text-[#103557] focus:outline-hidden focus:border-[#2B4C6F]"
                  />
                </div>
                <span className="text-[10px] text-[#53606B] mt-1 block">
                  Estes horários geram as sessões diárias rastreáveis no painel de adesão.
                </span>
              </div>

              {/* Orientações / Instruções */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Orientações Clínicas & Recomendações
                </label>
                <textarea
                  id="input-rx-instructions"
                  rows={2}
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  placeholder="Ex: Realizar 3 séries de 10 reps. Em caso de pontada aguda, reduzir amplitude."
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white text-[#103557] focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              {/* Detalhes de Neurodinâmica ULNT Opcionais */}
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#103557]">Detalhamento Neurodinâmico (ULNT)</span>
                  <button
                    type="button"
                    onClick={() => setIsRxDetailsModalOpen(true)}
                    className="text-[11px] font-bold text-[#2B4C6F] hover:underline flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{rxPhysioDetails ? 'Editar Detalhes ULNT' : 'Configurar Detalhes ULNT'}</span>
                  </button>
                </div>
                {rxPhysioDetails ? (
                  <div className="mt-1.5 p-2 bg-[#E2F0FD]/40 rounded-xl border border-[#DCE3E8] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-[#103557]">Exercícios:</span>
                      {rxPhysioDetails.upperLimbExercises?.map((k) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-white text-[10px] font-bold border border-[#DCE3E8]">
                          {UPPER_LIMB_LABELS[k]?.code || k}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#53606B]">
                      {rxPhysioDetails.sets} séries x {rxPhysioDetails.repetitions} reps ({rxPhysioDetails.holdTimeSeconds}s sustentação)
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#73777F] mt-0.5">
                    Opcional: configure testes do nervo mediano, radial ou ulnar (ULNT 1, 2a, 2b, 3) e dosagem técnica.
                  </p>
                )}
              </div>

              {/* Botões do Formulário */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE3E8]">
                <button
                  type="button"
                  id="btn-cancel-rx"
                  onClick={() => setIsRxModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B] hover:text-[#103557] rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-submit-rx"
                  className="px-5 py-2 text-xs font-bold bg-[#103557] hover:bg-[#2B4C6F] text-white rounded-full shadow-xs active:scale-95 transition-all"
                >
                  Cadastrar Prescrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão de Prescrição de Fisioterapia */}
      {rxToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 animate-in zoom-in-95 duration-150">
            <div className="bg-[#BA1A1A] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold">Excluir Prescrição</h3>
              </div>
              <button
                type="button"
                onClick={() => setRxToDelete(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-[#53606B] leading-relaxed">
                Tem certeza que deseja excluir esta prescrição de fisioterapia? As sessões programadas para hoje também serão removidas.
              </p>
              <div className="bg-[#F6F8FA] p-3 rounded-2xl border border-[#DCE3E8]/70 text-xs space-y-1.5">
                <div className="font-bold text-[#103557]">{rxToDelete.title}</div>
                <div className="text-[11px] text-[#53606B]">
                  {rxToDelete.isChronic === false
                    ? `${rxToDelete.timesPerDay || rxToDelete.scheduledTimes.length} execuções/dia • ${rxToDelete.durationDays} dias`
                    : 'Regime Contínuo'}
                </div>
                {rxToDelete.prescribedBy && (
                  <div className="text-[10px] text-[#73777F]">Prescrito por: {rxToDelete.prescribedBy}</div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="btn-cancel-delete-rx"
                  onClick={() => setRxToDelete(null)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B] hover:text-[#103557] rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  id="btn-confirm-delete-rx"
                  onClick={handleConfirmDeletePrescription}
                  className="px-4 py-2 text-xs font-bold bg-[#BA1A1A] hover:bg-[#93000A] text-white rounded-full shadow-xs active:scale-95 transition-all"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
