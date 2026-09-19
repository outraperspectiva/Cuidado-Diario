import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuickPhysioModalOpen, setActiveTab, showToast } from '../../store/slices/uiSlice';
import { togglePhysioExecutionStatus } from '../../store/slices/exerciseSlice';
import { PhysiotherapyService } from '../../services/activityService';
import { PhysiotherapyExecution } from '../../types';
import { Activity, CheckCircle2, Clock, X, ChevronRight, AlertCircle, Dumbbell } from 'lucide-react';

export const QuickPhysioActivitiesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQuickPhysioModalOpen);
  const user = useAppSelector((state) => state.auth.user);
  const todayExecutions = useAppSelector((state) => state.exercise.todayExecutions || []);
  const prescriptions = useAppSelector((state) => state.exercise.prescriptions || []);

  if (!isOpen) return null;

  const handleToggle = async (exec: PhysiotherapyExecution) => {
    const isCurrentlyCompleted = exec.status === 'completed';
    dispatch(togglePhysioExecutionStatus({ id: exec.id }));
    await PhysiotherapyService.toggleExecution(user?.uid || 'melhora-user-7841', exec.id);

    if (isCurrentlyCompleted) {
      dispatch(showToast({ message: `Sessão de "${exec.prescriptionTitle}" desmarcada.` }));
    } else {
      dispatch(showToast({ message: `Sessão de "${exec.prescriptionTitle}" registrada com sucesso!` }));
    }
  };

  const completedCount = todayExecutions.filter((e) => e.status === 'completed').length;
  const totalCount = todayExecutions.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#103557] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#88C6B0]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Atividades de Fisioterapia</h2>
              <p className="text-xs text-[#E2F0FD]/80">Adesão aos exercícios e protocolos prescritos para o dia</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setQuickPhysioModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Adherence Progress Bar */}
        <div className="bg-[#F6F8FA] px-5 py-3 border-b border-[#DCE3E8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00875A]" />
            <span className="text-xs font-bold text-[#103557]">
              {completedCount} de {totalCount} atividades concluídas
            </span>
          </div>
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
              completedCount === totalCount && totalCount > 0
                ? 'bg-[#AFF0D8] text-[#003B2E]'
                : 'bg-[#E2F0FD] text-[#103557]'
            }`}
          >
            {percentage}%
          </span>
        </div>

        {/* Activities List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {todayExecutions.length === 0 ? (
            <div className="text-center py-8 text-[#53606B]">
              <AlertCircle className="w-10 h-10 text-[#73777F] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Nenhuma atividade de fisioterapia programada para hoje.</p>
              <button
                type="button"
                onClick={() => {
                  dispatch(setQuickPhysioModalOpen(false));
                  dispatch(setActiveTab('atividades'));
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#103557] text-white rounded-xl text-xs font-bold hover:bg-[#2B4C6F] transition-all"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Ver Protocolos de Atividades</span>
              </button>
            </div>
          ) : (
            todayExecutions.map((exec) => {
              const rx = prescriptions.find((p) => p.id === exec.prescriptionId);
              const isCompleted = exec.status === 'completed';

              return (
                <div
                  key={exec.id}
                  onClick={() => handleToggle(exec)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-[#F0FDF4] border-[#88C6B0]'
                      : 'bg-white border-[#DCE3E8] hover:border-[#103557] hover:bg-[#F6F8FA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#00875A] text-white'
                          : 'border-2 border-[#73777F] text-transparent hover:border-[#103557]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-[#53606B]' : 'text-[#103557]'
                          }`}
                        >
                          {exec.prescriptionTitle}
                        </span>
                        <span className="text-[10px] font-semibold text-[#2B4C6F] bg-[#E2F0FD] px-1.5 py-0.5 rounded-md">
                          Sessão {exec.sessionNumber} de {exec.totalSessions}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#53606B] flex-wrap">
                        <span className="font-semibold text-[#00875A]">Horário: {exec.scheduledTime}</span>
                        {rx?.physiotherapyDetails?.sets && rx?.physiotherapyDetails?.repetitions && (
                          <span>
                            • {rx.physiotherapyDetails.sets} séries × {rx.physiotherapyDetails.repetitions} reps
                          </span>
                        )}
                        {rx?.physiotherapyDetails?.holdTimeSeconds && (
                          <span>• {rx.physiotherapyDetails.holdTimeSeconds}s sust.</span>
                        )}
                      </div>

                      {rx?.instructions && (
                        <p className="text-[10px] text-[#73777F] line-clamp-1 mt-0.5 italic">
                          {rx.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                      isCompleted ? 'bg-[#AFF0D8] text-[#003B2E]' : 'bg-[#EEF2F5] text-[#53606B]'
                    }`}
                  >
                    {isCompleted ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F6F8FA] border-t border-[#DCE3E8] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              dispatch(setQuickPhysioModalOpen(false));
              dispatch(setActiveTab('atividades'));
            }}
            className="flex items-center gap-1 text-xs font-bold text-[#2B4C6F] hover:text-[#103557]"
          >
            <span>Ver protocolos na íntegra</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => dispatch(setQuickPhysioModalOpen(false))}
            className="px-4 py-2 text-xs font-bold bg-[#103557] text-white rounded-xl hover:bg-[#2B4C6F]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
