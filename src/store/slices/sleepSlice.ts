import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SleepLog } from '../../types';

interface SleepState {
  logs: SleepLog[];
  isLoading: boolean;
  error: string | null;
}

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

export const initialSleepLogs: SleepLog[] = [
  {
    id: 'sleep-01',
    userId: 'melhora-user-7841',
    date: formatDate(today),
    durationHours: 6,
    durationMinutes: 45,
    qualityRating: 3,
    wakeUpsCount: 2,
    sleepTime: '23:30',
    wakeTime: '06:15',
    disruptions: ['dor_noturna', 'despertar_precoce'],
    restedScore: 65,
    notes: 'Acordei por volta das 03:00 com dor na lombar, mas consegui voltar a dormir após trocar de travesseiro.'
  },
  {
    id: 'sleep-02',
    userId: 'melhora-user-7841',
    date: formatDate(new Date(Date.now() - 86400000)),
    durationHours: 7,
    durationMinutes: 30,
    qualityRating: 4,
    wakeUpsCount: 1,
    sleepTime: '23:00',
    wakeTime: '06:30',
    disruptions: [],
    restedScore: 82,
    notes: 'Noite tranquila com sono reparador.'
  },
  {
    id: 'sleep-03',
    userId: 'melhora-user-7841',
    date: formatDate(new Date(Date.now() - 86400000 * 2)),
    durationHours: 5,
    durationMinutes: 15,
    qualityRating: 2,
    wakeUpsCount: 4,
    sleepTime: '00:15',
    wakeTime: '05:30',
    disruptions: ['dor_noturna', 'insonia'],
    restedScore: 40,
    notes: 'Forte desconforto cervical durante a madrugada.'
  },
  {
    id: 'sleep-04',
    userId: 'melhora-user-7841',
    date: formatDate(new Date(Date.now() - 86400000 * 3)),
    durationHours: 7,
    durationMinutes: 0,
    qualityRating: 4,
    wakeUpsCount: 1,
    sleepTime: '23:00',
    wakeTime: '06:00',
    disruptions: [],
    restedScore: 78,
    notes: 'Boa recuperação muscular.'
  }
];

const initialState: SleepState = {
  logs: initialSleepLogs,
  isLoading: false,
  error: null
};

export const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    addSleepLog: (state, action: PayloadAction<SleepLog>) => {
      // replace if same date exists or prepend
      const existingIdx = state.logs.findIndex(l => l.date === action.payload.date);
      if (existingIdx >= 0) {
        state.logs[existingIdx] = action.payload;
      } else {
        state.logs.unshift(action.payload);
      }
    },
    updateSleepLog: (state, action: PayloadAction<SleepLog>) => {
      const idx = state.logs.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) {
        state.logs[idx] = action.payload;
      }
    },
    deleteSleepLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter(l => l.id !== action.payload);
    },
    setUserSleepLogs: (state, action: PayloadAction<SleepLog[]>) => {
      state.logs = action.payload;
    },
    resetSleepLogs: (state) => {
      state.logs = [];
    }
  }
});

export const {
  addSleepLog,
  updateSleepLog,
  deleteSleepLog,
  setUserSleepLogs,
  resetSleepLogs
} = sleepSlice.actions;
export default sleepSlice.reducer;
