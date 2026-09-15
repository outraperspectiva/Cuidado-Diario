import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseLog, PhysiotherapyPrescription, PhysiotherapyExecution } from '../../types';

interface ExerciseState {
  logs: ExerciseLog[];
  prescriptions: PhysiotherapyPrescription[];
  todayExecutions: PhysiotherapyExecution[];
  historyExecutions: PhysiotherapyExecution[];
  isLoading: boolean;
  error: string | null;
}

const now = Date.now();
const todayStr = new Date().toISOString().split('T')[0];

export const initialPhysioPrescriptions: PhysiotherapyPrescription[] = [
  {
    id: 'physio-rx-01',
    userId: 'melhora-user-7841',
    title: 'Neurodinâmica / Mobilização Neural de Membros Superiores (ULNT)',
    isChronic: false,
    timesPerDay: 2,
    durationDays: 28,
    scheduledTimes: ['09:00', '16:00'],
    instructions: 'Realizar 3 séries de 10 repetições por lado com 10 segundos de sustentação. Respeitar o limiar de dor.',
    prescribedBy: 'Dra. Patrícia Lima (Fisioterapeuta)',
    isActive: true,
    startDate: new Date(now - 86400000 * 14).toISOString().split('T')[0],
    endDate: new Date(now + 86400000 * 14).toISOString().split('T')[0],
    createdAt: new Date(now - 86400000 * 14).toISOString(),
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
      comments: 'Protocolo de neurodinâmica para membros superiores'
    }
  }
];

// Generate comprehensive clinical demo executions covering 14 days
const generateInitialExecutions = (): PhysiotherapyExecution[] => {
  const result: PhysiotherapyExecution[] = [];
  // Status patterns for past 14 days: [day13Ago ... day1Ago, today]
  // 1 means 2 of 2 completed (100%), 0.5 means 1 of 2 completed (50%)
  const patterns = [1, 0.5, 1, 1, 0.5, 1, 1, 1, 0.5, 1, 1, 1, 1, 'today'];

  patterns.forEach((pattern, index) => {
    const daysAgo = patterns.length - 1 - index;
    const dateObj = new Date(now - daysAgo * 86400000);
    const dateStr = dateObj.toISOString().split('T')[0];

    if (daysAgo === 0) {
      // Today: Session 1 completed, Session 2 pending
      result.push(
        {
          id: 'physio-exec-today-1',
          userId: 'melhora-user-7841',
          prescriptionId: 'physio-rx-01',
          prescriptionTitle: 'Neurodinâmica de Membros Superiores (ULNT)',
          scheduledTime: '09:00',
          sessionNumber: 1,
          totalSessions: 2,
          status: 'completed',
          completedAt: `${dateStr}T09:25:00.000Z`,
          date: dateStr
        },
        {
          id: 'physio-exec-today-2',
          userId: 'melhora-user-7841',
          prescriptionId: 'physio-rx-01',
          prescriptionTitle: 'Neurodinâmica de Membros Superiores (ULNT)',
          scheduledTime: '16:00',
          sessionNumber: 2,
          totalSessions: 2,
          status: 'pending',
          date: dateStr
        }
      );
    } else {
      const s1Completed = true;
      const s2Completed = pattern === 1;

      result.push(
        {
          id: `physio-exec-past-${daysAgo}-1`,
          userId: 'melhora-user-7841',
          prescriptionId: 'physio-rx-01',
          prescriptionTitle: 'Neurodinâmica de Membros Superiores (ULNT)',
          scheduledTime: '09:00',
          sessionNumber: 1,
          totalSessions: 2,
          status: s1Completed ? 'completed' : 'pending',
          completedAt: s1Completed ? `${dateStr}T09:20:00.000Z` : undefined,
          date: dateStr
        },
        {
          id: `physio-exec-past-${daysAgo}-2`,
          userId: 'melhora-user-7841',
          prescriptionId: 'physio-rx-01',
          prescriptionTitle: 'Neurodinâmica de Membros Superiores (ULNT)',
          scheduledTime: '16:00',
          sessionNumber: 2,
          totalSessions: 2,
          status: s2Completed ? 'completed' : 'pending',
          completedAt: s2Completed ? `${dateStr}T16:30:00.000Z` : undefined,
          date: dateStr
        }
      );
    }
  });

  return result;
};

