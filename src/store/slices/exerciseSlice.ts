import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseLog } from '../../types';

interface ExerciseState {
  logs: ExerciseLog[];
  isLoading: boolean;
  error: string | null;
}

const now = Date.now();

export const initialExerciseLogs: ExerciseLog[] = [
  {
    id: 'ex-01',
    userId: 'melhora-user-7841',
    date: new Date(now - 1000 * 60 * 60 * 3.5).toISOString(),
    activityType: 'alongamento',
    durationMinutes: 20,
    intensity: 'leve',
    painImpact: 'aliviou',
    notes: 'Sessão matinal de liberação miofascial e respiração diafragmática.'
  },
  {
    id: 'ex-02',
    userId: 'melhora-user-7841',
    date: new Date(now - 86400000 * 1 - 1000 * 60 * 180).toISOString(),
    activityType: 'fisioterapia',
    durationMinutes: 45,
    intensity: 'moderada',
    painImpact: 'aliviou',
    notes: 'Mobilização neural de membros superiores com exercícios específicos.',
    physiotherapyDetails: {
      upperLimbExercises: ['ulnt_1', 'ulnt_2b'],
      laterality: 'bilateral',
      sets: 3,
      repetitions: 10,
      holdTimeSeconds: 10,
      painDuring: 2,
      painAfter: 1,
      sensationType: 'tensao_muscular_suave',
      perceivedEffort: 'moderado',
      comments: 'Excelente resposta à técnica ULNT 1 e ULNT 2b sem despertar parestesia residual.'
    }
  },
  {
    id: 'ex-03',
    userId: 'melhora-user-7841',
    date: new Date(now - 86400000 * 2 - 1000 * 60 * 300).toISOString(),
    activityType: 'caminhada',
    durationMinutes: 30,
    intensity: 'leve',
    painImpact: 'neutro',
    notes: 'Caminhada suave no parque em ritmo constante.'
  },
  {
    id: 'ex-04',
    userId: 'melhora-user-7841',
    date: new Date(now - 86400000 * 4 - 1000 * 60 * 240).toISOString(),
    activityType: 'hidroginastica',
    durationMinutes: 40,
    intensity: 'moderada',
    painImpact: 'aliviou',
    notes: 'Exercícios em água aquecida proporcionaram grande alívio de peso nas articulações.'
  }
];

const initialState: ExerciseState = {
  logs: initialExerciseLogs,
  isLoading: false,
  error: null
};

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    addExerciseLog: (state, action: PayloadAction<ExerciseLog>) => {
      state.logs.unshift(action.payload);
    },
    updateExerciseLog: (state, action: PayloadAction<ExerciseLog>) => {
      const idx = state.logs.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) {
        state.logs[idx] = action.payload;
      }
    },
    deleteExerciseLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter(e => e.id !== action.payload);
    },
    setUserExerciseLogs: (state, action: PayloadAction<ExerciseLog[]>) => {
      state.logs = action.payload;
    },
    resetExerciseLogs: (state) => {
      state.logs = [];
    }
  }
});

export const {
  addExerciseLog,
  updateExerciseLog,
  deleteExerciseLog,
  setUserExerciseLogs,
  resetExerciseLogs
} = exerciseSlice.actions;
export default exerciseSlice.reducer;
