import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuickIntakeModalOpen, setAddMedicationOpen, showToast } from '../../store/slices/uiSlice';
import { toggleIntakeStatus } from '../../store/slices/medicationSlice';
import { MedicationService } from '../../services/medicationService';
import { Pill, CheckCircle2, Clock, X, Plus, AlertCircle } from 'lucide-react';

export const QuickMedicationIntakeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQuickIntakeModalOpen);
  const user = useAppSelector((state) => state.auth.user);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const medications = useAppSelector((state) => state.medications.medications);

  if (!isOpen) return null;

  const handleToggle = async (intakeId: string, medName: string, currentStatus: 'taken' | 'skipped' | 'pending') => {
    dispatch(toggleIntakeStatus({ id: intakeId }));
    await MedicationService.toggleIntake(user?.uid || 'melhora-user-7841', intakeId, currentStatus);
    if (currentStatus === 'taken') {
      dispatch(showToast({ message: `Dose de ${medName} desmarcada.` }));
    } else {
      dispatch(showToast({ message: `Dose de ${medName} registrada com sucesso!` }));
    }
  };

  const takenCount = todayIntakes.filter((i) => i.status === 'taken').length;
  const totalCount = todayIntakes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#103557] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Pill className="w-4 h-4 text-[#88C6B0]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Medicamentos de Hoje</h2>
              <p className="text-xs text-[#E2F0FD]/80">Administração de doses prescritas para o dia</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setQuickIntakeModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Adherence Progress Bar */}
        <div className="bg-[#F6F8FA] px-5 py-3 border-b border-[#DCE3E8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2B4C6F]" />
            <span className="text-xs font-bold text-[#103557]">
              {takenCount} de {totalCount} doses administradas
            </span>
          </div>
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
              takenCount === totalCount && totalCount > 0
                ? 'bg-[#AFF0D8] text-[#003B2E]'
                : 'bg-[#E2F0FD] text-[#103557]'
            }`}
          >
            {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
          </span>
        </div>

        {/* Intakes List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {todayIntakes.length === 0 ? (
            <div className="text-center py-8 text-[#53606B]">
              <AlertCircle className="w-10 h-10 text-[#73777F] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Nenhum medicamento programado para hoje.</p>
              <button
                type="button"
                onClick={() => {
                  dispatch(setQuickIntakeModalOpen(false));
                  dispatch(setAddMedicationOpen(true));
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#103557] text-white rounded-xl text-xs font-bold hover:bg-[#2B4C6F] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Medicamento</span>
              </button>
            </div>
          ) : (
            todayIntakes.map((intake) => {
              const med = medications.find((m) => m.id === intake.medicationId);
              const isTaken = intake.status === 'taken';

              return (
                <div
                  key={intake.id}
                  onClick={() => handleToggle(intake.id, intake.medicationName, intake.status)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isTaken
                      ? 'bg-[#F0FDF4] border-[#88C6B0]'
                      : 'bg-white border-[#DCE3E8] hover:border-[#103557] hover:bg-[#F6F8FA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isTaken
                          ? 'bg-[#00875A] text-white'
                          : 'border-2 border-[#73777F] text-transparent hover:border-[#103557]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isTaken ? 'line-through text-[#53606B]' : 'text-[#103557]'
                          }`}
                        >
                          {intake.medicationName}
                        </span>
                        <span className="text-[11px] text-[#73777F]">({intake.dosage})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#53606B]">
                        <span className="font-semibold text-[#2B4C6F]">Horário: {intake.scheduledTime}</span>
                        {med?.instructions && <span>• {med.instructions}</span>}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                      isTaken ? 'bg-[#AFF0D8] text-[#003B2E]' : 'bg-[#EEF2F5] text-[#53606B]'
                    }`}
                  >
                    {isTaken ? 'Administrado' : 'Pendente'}
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
              dispatch(setQuickIntakeModalOpen(false));
              dispatch(setAddMedicationOpen(true));
            }}
            className="flex items-center gap-1 text-xs font-bold text-[#2B4C6F] hover:text-[#103557]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Medicamento</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch(setQuickIntakeModalOpen(false))}
            className="px-4 py-2 text-xs font-bold bg-[#103557] text-white rounded-xl hover:bg-[#2B4C6F]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
