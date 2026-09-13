import React, { useState } from 'react';
import {
  X,
  Check,
  Activity,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  PhysiotherapyDetails,
  PhysiotherapyUpperLimbExercise,
  PhysiotherapyLaterality,
  PhysiotherapySensation,
  PhysiotherapyPerceivedEffort
} from '../../types';

interface PhysiotherapyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PhysiotherapyDetails;
  onSave: (details: PhysiotherapyDetails) => void;
}

const UPPER_LIMB_OPTIONS: {
  id: PhysiotherapyUpperLimbExercise;
  code: string;
  nerve: string;
  tagColor: string;
  description: string;
}[] = [
  {
    id: 'ulnt_1',
    code: 'ULNT 1',
    nerve: 'Nervo Mediano',
    tagColor: 'bg-[#E2F0FD] text-[#103557]',
    description: 'Depressão escapular, abdução (110°), extensão de punho e dedos, supinação.'
  },
  {
    id: 'ulnt_2a',
    code: 'ULNT 2a',
    nerve: 'Nervo Mediano',
    tagColor: 'bg-[#E2F0FD] text-[#103557]',
    description: 'Isolamento com depressão escapular específica e rotação lateral reduzida.'
  },
  {
    id: 'ulnt_2b',
    code: 'ULNT 2b',
    nerve: 'Nervo Radial',
    tagColor: 'bg-[#FFF0D4] text-[#8C5800]',
    description: 'Depressão de ombro, rotação interna, pronação e flexão de punho/polegar.'
  },
  {
    id: 'ulnt_3',
    code: 'ULNT 3',
    nerve: 'Nervo Ulnar',
    tagColor: 'bg-[#AFF0D8] text-[#003B2E]',
    description: 'Flexão acentuada de cotovelo ("mão no ouvido"), pronação e extensão do punho.'
  }
];

const SENSATION_OPTIONS: {
  id: PhysiotherapySensation;
  label: string;
  description: string;
}[] = [
  {
    id: 'formigamento_parestesia',
    label: 'Formigamento / Parestesia',
    description: 'Sensação de dormência ou agulhadas no membro'
  },
  {
    id: 'pontada_fisgada',
    label: 'Pontada / Fisgada',
    description: 'Fisgada aguda ou pontada momentânea'
  },
  {
    id: 'tensao_muscular_suave',
    label: 'Tensão Muscular Suave',
    description: 'Alongamento tolerável e sem disparo neural'
  },
  {
    id: 'queimacao_trajeto',
    label: 'Queimação no Trajeto',
    description: 'Sensação térmica ou ardor ao longo do nervo'
  },
  {
    id: 'alivio_imediato',
    label: 'Alívio Imediato',
    description: 'Sensação de descompressão e conforto imediato'
  }
];

const EFFORT_OPTIONS: {
  id: PhysiotherapyPerceivedEffort;
  label: string;
  hint: string;
  color: string;
}[] = [
  {
    id: 'muito_facil',
    label: 'Muito Fácil',
    hint: 'Execução suave, sem esforço perceptível',
    color: 'border-[#AFF0D8] bg-[#AFF0D8]/20 text-[#003B2E]'
  },
  {
    id: 'moderado',
    label: 'Moderado',
    hint: 'Exige atenção e controle do movimento',
    color: 'border-[#E2F0FD] bg-[#E2F0FD]/40 text-[#103557]'
  },
  {
    id: 'dificil',
    label: 'Difícil',
    hint: 'Esforço considerável para manter postura',
    color: 'border-[#FFF0D4] bg-[#FFF0D4]/40 text-[#8C5800]'
  },
  {
    id: 'no_limite',
    label: 'No Limite',
    hint: 'Próximo à fadiga ou limite tolerável',
    color: 'border-[#FFDAD6] bg-[#FFDAD6]/40 text-[#93000A]'
  }
];

