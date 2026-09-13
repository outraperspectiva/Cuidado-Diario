import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuickSosOpen, showToast } from '../../store/slices/uiSlice';
import { addPainLog } from '../../store/slices/painSlice';
import { PainService } from '../../services/painService';
import { BodyPart, PainLevel } from '../../types';
import { AlertCircle, X, Check, Phone, ShieldAlert } from 'lucide-react';

export const QuickSosModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQuickSosOpen);
  const user = useAppSelector((state) => state.auth.user);

  const [painLvl, setPainLvl] = useState<PainLevel>(8);
  const [selectedZone, setSelectedZone] = useState<BodyPart>('lombar');
  const [tookRescueMed, setTookRescueMed] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Crise aguda de dor iniciada repentinamente.');

  if (!isOpen) return null;

  const handleSaveSos = async () => {
    const newLog = await PainService.createLog(user?.uid || 'user-anon', {
      timestamp: new Date().toISOString(),
      painLevel: painLvl,
      severityCategory: PainService.getSeverityCategory(painLvl),
      painType: 'pulsatil',
      bodyLocations: [selectedZone],
      triggers: ['Crise Espontânea / Flare-up'],
      reliefActions: tookRescueMed ? ['Medicação de resgate', 'Repouso imediato'] : ['Repouso imediato'],
      notes: notes,
      isFlareUp: true,
    });

    dispatch(addPainLog(newLog));
    dispatch(setQuickSosOpen(false));
    dispatch(showToast({ message: 'Crise registrada! Respire com calma e siga o plano de alívio.', type: 'warning' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border-2 border-[#D96B5B] elevation-3 flex flex-col">
        {/* Banner */}
        <div className="bg-[#D96B5B] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">Registro Rápido de Crise (SOS)</h2>
              <p className="text-[11px] text-white/90">Registro imediato para seu histórico de dor e saúde</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setQuickSosOpen(false))}
            className="p-1.5 rounded-full hover:bg-black/15 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Quick Level Buttons */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-2 uppercase tracking-wider">
              Nível da Crise no momento
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {([6, 7, 8, 9, 10] as PainLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPainLvl(lvl)}
                  className={`h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm transition-all ${
                    painLvl === lvl
                      ? 'bg-[#B34045] text-white shadow-md scale-105'
                      : 'bg-[#FFDAD6]/40 text-[#93000A] border border-[#FFDAD6] hover:bg-[#FFDAD6]'
                  }`}
                >
                  <span className="tabular-nums text-base">{lvl}</span>
                  <span className="text-[9px] font-medium">{lvl >= 9 ? 'Crítica' : 'Severa'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Zone Picker */}
          <div>
            <label className="block text-xs font-bold text-[#103557] mb-1.5 uppercase tracking-wider">
              Ponto Principal da Dor
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'lombar', label: 'Lombar' },
                { id: 'cervical', label: 'Cervical / Nuca' },
                { id: 'cabeca', label: 'Cabeça / Face' },
                { id: 'ombro_direito', label: 'Ombros' },
                { id: 'quadril', label: 'Quadril' },
                { id: 'joelho_direito', label: 'Joelhos' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id as BodyPart)}
                  className={`py-2 px-2 rounded-xl text-center font-semibold transition-all border ${
                    selectedZone === zone.id
                      ? 'bg-[#2B4C6F] text-white border-[#2B4C6F] shadow-xs'
                      : 'bg-[#EEF2F5] text-[#53606B] border-transparent hover:bg-[#E2F0FD]'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Took Rescue Medication Toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA] border border-[#DCE3E8] cursor-pointer">
            <input
              type="checkbox"
              checked={tookRescueMed}
              onChange={(e) => setTookRescueMed(e.target.checked)}
              className="w-4 h-4 rounded text-[#2B4C6F] focus:ring-[#2B4C6F]"
            />
            <div className="text-xs">
              <span className="font-bold text-[#103557] block">Tomei medicação de resgate prescrita</span>
              <span className="text-[11px] text-[#53606B]">Registra dose extra no histórico farmacológico</span>
            </div>
          </label>

          {/* Emergency Contact Quick Call */}
          {user?.emergencyContact && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#E2F0FD] border border-[#B7E7F7]">
              <div>
                <div className="text-[11px] font-bold text-[#103557]">Contato de Apoio / Emergência:</div>
                <div className="text-xs font-semibold text-[#2B4C6F]">{user.emergencyContact.name}</div>
              </div>
              <a
                href={`tel:${user.emergencyContact.phone}`}
                className="flex items-center gap-1 bg-[#103557] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#2B4C6F] transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Ligar</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F6F8FA] border-t border-[#DCE3E8] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => dispatch(setQuickSosOpen(false))}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-[#53606B] hover:bg-[#EEF2F5]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveSos}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold bg-[#D96B5B] hover:bg-[#B34045] text-white shadow-sm transition-all active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Registro SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
