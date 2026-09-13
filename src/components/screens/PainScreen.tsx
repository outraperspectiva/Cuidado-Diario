import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAddPainLogOpen, setQuickSosOpen, showToast } from '../../store/slices/uiSlice';
import { deletePainLog } from '../../store/slices/painSlice';
import { PainService } from '../../services/painService';
import { BodyMap } from '../pain/BodyMap';
import { BodyPart, PainLog } from '../../types';
import { Plus, AlertCircle, Trash2, Calendar, Clock, MapPin, Tag } from 'lucide-react';

export const PainScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.pain.logs);
  const user = useAppSelector((state) => state.auth.user);

  const [interactiveSelectedLocations, setInteractiveSelectedLocations] = useState<BodyPart[]>(['cervical', 'lombar']);
  const [filterType, setFilterType] = useState<'all' | 'flareups' | 'mild' | 'severe'>('all');

  const handleToggleLoc = (loc: BodyPart) => {
    setInteractiveSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente remover este registro?')) {
      await PainService.deleteLog(user?.uid || 'user-anon', id);
      dispatch(deletePainLog(id));
      dispatch(showToast({ message: 'Registro de dor removido.' }));
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'flareups') return log.isFlareUp || log.painLevel >= 7;
    if (filterType === 'mild') return log.painLevel <= 3;
    if (filterType === 'severe') return log.painLevel >= 6;
    return true;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header section with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#103557]">Diário de Dor & Sintomas</h2>
          <p className="text-xs text-[#53606B]">Acompanhamento topográfico e histórico de episódios</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setQuickSosOpen(true))}
            className="flex items-center gap-1 bg-[#D96B5B] hover:bg-[#B34045] text-white px-3 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
          <button
            onClick={() => dispatch(setAddPainLogOpen(true))}
            className="flex items-center gap-1.5 bg-[#103557] hover:bg-[#2B4C6F] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar</span>
          </button>
        </div>
      </div>

      {/* Interactive Anatomical Body Map Component */}
      <BodyMap
        selectedLocations={interactiveSelectedLocations}
        onToggleLocation={handleToggleLoc}
        painLevel={logs[0]?.painLevel || 4}
      />

      {/* History Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Todos os Registros' },
          { id: 'flareups', label: 'Crises (Flare-ups)' },
          { id: 'severe', label: 'Dor Severa (6-10)' },
          { id: 'mild', label: 'Dor Leve (0-3)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all border ${
              filterType === tab.id
                ? 'bg-[#103557] text-white border-[#103557] shadow-xs'
                : 'bg-white text-[#53606B] border-[#DCE3E8] hover:bg-[#EEF2F5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#DCE3E8] text-[#73777F] text-xs">
            Nenhum registro encontrado para este filtro.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const cat = PainService.getSeverityCategory(log.painLevel);
            const color = PainService.getSeverityColor(cat);
            const dateStr = new Date(log.timestamp).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-4 border border-[#DCE3E8] elevation-1 relative overflow-hidden transition-all"
                style={{ borderLeftWidth: '4px', borderLeftColor: color }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl font-extrabold tabular-nums"
                      style={{ color }}
                    >
                      {log.painLevel}/10
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs"
                          style={{ backgroundColor: color }}
                        >
                          {PainService.getSeverityLabel(cat)}
                        </span>
                        {log.isFlareUp && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A]">
                            Crise Aguda
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#73777F] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {dateStr}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-[#73777F] hover:text-[#D96B5B] p-1.5 rounded-lg hover:bg-[#FFDAD6]/30 transition-colors"
                    title="Excluir Registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Locations & Triggers */}
                <div className="mt-3 pt-2.5 border-t border-[#DCE3E8]/60 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-[#103557] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#356572]" /> Regiões:
                    </span>
                    {log.bodyLocations.map((loc) => (
                      <span
                        key={loc}
                        className="px-2 py-0.5 bg-[#E2F0FD] text-[#2B4C6F] font-semibold rounded-md text-[11px] capitalize"
                      >
                        {loc.replace('_', ' ')}
                      </span>
                    ))}
                    <span className="text-[11px] text-[#53606B] font-medium ml-1">
                      • Tipo: <strong className="capitalize">{log.painType.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  {log.triggers.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[#103557] flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#356572]" /> Gatilhos:
                      </span>
                      {log.triggers.map((trig) => (
                        <span key={trig} className="px-2 py-0.5 bg-[#EEF2F5] text-[#53606B] rounded-md text-[10px]">
                          {trig}
                        </span>
                      ))}
                    </div>
                  )}

                  {log.reliefActions && log.reliefActions.length > 0 && (
                    <div className="text-[11px] text-[#003B2E] bg-[#AFF0D8]/30 p-2 rounded-xl">
                      <strong>Alívio utilizado:</strong> {log.reliefActions.join(', ')}
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-xs text-[#53606B] italic bg-[#F6F8FA] p-2.5 rounded-xl border border-[#DCE3E8]/50">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
