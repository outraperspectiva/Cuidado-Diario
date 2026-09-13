import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAddPainLogOpen, showToast } from '../../store/slices/uiSlice';
import {
  setPainDraftLevel,
  setPainDraftType,
  toggleBodyLocation,
  toggleTrigger,
  toggleReliefAction,
  setDraftNotes,
  setDraftFlareUp,
  resetDraft,
  addPainLog
} from '../../store/slices/painSlice';
import { PainScaleSelector } from './PainScaleSelector';
import { BodyMap } from './BodyMap';
import { PainService } from '../../services/painService';
import { X, Check, Activity, AlertTriangle } from 'lucide-react';

export const AddPainLogModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAddPainLogOpen);
  const draft = useAppSelector((state) => state.pain.currentDraft);
  const user = useAppSelector((state) => state.auth.user);

  const [activeStep, setActiveStep] = useState<'escala' | 'mapa' | 'detalhes'>('escala');

  if (!isOpen) return null;

  const painTypes: { id: typeof draft.painType; label: string }[] = [
    { id: 'pulsatil', label: 'Pulsátil' },
    { id: 'em_pontada', label: 'Em Pontada' },
    { id: 'queimacao', label: 'Queimação' },
    { id: 'constante', label: 'Constante / Surda' },
    { id: 'latejante', label: 'Latejante' },
    { id: 'pressao', label: 'Sensação de Pressão' },
  ];

  const commonTriggers = [
    'Postura prolongada',
    'Estresse laboral',
    'Sono insuficiente',
    'Mudança climática / Frio',
    'Esforço físico intenso',
    'Tensão cervical',
    'Falta de hidratação',
    'Esquecimento de remédio',
  ];

  const commonReliefs = [
    'Alongamento suave',
    'Compressa morna',
    'Bolsa de gelo',
    'Repouso em silêncio',
    'Medicação de resgate',
    'Banho morno',
    'Massagem / Liberação',
    'Exercícios respiratórios',
  ];

  const handleSave = async () => {
    if (draft.bodyLocations.length === 0) {
      // Auto-set cervical if none selected
      dispatch(toggleBodyLocation('cervical'));
    }

    const newLog = await PainService.createLog(user?.uid || 'user-anon', {
      timestamp: new Date().toISOString(),
      painLevel: draft.painLevel,
      severityCategory: PainService.getSeverityCategory(draft.painLevel),
      painType: draft.painType,
      bodyLocations: draft.bodyLocations.length > 0 ? draft.bodyLocations : ['cervical'],
      triggers: draft.triggers,
      reliefActions: draft.reliefActions,
      notes: draft.notes,
      isFlareUp: draft.isFlareUp,
    });

    dispatch(addPainLog(newLog));
    dispatch(setAddPainLogOpen(false));
    dispatch(resetDraft());
    dispatch(showToast({ message: 'Registro de dor salvo com sucesso!' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#DCE3E8] elevation-3 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#103557] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#88C6B0]" />
            <h2 className="text-base font-bold">Novo Registro de Dor & Sintomas</h2>
          </div>
          <button
            onClick={() => dispatch(setAddPainLogOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-3 bg-[#F6F8FA] border-b border-[#DCE3E8] text-xs font-semibold">
          <button
            onClick={() => setActiveStep('escala')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeStep === 'escala'
                ? 'border-[#2B4C6F] text-[#2B4C6F] bg-white font-bold'
                : 'border-transparent text-[#53606B] hover:text-[#103557]'
            }`}
          >
            1. Intensidade ({draft.painLevel}/10)
          </button>
          <button
            onClick={() => setActiveStep('mapa')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeStep === 'mapa'
                ? 'border-[#2B4C6F] text-[#2B4C6F] bg-white font-bold'
                : 'border-transparent text-[#53606B] hover:text-[#103557]'
            }`}
          >
            2. Localização ({draft.bodyLocations.length})
          </button>
          <button
            onClick={() => setActiveStep('detalhes')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeStep === 'detalhes'
                ? 'border-[#2B4C6F] text-[#2B4C6F] bg-white font-bold'
                : 'border-transparent text-[#53606B] hover:text-[#103557]'
            }`}
          >
            3. Gatilhos & Notas
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeStep === 'escala' && (
            <div className="space-y-4">
              <PainScaleSelector
                value={draft.painLevel}
                onChange={(lvl) => dispatch(setPainDraftLevel(lvl))}
              />

              {/* Flare Up Checkbox */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFDAD6]/30 border border-[#D96B5B]/30 cursor-pointer hover:bg-[#FFDAD6]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={draft.isFlareUp}
                  onChange={(e) => dispatch(setDraftFlareUp(e.target.checked))}
                  className="w-4 h-4 rounded text-[#D96B5B] focus:ring-[#D96B5B]"
                />
                <div>
                  <div className="text-xs font-bold text-[#93000A] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D96B5B]" />
                    Marcar como Crise / Flare-up Agudo
                  </div>
                  <div className="text-[11px] text-[#53606B]">
                    Assinala piora repentina para análise do médico.
                  </div>
                </div>
              </label>

              {/* Pain Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-2 uppercase tracking-wider">
                  Tipo da Sensação
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {painTypes.map((pt) => {
                    const isSelected = draft.painType === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => dispatch(setPainDraftType(pt.id))}
                        className={`h-10 px-3 rounded-full text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#2B4C6F] text-white border-[#2B4C6F] shadow-xs'
                            : 'bg-[#EEF2F5] text-[#53606B] border-transparent hover:bg-[#E2F0FD] hover:text-[#103557]'
                        }`}
                      >
                        {pt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeStep === 'mapa' && (
            <BodyMap
              selectedLocations={draft.bodyLocations}
              onToggleLocation={(loc) => dispatch(toggleBodyLocation(loc))}
              painLevel={draft.painLevel}
            />
          )}

          {activeStep === 'detalhes' && (
            <div className="space-y-4">
              {/* Triggers Section */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                  Gatilhos Identificados
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonTriggers.map((trig) => {
                    const isSelected = draft.triggers.includes(trig);
                    return (
                      <button
                        key={trig}
                        type="button"
                        onClick={() => dispatch(toggleTrigger(trig))}
                        className={`h-8 px-3 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#2B4C6F] text-white font-semibold'
                            : 'bg-[#EEF2F5] text-[#53606B] hover:bg-[#E2F0FD]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {trig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Relief Actions */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                  Ações de Alívio Realizadas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonReliefs.map((relief) => {
                    const isSelected = draft.reliefActions.includes(relief);
                    return (
                      <button
                        key={relief}
                        type="button"
                        onClick={() => dispatch(toggleReliefAction(relief))}
                        className={`h-8 px-3 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#356572] text-white font-semibold'
                            : 'bg-[#EEF2F5] text-[#53606B] hover:bg-[#E2F0FD]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {relief}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
                  Observações / Contexto
                </label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => dispatch(setDraftNotes(e.target.value))}
                  placeholder="Ex: Piora após 3 horas sentada sem pausa. Sensação de rigidez pela manhã."
                  className="w-full h-24 p-3 rounded-xl border border-[#DCE3E8] text-xs text-[#101D26] placeholder-[#73777F] focus:outline-hidden focus:border-[#2B4C6F] focus:ring-2 focus:ring-[#2B4C6F]/20 transition-all resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation & Save */}
        <div className="p-4 bg-[#F6F8FA] border-t border-[#DCE3E8] flex items-center justify-between gap-3">
          {activeStep === 'escala' ? (
            <button
              type="button"
              onClick={() => setActiveStep('mapa')}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#2B4C6F] hover:bg-[#E2F0FD] transition-colors"
            >
              Avançar para Mapa →
            </button>
          ) : activeStep === 'mapa' ? (
            <button
              type="button"
              onClick={() => setActiveStep('escala')}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] transition-colors"
            >
              ← Voltar para Escala
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveStep('mapa')}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5] transition-colors"
            >
              ← Voltar para Mapa
            </button>
          )}

          <div className="flex items-center gap-2">
            {activeStep !== 'detalhes' && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'escala' ? 'mapa' : 'detalhes')}
                className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#EEF2F5] text-[#103557] hover:bg-[#E2F0FD] transition-colors"
              >
                Próximo
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#103557] hover:bg-[#2B4C6F] text-white shadow-sm transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Registro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