export const PhysiotherapyDetailsModal: React.FC<PhysiotherapyDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave
}) => {
  if (!isOpen) return null;

  const [selectedExercises, setSelectedExercises] = useState<PhysiotherapyUpperLimbExercise[]>(
    initialData?.upperLimbExercises && initialData.upperLimbExercises.length > 0
      ? initialData.upperLimbExercises
      : ['ulnt_1']
  );
  const [laterality, setLaterality] = useState<PhysiotherapyLaterality>(
    initialData?.laterality || 'bilateral'
  );
  const [sets, setSets] = useState<number>(initialData?.sets ?? 3);
  const [repetitions, setRepetitions] = useState<number>(initialData?.repetitions ?? 10);
  const [holdTimeSeconds, setHoldTimeSeconds] = useState<number>(initialData?.holdTimeSeconds ?? 10);
  const [painDuring, setPainDuring] = useState<number>(initialData?.painDuring ?? 2);
  const [painAfter, setPainAfter] = useState<number>(initialData?.painAfter ?? 1);
  const [sensationType, setSensationType] = useState<PhysiotherapySensation>(
    initialData?.sensationType || 'tensao_muscular_suave'
  );
  const [perceivedEffort, setPerceivedEffort] = useState<PhysiotherapyPerceivedEffort>(
    initialData?.perceivedEffort || 'moderado'
  );
  const [comments, setComments] = useState<string>(initialData?.comments || '');

  const toggleExercise = (id: PhysiotherapyUpperLimbExercise) => {
    if (selectedExercises.includes(id)) {
      if (selectedExercises.length === 1) return; // manter ao menos 1
      setSelectedExercises(selectedExercises.filter((e) => e !== id));
    } else {
      if (selectedExercises.length < 4) {
        setSelectedExercises([...selectedExercises, id]);
      }
    }
  };

  const getEvaColor = (val: number) => {
    if (val === 0) return 'text-[#00875A]';
    if (val <= 3) return 'text-[#2B7A78]';
    if (val <= 6) return 'text-[#D99B4E]';
    if (val <= 8) return 'text-[#D9534F]';
    return 'text-[#BA1A1A]';
  };

  const getEvaBg = (val: number) => {
    if (val === 0) return 'bg-[#AFF0D8] text-[#003B2E]';
    if (val <= 3) return 'bg-[#E2F0FD] text-[#103557]';
    if (val <= 6) return 'bg-[#FFF0D4] text-[#8C5800]';
    if (val <= 8) return 'bg-[#FFDAD6] text-[#93000A]';
    return 'bg-[#BA1A1A] text-white';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      upperLimbExercises: selectedExercises,
      laterality,
      sets: Number(sets),
      repetitions: Number(repetitions),
      holdTimeSeconds: Number(holdTimeSeconds),
      painDuring: Number(painDuring),
      painAfter: Number(painAfter),
      sensationType,
      perceivedEffort,
      comments: comments.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-4 my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#103557] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#AFF0D8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">
                Detalhamento da Fisioterapia / Reabilitação
              </h3>
              <p className="text-[11px] text-white/75">
                Membros Superiores & Testes Neurodinâmicos (ULNT)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* 1. Selecionar Exercício - Membros Superiores (até 4) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#103557] flex items-center gap-1.5">
                <span>1. Selecionar Exercício — Membros Superiores</span>
                <span className="text-[10px] font-semibold text-[#53606B] bg-[#EEF2F5] px-2 py-0.5 rounded-full">
                  Até 4 opções simultâneas ({selectedExercises.length}/4)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {UPPER_LIMB_OPTIONS.map((item) => {
                const isSelected = selectedExercises.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleExercise(item.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#2B4C6F] bg-[#E2F0FD]/30 shadow-xs'
                        : 'border-[#DCE3E8] bg-white hover:border-[#B3C8DB]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#103557] border-[#103557] text-white'
                          : 'border-[#A3ADB6] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-extrabold text-[#103557]">
                          {item.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${item.tagColor}`}
                        >
                          {item.nerve}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#53606B] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Lateralidade da Execução */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#103557]">
              2. Membro Executado / Lateralidade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'bilateral', label: 'Bilateral' },
                  { id: 'direito', label: 'Membro Direito' },
                  { id: 'esquerdo', label: 'Membro Esquerdo' }
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLaterality(opt.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    laterality === opt.id
                      ? 'bg-[#103557] text-white border-[#103557] shadow-xs'
                      : 'bg-white text-[#53606B] border-[#DCE3E8] hover:border-[#2B4C6F]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Séries, Repetições e Tempo de Sustentação */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#103557]">
              3. Dosagem (Séries, Repetições e Sustentação)
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#F6F8FA] p-3 rounded-2xl border border-[#DCE3E8]">
              <div>
                <label className="block text-[10px] font-bold text-[#53606B] uppercase tracking-wider mb-1">
                  Séries
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#DCE3E8] text-xs font-bold text-[#103557] bg-white text-center"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#53606B] uppercase tracking-wider mb-1">
                  Repetições
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={repetitions}
                  onChange={(e) => setRepetitions(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#DCE3E8] text-xs font-bold text-[#103557] bg-white text-center"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#53606B] uppercase tracking-wider mb-1">
                  Sustentação (seg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="5"
                  value={holdTimeSeconds}
                  onChange={(e) => setHoldTimeSeconds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#DCE3E8] text-xs font-bold text-[#103557] bg-white text-center"
                />
              </div>
            </div>
          </div>

          {/* 4. Dor Durante e Pós-Movimento (EVA) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#103557] flex items-center justify-between">
              <span>4. Avaliação Imediata da Dor — Escala Visual Analógica (EVA)</span>
              <span className="text-[10px] text-[#53606B] font-normal">Escala de 0 a 10</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dor Durante */}
              <div className="p-3 rounded-2xl border border-[#DCE3E8] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#103557]">Dor Durante o Movimento</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${getEvaBg(painDuring)}`}>
                    EVA {painDuring}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painDuring}
                  onChange={(e) => setPainDuring(Number(e.target.value))}
                  className="w-full accent-[#2B4C6F] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#73777F] font-semibold">
                  <span>0 Sem dor</span>
                  <span>5 Moderada</span>
                  <span>10 Insuportável</span>
                </div>
              </div>

              {/* Dor Pós-Movimento */}
              <div className="p-3 rounded-2xl border border-[#DCE3E8] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#103557]">Dor Pós-Movimento</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${getEvaBg(painAfter)}`}>
                    EVA {painAfter}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painAfter}
                  onChange={(e) => setPainAfter(Number(e.target.value))}
                  className="w-full accent-[#2B4C6F] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#73777F] font-semibold">
                  <span>0 Sem dor</span>
                  <span>5 Moderada</span>
                  <span>10 Insuportável</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Tipo de Resposta / Sensação Sentida */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#103557]">
              5. Tipo de Resposta / Sensação Sentida
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SENSATION_OPTIONS.map((item) => {
                const isSelected = sensationType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSensationType(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#2B4C6F] bg-[#E2F0FD]/40 text-[#103557]'
                        : 'border-[#DCE3E8] bg-white text-[#53606B] hover:border-[#B3C8DB]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#103557] stroke-[3]" />}
                    </div>
                    <p className="text-[10px] text-[#73777F] mt-0.5">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Percepção de Esforço Subjetivo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#103557]">
              6. Percepção de Esforço Subjetivo (Facilidade para realizar o movimento)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EFFORT_OPTIONS.map((item) => {
                const isSelected = perceivedEffort === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPerceivedEffort(item.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? item.color + ' font-bold shadow-xs'
                        : 'border-[#DCE3E8] bg-white text-[#53606B] hover:border-[#B3C8DB]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[9px] text-[#73777F] mt-0.5 leading-tight">{item.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Comentários (Opcional) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#103557]">
              7. Comentários / Observações Clínicas (Opcional)
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ex: Exercício realizado com auxílio da fisioterapeuta; pequena tensão no punho ao final da série."
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3E8] text-xs bg-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE3E8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#53606B] hover:text-[#103557] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-[#103557] hover:bg-[#2B4C6F] text-white rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Concluir Detalhamento</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