export const initialPhysioExecutions: PhysiotherapyExecution[] = generateInitialExecutions();

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
  prescriptions: initialPhysioPrescriptions,
  todayExecutions: initialPhysioExecutions.filter(e => e.date === todayStr),
  historyExecutions: initialPhysioExecutions,
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
    setUserExerciseData: (
      state,
      action: PayloadAction<{
        logs: ExerciseLog[];
        prescriptions?: PhysiotherapyPrescription[];
        todayExecutions?: PhysiotherapyExecution[];
        historyExecutions?: PhysiotherapyExecution[];
      }>
    ) => {
      state.logs = action.payload.logs;
      if (action.payload.prescriptions) {
        state.prescriptions = action.payload.prescriptions;
      }
      if (action.payload.todayExecutions) {
        state.todayExecutions = action.payload.todayExecutions;
      }
      if (action.payload.historyExecutions) {
        state.historyExecutions = action.payload.historyExecutions;
      } else if (action.payload.todayExecutions) {
        // Merge or keep existing
        const todayIds = new Set(action.payload.todayExecutions.map(e => e.id));
        const kept = (state.historyExecutions || []).filter(e => !todayIds.has(e.id));
        state.historyExecutions = [...action.payload.todayExecutions, ...kept];
      }
    },
    resetExerciseLogs: (state) => {
      state.logs = [];
      state.prescriptions = [];
      state.todayExecutions = [];
      state.historyExecutions = [];
    },
    addPhysioPrescription: (state, action: PayloadAction<PhysiotherapyPrescription>) => {
      state.prescriptions.push(action.payload);
      const rx = action.payload;
      const isWithinPeriod = !rx.endDate || (todayStr >= rx.startDate && todayStr <= rx.endDate);
      if (rx.isActive && isWithinPeriod) {
        const count = rx.timesPerDay || rx.scheduledTimes.length || 1;
        for (let i = 0; i < count; i++) {
          const time = rx.scheduledTimes[i] || `${String(8 + i * 4).padStart(2, '0')}:00`;
          const newExec: PhysiotherapyExecution = {
            id: `physio-exec-${Date.now()}-${i}`,
            userId: rx.userId,
            prescriptionId: rx.id,
            prescriptionTitle: rx.title,
            scheduledTime: time,
            sessionNumber: i + 1,
            totalSessions: count,
            status: 'pending',
            date: todayStr
          };
          state.todayExecutions.push(newExec);
          state.historyExecutions.push(newExec);
        }
      }
    },
    updatePhysioPrescription: (state, action: PayloadAction<PhysiotherapyPrescription>) => {
      const idx = state.prescriptions.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.prescriptions[idx] = action.payload;
      }
    },
    deletePhysioPrescription: (state, action: PayloadAction<string>) => {
      state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
      state.todayExecutions = state.todayExecutions.filter(e => e.prescriptionId !== action.payload);
      state.historyExecutions = state.historyExecutions.filter(e => e.prescriptionId !== action.payload);
    },
    togglePhysioExecutionStatus: (
      state,
      action: PayloadAction<{ id: string; status?: 'completed' | 'pending' }>
    ) => {
      const exec = state.todayExecutions.find(e => e.id === action.payload.id);
      let newStatus: 'completed' | 'pending' = 'completed';
      let completedAt: string | undefined = undefined;

      if (exec) {
        if (action.payload.status) {
          exec.status = action.payload.status;
          exec.completedAt = action.payload.status === 'completed' ? new Date().toISOString() : undefined;
        } else {
          if (exec.status === 'completed') {
            exec.status = 'pending';
            exec.completedAt = undefined;
          } else {
            exec.status = 'completed';
            exec.completedAt = new Date().toISOString();
          }
        }
        newStatus = exec.status;
        completedAt = exec.completedAt;
      }

      // Keep historyExecutions synchronized
      const histExec = state.historyExecutions.find(e => e.id === action.payload.id);
      if (histExec) {
        histExec.status = newStatus;
        histExec.completedAt = completedAt;
      } else if (exec) {
        state.historyExecutions.push({ ...exec });
      }
    }
  }
});

export const {
  addExerciseLog,
  updateExerciseLog,
  deleteExerciseLog,
  setUserExerciseLogs,
  setUserExerciseData,
  resetExerciseLogs,
  addPhysioPrescription,
  updatePhysioPrescription,
  deletePhysioPrescription,
  togglePhysioExecutionStatus
} = exerciseSlice.actions;
export default exerciseSlice.reducer;
