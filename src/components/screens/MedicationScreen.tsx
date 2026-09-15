import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addMedication, deleteMedication, toggleIntakeStatus } from '../../store/slices/medicationSlice';
import { showToast } from '../../store/slices/uiSlice';
import { MedicationService } from '../../services/medicationService';
import { Medication } from '../../types';
import { Pill, Plus, Check, Clock, Trash2, X, AlertCircle, Calendar } from 'lucide-react';

export const MedicationScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const medications = useAppSelector((state) => state.medications.medications);
  const todayIntakes = useAppSelector((state) => state.medications.todayIntakes);
  const user = useAppSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medToDelete, setMedToDelete] = useState<Medication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [category, setCategory] = useState<Medication['category']>('neuropatico');
  const [scheduledTimesStr, setScheduledTimesStr] = useState('08:00, 20:00');
  const [instructions, setInstructions] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');

  // Non-chronic medication fields
  const [isChronic, setIsChronic] = useState(true);
  const [dosesPerDay, setDosesPerDay] = useState<number>(2);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const takenCount = todayIntakes.filter((i) => i.status === 'taken').length;
  const adherencePercent = todayIntakes.length > 0 ? Math.round((takenCount / todayIntakes.length) * 100) : 100;

  const calculateEndDateStr = (start: string, days: number): string => {
    try {
      const date = new Date(start + 'T00:00:00');
      date.setDate(date.getDate() + days - 1);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  const handleCreateMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      dispatch(showToast({ message: 'Preencha o nome e a dosagem do medicamento.', type: 'error' }));
      return;
    }

    if (!isChronic) {
      if (!dosesPerDay || Number(dosesPerDay) < 1) {
        dispatch(showToast({ message: 'Informe o número de doses diárias para o uso não crônico.', type: 'error' }));
        return;
      }
      if (!durationDays || Number(durationDays) < 1) {
        dispatch(showToast({ message: 'Informe o período de utilização (em dias) para o uso não crônico.', type: 'error' }));
        return;
      }
    }

    const times = scheduledTimesStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let calculatedEndDate: string | undefined = undefined;
    if (!isChronic && durationDays > 0) {
      const start = new Date(startDate + 'T00:00:00');
      start.setDate(start.getDate() + Number(durationDays) - 1);
      calculatedEndDate = start.toISOString().split('T')[0];
    }

    const newMed = await MedicationService.createMedication(user?.uid || 'user-anon', {
      name: name.trim(),
      dosage: dosage.trim(),
      category,
      scheduledTimes: times.length > 0 ? times : ['08:00'],
      instructions: instructions.trim(),
      prescribedBy: prescribedBy.trim() || undefined,
      isActive: true,
      isChronic,
      dosesPerDay: isChronic ? undefined : Number(dosesPerDay),
      durationDays: isChronic ? undefined : Number(durationDays),
      startDate: isChronic ? undefined : startDate,
      endDate: isChronic ? undefined : calculatedEndDate,
    });

    dispatch(addMedication(newMed));
    dispatch(showToast({ message: `${newMed.name} cadastrado com sucesso!` }));
    setIsModalOpen(false);
    setName('');
    setDosage('');
    setInstructions('');
    setPrescribedBy('');
    setIsChronic(true);
    setDosesPerDay(2);
    setDurationDays(7);
    setScheduledTimesStr('08:00, 20:00');
  };

  const handleConfirmDelete = async () => {
    if (!medToDelete) return;
    try {
      setIsDeleting(true);
      const targetName = medToDelete.name;
      await MedicationService.deleteMedication(user?.uid || 'user-anon', medToDelete.id);
      dispatch(deleteMedication(medToDelete.id));
      dispatch(showToast({ message: `Prescrição de "${targetName}" excluída com sucesso.` }));
      setMedToDelete(null);
    } catch {
      dispatch(showToast({ message: 'Erro ao excluir medicamento.', type: 'error' }));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#103557]">Plano Farmacológico</h2>
          <p className="text-xs text-[#53606B]">Horários, posologias e controle de adesão</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#103557] hover:bg-[#2B4C6F] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Remédio</span>
        </button>
      </div>

      {/* Adherence Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE3E8] elevation-1 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#53606B]">
            Adesão do Dia
          </span>
          <div className="text-2xl font-extrabold text-[#103557] tabular-nums mt-0.5">
            {adherencePercent}%
          </div>
          <span className="text-xs text-[#53606B]">
            {takenCount} de {todayIntakes.length} doses confirmadas hoje
          </span>
        </div>
        <div className="w-14 h-14 rounded-full border-4 border-[#E2F0FD] flex items-center justify-center relative">
          <div
            className="w-14 h-14 rounded-full border-4 border-[#68A691] absolute inset-0 transition-all"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${adherencePercent}%, 0 ${adherencePercent}%)`
            }}
          />
          <Pill className="w-5 h-5 text-[#2B4C6F]" />
        </div>
      </div>

      {/* Today Intake Checklist */}
      <div>
        <h3 className="text-xs font-bold text-[#103557] uppercase tracking-wider mb-2">
          Doses Agendadas para Hoje
        </h3>
        <div className="space-y-2">
          {todayIntakes.map((intake) => {
            const isTaken = intake.status === 'taken';
            return (
              <div
                key={intake.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isTaken
                    ? 'bg-[#AFF0D8]/20 border-[#68A691]/40'
                    : 'bg-white border-[#DCE3E8] hover:border-[#2B4C6F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleIntakeStatus({ id: intake.id }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                      isTaken
                        ? 'bg-[#68A691] border-[#68A691] text-white shadow-xs'
                        : 'bg-[#F6F8FA] border-[#DCE3E8] text-transparent hover:border-[#68A691]'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isTaken ? 'line-through text-[#73777F]' : 'text-[#103557]'}`}>
                        {intake.medicationName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF2F5] text-[#2B4C6F] font-semibold">
                        {intake.dosage}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#73777F] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {intake.scheduledTime}
                      {intake.takenAt && (
                        <span className="text-[#003B2E] font-medium ml-1">
                          • Tomado às {new Date(intake.takenAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(toggleIntakeStatus({ id: intake.id }))}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                    isTaken
                      ? 'bg-[#AFF0D8] text-[#003B2E]'
                      : 'bg-[#103557] text-white shadow-xs'
                  }`}
                >
                  {isTaken ? 'Dose Tomada ✓' : 'Marcar Dose'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Medications List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-[#103557] uppercase tracking-wider">
            Prescrições Cadastradas ({medications.length})
          </h3>
          <span className="text-[11px] text-[#73777F]">
            Gerencie ou exclua medicamentos
          </span>
        </div>

        {medications.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-[#DCE3E8] text-center space-y-3 elevation-1">
            <div className="w-12 h-12 rounded-full bg-[#E2F0FD] text-[#2B4C6F] flex items-center justify-center mx-auto">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#103557]">Nenhum Medicamento Cadastrado</h4>
              <p className="text-xs text-[#53606B] mt-1 max-w-xs mx-auto">
                Cadastre os remédios do seu tratamento para acompanhar horários, posologias e adesão diária.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#103557] hover:bg-[#2B4C6F] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Medicamento</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {medications.map((med) => (
              <div key={med.id} className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 hover:border-[#B7E7F7] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#103557]">{med.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F] font-semibold">
                        {med.dosage}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F6F8FA] text-[#53606B] capitalize border border-[#DCE3E8]">
                        {med.category.replace('_', ' ')}
                      </span>
                      {med.isChronic === false ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0D4] text-[#8C5800] font-bold border border-[#E8D1A7]">
                          Uso Não Crônico • {med.dosesPerDay || med.scheduledTimes.length} doses/dia ({med.durationDays} dias)
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E2F0FD] text-[#2B4C6F] font-semibold border border-[#B3C8DB]">
                          Uso Contínuo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#53606B] mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#356572]" />
                      <span>Horários: {med.scheduledTimes.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMedToDelete(med)}
                    className="text-[#73777F] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 p-2 rounded-xl transition-colors"
                    title={`Excluir ${med.name}`}
                    aria-label={`Excluir prescrição de ${med.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-[#BA1A1A]" />
                  </button>
                </div>

                {med.instructions && (
                  <p className="text-xs text-[#53606B] bg-[#F6F8FA] p-2.5 rounded-xl border border-[#DCE3E8]/60 mt-2.5">
                    <strong>Instruções:</strong> {med.instructions}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#DCE3E8]/60 flex-wrap gap-2">
                  <div className="text-[11px] text-[#73777F] italic">
                    {med.prescribedBy ? `Prescrito por: ${med.prescribedBy}` : ''}
                    {med.isChronic === false ? (
                      <span className="text-[#8C5800] font-semibold not-italic ml-1">
                        • Tratamento temporário de {med.durationDays} dias {med.endDate ? `(término em ${new Date(med.endDate + 'T00:00:00').toLocaleDateString('pt-BR')})` : ''}
                      </span>
                    ) : (
                      <span className="ml-1">• Uso contínuo / crônico</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMedToDelete(med)}
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

      {/* Delete Prescription Confirmation Modal */}
      {medToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 flex flex-col p-5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#103557] text-center">
              Excluir Prescrição?
            </h3>
            <p className="text-xs text-[#53606B] text-center mt-2 leading-relaxed">
              Deseja remover <strong>{medToDelete.name}</strong> ({medToDelete.dosage}) da sua lista? As doses agendadas pendentes deste medicamento também serão canceladas do seu plano.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMedToDelete(null)}
                className="py-2.5 px-4 rounded-full border border-[#DCE3E8] text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-full bg-[#BA1A1A] hover:bg-[#93000A] text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Excluir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 flex flex-col">
            <div className="bg-[#103557] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#88C6B0]" />
                <h3 className="text-sm font-bold">Cadastrar Novo Medicamento</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMed} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Nome do Medicamento</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Pregabalina, Duloxetina, Paracetamol"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Dosagem</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="Ex: 75mg, 1 cp"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#103557] mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F] bg-white"
                  >
                    <option value="neuropatico">Neuropático</option>
                    <option value="analgesico">Analgésico</option>
                    <option value="antiinflamatorio">Anti-inflamatório</option>
                    <option value="relaxante_muscular">Relaxante Muscular</option>
                    <option value="suplemento">Suplemento / Mineral</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Tipo de Tratamento: Crônico vs Não Crônico */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1.5">
                  Regime de Utilização
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChronic(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      isChronic
                        ? 'bg-[#103557] text-white border-[#103557] shadow-xs'
                        : 'bg-[#F6F8FA] text-[#53606B] border-[#DCE3E8] hover:border-[#B3C8DB]'
                    }`}
                  >
                    Uso Contínuo / Crônico
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChronic(false);
                      if (dosesPerDay === 1) setScheduledTimesStr('08:00');
                      else if (dosesPerDay === 2) setScheduledTimesStr('08:00, 20:00');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      !isChronic
                        ? 'bg-[#103557] text-white border-[#103557] shadow-xs'
                        : 'bg-[#F6F8FA] text-[#53606B] border-[#DCE3E8] hover:border-[#B3C8DB]'
                    }`}
                  >
                    Uso Não Crônico / Temporário
                  </button>
                </div>
              </div>

              {/* Campos específicos quando for Uso Não Crônico */}
              {!isChronic && (
                <div className="p-3.5 rounded-2xl bg-[#FFF9E6] border border-[#E8D1A7] space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C5800]">
                    <Calendar className="w-4 h-4 text-[#8C5800]" />
                    <span>Configuração do Uso Não Crônico</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#8C5800] mb-1">
                        Número de Doses Diárias *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        required={!isChronic}
                        value={dosesPerDay}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          setDosesPerDay(val);
                          if (val === 1) setScheduledTimesStr('08:00');
                          else if (val === 2) setScheduledTimesStr('08:00, 20:00');
                          else if (val === 3) setScheduledTimesStr('08:00, 14:00, 20:00');
                          else if (val === 4) setScheduledTimesStr('08:00, 12:00, 16:00, 20:00');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] bg-white text-xs text-[#103557] font-bold focus:outline-hidden focus:border-[#8C5800]"
                        placeholder="Ex: 2"
                      />
                      <span className="text-[10px] text-[#8C5800]/80 mt-0.5 block">
                        {dosesPerDay} {dosesPerDay === 1 ? 'tomada' : 'tomadas'} por dia
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#8C5800] mb-1">
                        Período de Utilização (dias) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        required={!isChronic}
                        value={durationDays}
                        onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] bg-white text-xs text-[#103557] font-bold focus:outline-hidden focus:border-[#8C5800]"
                        placeholder="Ex: 7"
                      />
                      <span className="text-[10px] text-[#8C5800]/80 mt-0.5 block">
                        Duração de {durationDays} dias
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8C5800] mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8D1A7] bg-white text-xs text-[#103557] font-medium focus:outline-hidden focus:border-[#8C5800]"
                    />
                    <div className="flex items-center justify-between text-[10px] text-[#8C5800] font-medium mt-1">
                      <span>Início: {new Date(startDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                      <span>Término previsto: {calculateEndDateStr(startDate, durationDays)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">
                  Horários Programados (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={scheduledTimesStr}
                  onChange={(e) => setScheduledTimesStr(e.target.value)}
                  placeholder="Ex: 08:00, 20:00"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Instruções de Ingestão</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Tomar após as refeições com bastante água"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1">Médico Prescritor (Opcional)</label>
                <input
                  type="text"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  placeholder="Ex: Dra. Helena Martins (Reumatologia)"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs focus:outline-hidden focus:border-[#2B4C6F]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#103557] hover:bg-[#2B4C6F] text-white rounded-full shadow-xs active:scale-95"
                >
                  Salvar Prescrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
