import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PainLog, PainLevel, SeverityCategory } from '../../types';

interface PainState {
  logs: PainLog[];
  selectedLog: PainLog | null;
  isLoading: boolean;
  error: string | null;
  currentDraft: {
    painLevel: PainLevel;
    painType: PainLog['painType'];
    bodyLocations: PainLog['bodyLocations'];
    triggers: string[];
    reliefActions: string[];
    notes: string;
    isFlareUp: boolean;
  };
}

export const getSeverityCategory = (level: number): SeverityCategory => {
  if (level <= 2) return 'mild';
  if (level <= 5) return 'moderate';
  if (level <= 8) return 'severe';
  return 'intense';
};

export const initialPainLogs: PainLog[] = [
  {
    id: 'log-01',
    userId: 'serene-user-7841',
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    painLevel: 4,
    severityCategory: 'moderate',
    painType: 'pulsatil',
    bodyLocations: ['cervical', 'ombro_direito'],
    triggers: ['Postura prolongada', 'Estresse laboral'],
    reliefActions: ['Compressa morna', 'Alongamento suave'],
    notes: 'Desconforto iniciou após reunião longa em frente ao computador.',
    isFlareUp: false,
  },
  {
    id: 'log-02',
    userId: 'serene-user-7841',
    timestamp: new Date(Date.now() - 3600 * 1000 * 22).toISOString(),
    painLevel: 7,
    severityCategory: 'severe',
    painType: 'em_pontada',
    bodyLocations: ['lombar', 'quadril'],
    triggers: ['Mudança climática', 'Sono insuficiente'],
    reliefActions: ['Repouso no escuro', 'Medicação prescrita'],
    notes: 'Crise mais intensa ao levantar da cama pela manhã.',
    isFlareUp: true,
  },
  {
    id: 'log-03',
    userId: 'serene-user-7841',
    timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    painLevel: 2,
    severityCategory: 'mild',
    painType: 'constante',
    bodyLocations: ['joelho_direito'],
    triggers: ['Caminhada longa'],
    reliefActions: ['Gelo local'],
    notes: 'Dor tolerável e bem controlada.',
    isFlareUp: false,
  },
  {
    id: 'log-04',
    userId: 'serene-user-7841',
    timestamp: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    painLevel: 5,
    severityCategory: 'moderate',
    painType: 'pressao',
    bodyLocations: ['cabeca', 'cervical'],
    triggers: ['Sensibilidade à luz', 'Tensão muscular'],
    reliefActions: ['Hidratação', 'Ambiente silencioso'],
    notes: 'Tensão na base da nuca irradiando para fronte.',
    isFlareUp: false,
  },
  {
    id: 'log-05',
    userId: 'serene-user-7841',
    timestamp: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    painLevel: 3,
    severityCategory: 'moderate',
    painType: 'latejante',
    bodyLocations: ['ombro_esquerdo'],
    triggers: ['Carregar peso'],
    reliefActions: ['Alongamento'],
    notes: 'Melhorou após banho quente.',
    isFlareUp: false,
  }
];

const initialState: PainState = {
  logs: initialPainLogs,
  selectedLog: null,
  isLoading: false,
  error: null,
  currentDraft: {
    painLevel: 3,
    painType: 'constante',
    bodyLocations: ['cervical'],
    triggers: ['Postura prolongada'],
    reliefActions: ['Alongamento suave'],
    notes: '',
    isFlareUp: false,
  }
};

export const painSlice = createSlice({
  name: 'pain',
  initialState,
  reducers: {
    setPainDraftLevel: (state, action: PayloadAction<PainLevel>) => {
      state.currentDraft.painLevel = action.payload;
    },
    setPainDraftType: (state, action: PayloadAction<PainLog['painType']>) => {
      state.currentDraft.painType = action.payload;
    },
    toggleBodyLocation: (state, action: PayloadAction<PainLog['bodyLocations'][number]>) => {
      const location = action.payload;
      const index = state.currentDraft.bodyLocations.indexOf(location);
      if (index >= 0) {
        state.currentDraft.bodyLocations.splice(index, 1);
      } else {
        state.currentDraft.bodyLocations.push(location);
      }
    },
    toggleTrigger: (state, action: PayloadAction<string>) => {
      const trigger = action.payload;
      const index = state.currentDraft.triggers.indexOf(trigger);
      if (index >= 0) {
        state.currentDraft.triggers.splice(index, 1);
      } else {
        state.currentDraft.triggers.push(trigger);
      }
    },
    toggleReliefAction: (state, action: PayloadAction<string>) => {
      const relief = action.payload;
      const index = state.currentDraft.reliefActions.indexOf(relief);
      if (index >= 0) {
        state.currentDraft.reliefActions.splice(index, 1);
      } else {
        state.currentDraft.reliefActions.push(relief);
      }
    },
    setDraftNotes: (state, action: PayloadAction<string>) => {
      state.currentDraft.notes = action.payload;
    },
    setDraftFlareUp: (state, action: PayloadAction<boolean>) => {
      state.currentDraft.isFlareUp = action.payload;
    },
    resetDraft: (state) => {
      state.currentDraft = {
        painLevel: 3,
        painType: 'constante',
        bodyLocations: ['cervical'],
        triggers: [],
        reliefActions: [],
        notes: '',
        isFlareUp: false,
      };
    },
    addPainLog: (state, action: PayloadAction<PainLog>) => {
      state.logs.unshift(action.payload);
    },
    setUserPainLogs: (state, action: PayloadAction<PainLog[]>) => {
      state.logs = action.payload;
      state.selectedLog = null;
    },
    resetPainLogs: (state) => {
      state.logs = [];
      state.selectedLog = null;
    },
    updatePainLog: (state, action: PayloadAction<PainLog>) => {
      const idx = state.logs.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) {
        state.logs[idx] = action.payload;
      }
    },
    deletePainLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter(l => l.id !== action.payload);
    },
    setSelectedLog: (state, action: PayloadAction<PainLog | null>) => {
      state.selectedLog = action.payload;
    }
  }
});

export const {
  setPainDraftLevel,
  setPainDraftType,
  toggleBodyLocation,
  toggleTrigger,
  toggleReliefAction,
  setDraftNotes,
  setDraftFlareUp,
  resetDraft,
  addPainLog,
  setUserPainLogs,
  resetPainLogs,
  updatePainLog,
  deletePainLog,
  setSelectedLog
} = painSlice.actions;

export default painSlice.reducer;
